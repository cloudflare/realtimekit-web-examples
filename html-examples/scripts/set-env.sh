#!/bin/bash
# Replace import.meta.env.VITE_BASE_URL with actual value in source HTML files

EXAMPLES_DIR="examples"

# Read from .env file in html-examples root
ENV_FILE="$(dirname "$0")/../.env"
if [ -f "$ENV_FILE" ]; then
  BASE_URL=$(grep '^VITE_BASE_URL=' "$ENV_FILE" | cut -d= -f2-)
fi

# Fallback to env var or default
BASE_URL="${BASE_URL:-${VITE_BASE_URL:-https://realtime.cloudflare.com}}"

echo "Replacing import.meta.env.VITE_BASE_URL with '${BASE_URL}' in source HTML files..."

find "$EXAMPLES_DIR" -name "*.html" -type f | while read html_file; do
  # Use a different delimiter in sed to avoid issues with URL slashes
  sed -i.bak "s|import\.meta\.env\.VITE_BASE_URL|'${BASE_URL}'|g" "$html_file"
  rm -f "${html_file}.bak"
  echo "Updated: $html_file"
done

echo "Environment variable replacement complete."
