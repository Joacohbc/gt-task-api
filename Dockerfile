FROM node:18-alpine

WORKDIR /app

# Copy the rest of the application
COPY . .

RUN npm install --global pnpm

# Install dependencies
RUN pnpm config set auto-install-peers true
RUN pnpm install

# Build the app if it's a TypeScript project
RUN pnpm run vercel-build

# Command to run the app
CMD ["node", "dist/main" ]
