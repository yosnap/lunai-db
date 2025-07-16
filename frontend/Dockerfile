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

# Create environment file with build-time API_URL
RUN echo "export const environment = {" > src/environments/environment.prod.ts && \
    echo "  production: true," >> src/environments/environment.prod.ts && \
    echo "  apiUrl: '${API_URL:-https://api.lun-ai.es}/api'" >> src/environments/environment.prod.ts && \
    echo "};" >> src/environments/environment.prod.ts

# Build the application
RUN npm run build:prod

# Expose port
EXPOSE 4200

# Serve the application
CMD ["npx", "serve", "-s", "dist", "-l", "4200", "-c", "serve.json"]