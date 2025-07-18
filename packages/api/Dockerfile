FROM oven/bun:1

WORKDIR /app

# Copy root workspace files
COPY package.json .
COPY bun.lockb .

# Copy API package
COPY packages/api ./packages/api

# Install dependencies
RUN bun install --frozen-lockfile

# Set environment to production
ENV NODE_ENV=production

# Start the server
CMD ["bun", "packages/api/src/index.ts"]
