#!/bin/bash
# Replace import.meta.env.VITE_BASE_URL with actual value in source HTML files

EXAMPLES_DIR="examples"

# Priority: env var > .env file > default
if [ -n "${VITE_BASE_URL:-}" ]; then
  BASE_URL="$VITE_BASE_URL"
else
  ENV_FILE="$(dirname "$0")/../.env"
  if [ -f "$ENV_FILE" ]; then
    BASE_URL=$(grep -m1 '^VITE_BASE_URL=' "$ENV_FILE" | sed 's/^VITE_BASE_URL=//')
  fi
  BASE_URL="${BASE_URL:-realtime.cloudflare.com}"
fi

echo "Replacing import.meta.env.VITE_BASE_URL with '${BASE_URL}' in source HTML files..."

find "$EXAMPLES_DIR" -name "*.html" -type f | while read html_file; do
  # Use a different delimiter in sed to avoid issues with URL slashes
  sed -i.bak "s|import\.meta\.env\.VITE_BASE_URL|'${BASE_URL}'|g" "$html_file"
  rm -f "${html_file}.bak"
  echo "Updated: $html_file"
done

echo "Environment variable replacement complete."
