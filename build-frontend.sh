#!/bin/bash

# Set default API_URL if not provided
API_URL=${API_URL:-"https://api.lun-ai.es"}

# Create production environment file
cat > frontend/src/environments/environment.prod.ts << EOF
export const environment = {
  production: true,
  apiUrl: '${API_URL}/api'
};
EOF

echo "Environment file created with API_URL: ${API_URL}/api"

# Build frontend
cd frontend
npm run build:prod