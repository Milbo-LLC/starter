FROM oven/bun:1

WORKDIR /app

# Copy package files
COPY package.json .
COPY src ./src
COPY tsconfig.json .

# Install dependencies
RUN bun install

# Set environment to production
ENV NODE_ENV=production

# Start the server using npm script
CMD ["bun", "run", "start"]
