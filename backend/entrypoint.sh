#!/bin/sh
set -e

# Production mode: Medusa uses compiled JS instead of ts-node
export NODE_ENV=production

# Run migrations from .medusa/server where medusa-config.js (compiled) lives
echo "Running database migrations..."
cd /app/.medusa/server && /app/node_modules/.bin/medusa db:migrate

# Back to app root for pg queries
cd /app

# Find the pg module in the pnpm store
PG_PATH=$(ls -d /app/node_modules/.pnpm/pg@*/node_modules/pg 2>/dev/null | head -1)

if [ -n "$PG_PATH" ]; then
  # Check if seed has already been run (publishable key exists)
  KEY_EXISTS=$(node -e "
    const {Pool}=require('$PG_PATH');
    const p=new Pool({connectionString:process.env.DATABASE_URL});
    p.query(\"SELECT COUNT(*) as count FROM api_key WHERE type='publishable'\")
     .then(r=>{ process.stdout.write(r.rows[0].count); return p.end(); })
     .catch(()=>{ process.stdout.write('0'); });
  " 2>/dev/null || echo "0")

  # Run base seed on first install — from .medusa/server using compiled seed.js
  if [ "$KEY_EXISTS" = "0" ] || [ -z "$KEY_EXISTS" ]; then
    echo "First install detected. Running base seed..."
    cd /app/.medusa/server && /app/node_modules/.bin/medusa exec ./src/scripts/seed.js \
      || echo "Warning: Seed may have partially failed (continuing)"
    cd /app
  else
    echo "Base seed already applied. Skipping."
  fi

  # Always run jewelry seed — it is idempotent and self-skips when
  # jewelry categories + collections are already in place. This means a
  # future release that adds new jewelry categories/products auto-applies
  # on the next boot with zero manual intervention.
  echo "Running jewelry seed (idempotent)..."
  cd /app/.medusa/server && /app/node_modules/.bin/medusa exec ./src/scripts/seed-jewelry.js \
    || echo "Warning: Jewelry seed may have partially failed (continuing)"
  cd /app

  # Write publishable key to shared volume for storefront
  echo "Writing publishable key to shared volume..."
  mkdir -p /shared
  node -e "
    const {Pool}=require('$PG_PATH');
    const p=new Pool({connectionString:process.env.DATABASE_URL});
    p.query(\"SELECT token FROM api_key WHERE type='publishable' LIMIT 1\")
     .then(r=>{
       if(r.rows[0]){
         require('fs').writeFileSync('/shared/publishable_key', r.rows[0].token);
         console.log('Publishable key saved.');
       } else {
         console.log('No publishable key found in DB.');
       }
       return p.end();
     })
     .catch(e=>console.error('Warning: could not save key:', e.message));
  " 2>/dev/null || true
else
  echo "Warning: pg module not found, skipping publishable key sharing."
fi

echo "Starting Medusa backend..."
cd /app/.medusa/server && exec /app/node_modules/.bin/medusa start