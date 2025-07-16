# Multi-stage build for monorepo
FROM node:18-alpine AS base

# Install dependencies
RUN apk add --no-cache python3 make g++

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install root dependencies
RUN npm ci --only=production

# Install backend dependencies
WORKDIR /app/backend
RUN npm ci --only=production

# Install frontend dependencies
WORKDIR /app/frontend
RUN npm ci

# Build stage for frontend
FROM base AS frontend-build
WORKDIR /app

# Copy frontend source and build script
COPY frontend/ ./frontend/
COPY build-frontend.sh .

# Make script executable and run build
RUN chmod +x build-frontend.sh && ./build-frontend.sh

# Production stage
FROM node:18-alpine AS production
WORKDIR /app

# Copy backend files
COPY backend/ ./backend/
COPY --from=base /app/backend/node_modules ./backend/node_modules

# Copy built frontend
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

# Create startup script
RUN echo '#!/bin/sh' > start.sh && \
    echo 'echo "Starting backend with environment: $NODE_ENV"' >> start.sh && \
    echo 'echo "Database host: $DB_HOST"' >> start.sh && \
    echo 'echo "Frontend URL: $FRONTEND_URL"' >> start.sh && \
    echo 'cd /app/backend && node index.js &' >> start.sh && \
    echo 'cd /app/frontend && npx serve -s dist -l 4200 -c serve.json &' >> start.sh && \
    echo 'wait' >> start.sh && \
    chmod +x start.sh

# Expose ports
EXPOSE 3010 4200

# Start both services
CMD ["./start.sh"]