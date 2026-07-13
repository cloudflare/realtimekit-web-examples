#!/bin/bash
# Generate environment.ts from env vars

ENV_DIR="$(dirname "$0")/../src/environments"
mkdir -p "$ENV_DIR"

THUMBNAIL_POST_ENDPOINT="${VITE_THUMBNAIL_POST_ENDPOINT:-}"
THUMBNAIL_TIME_INTERVAL="${VITE_THUMBNAIL_TIME_INTERVAL:-10000}"
PRESET_NAME_FOR_THUMBNAIL="${VITE_PRESET_NAME_FOR_THUMBNAIL:-LEAD}"

cat > "$ENV_DIR/environment.ts" << EOF
export const environment = {
  thumbnailPostEndpoint: '${THUMBNAIL_POST_ENDPOINT}',
  thumbnailTimeInterval: ${THUMBNAIL_TIME_INTERVAL},
  presetNameForThumbnail: '${PRESET_NAME_FOR_THUMBNAIL}',
};
EOF

echo "Generated environment.ts"
