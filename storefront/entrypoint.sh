#!/bin/sh
set -e

# If publishable key is not already set, wait for it from the backend shared volume
if [ -z "$NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY" ]; then
  echo "Waiting for publishable key from backend..."
  TIMEOUT=120
  ELAPSED=0
  while [ $ELAPSED -lt $TIMEOUT ]; do
    if [ -f /shared/publishable_key ] && [ -s /shared/publishable_key ]; then
      PUB_KEY=$(cat /shared/publishable_key | tr -d '[:space:]')
      if [ -n "$PUB_KEY" ]; then
        export NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY="$PUB_KEY"
        echo "Got publishable key: ${PUB_KEY%"${PUB_KEY#????????????????}"}..."
        break
      fi
    fi
    sleep 3
    ELAPSED=$((ELAPSED + 3))
  done

  if [ -z "$NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY" ]; then
    echo "Warning: Could not get publishable key after ${TIMEOUT}s. Building anyway."
  fi
else
  echo "Using publishable key from environment."
fi

echo "Ensuring dependencies are up to date..."
yarn install

echo "Building storefront..."
yarn build

echo "Starting storefront..."
exec yarn start
