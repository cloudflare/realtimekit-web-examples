#!/bin/bash
# Generate environment.ts from .env file

ENV_DIR="$(dirname "$0")/../src/environments"
mkdir -p "$ENV_DIR"

# Priority: env var > .env file > default
if [ -n "${VITE_BASE_URL:-}" ]; then
  BASE_URL="$VITE_BASE_URL"
else
  ENV_FILE="$(dirname "$0")/../../../.env"
  if [ -f "$ENV_FILE" ]; then
    BASE_URL=$(grep -m1 '^VITE_BASE_URL=' "$ENV_FILE" | sed 's/^VITE_BASE_URL=//')
  fi
  BASE_URL="${BASE_URL:-realtime.cloudflare.com}"
fi

cat > "$ENV_DIR/environment.ts" << EOF
export const environment = {
  baseUrl: '${BASE_URL}',
};
EOF

echo "Generated environment.ts with baseUrl: ${BASE_URL}"
