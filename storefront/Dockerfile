FROM node:20-alpine
WORKDIR /app
RUN corepack enable

# Copy ALL source first (including .yarnrc.yml and .yarn config)
COPY . .

# Install deps AFTER copy — ensures Yarn state file is created fresh and not overwritten
RUN yarn install

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
EXPOSE 8000
ENTRYPOINT ["/entrypoint.sh"]