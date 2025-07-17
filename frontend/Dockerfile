# Frontend-only Dockerfile for EasyPanel
FROM node:18-alpine

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build:prod

# Verify build output and copy serve.json
RUN ls -la dist/ && cp serve.json dist/

# Expose port
EXPOSE 80

# Serve the application
CMD ["npx", "serve", "-s", "dist", "-l", "80"]