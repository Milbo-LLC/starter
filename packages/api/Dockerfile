FROM oven/bun:1

WORKDIR /app

# Copy package files for workspace
COPY package.json .
COPY bun.lockb .
COPY packages/api/package.json ./packages/api/
COPY packages/db/package.json ./packages/db/

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY packages/api/src ./packages/api/src
COPY packages/api/tsconfig.json ./packages/api/
COPY packages/db/src ./packages/db/src
COPY packages/db/tsconfig.json ./packages/db/
COPY tsconfig.json .

# Set environment to production
ENV NODE_ENV=production

# Start the server
CMD ["bun", "packages/api/src/index.ts"]
