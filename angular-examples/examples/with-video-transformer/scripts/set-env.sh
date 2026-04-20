#!/bin/bash
# Generate environment.ts from .env file

ENV_DIR="$(dirname "$0")/../src/environments"
mkdir -p "$ENV_DIR"

# Read from .env file in angular-examples root
ENV_FILE="$(dirname "$0")/../../../.env"
if [ -f "$ENV_FILE" ]; then
  BASE_URL=$(grep '^VITE_BASE_URL=' "$ENV_FILE" | cut -d= -f2-)
fi

# Fallback to env var or default
BASE_URL="${BASE_URL:-${VITE_BASE_URL:-https://realtime.cloudflare.com}}"

cat > "$ENV_DIR/environment.ts" << EOF
export const environment = {
  production: false,
  baseUrl: '${BASE_URL}',
};
EOF

echo "Generated environment.ts with baseUrl: ${BASE_URL}"
