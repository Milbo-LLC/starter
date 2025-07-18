FROM oven/bun:1

WORKDIR /app

# Copy API package files first
COPY . ./

# Go up one directory and copy workspace files
COPY ../../package.json ./
COPY ../../bun.lockb ./

# Install dependencies
RUN bun install --frozen-lockfile

# Set environment to production
ENV NODE_ENV=production

# Start the server
CMD ["bun", "src/index.ts"]
