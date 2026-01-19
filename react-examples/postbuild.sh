#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Define the root directory for output and source examples
OUTPUT_DIR="dist"
EXAMPLES_DIR="examples"

echo "Starting postbuild script..."

# Clean and create the main output directory
echo "Preparing output directory: $OUTPUT_DIR"
rm -rf "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR"

# Loop through each directory in the examples directory
# Using find to be more robust with names and ensure we only get directories
find "$EXAMPLES_DIR" -mindepth 1 -maxdepth 1 -type d | while read example_dir_path; do
    example_name=$(basename "$example_dir_path")
    source_dist_path="$example_dir_path/dist"
    destination_example_path="$OUTPUT_DIR/$example_name"

    # Check if the dist subdirectory exists within the example directory
    if [ -d "$source_dist_path" ]; then
        echo "Found $source_dist_path for example: $example_name"
        echo "Moving $source_dist_path contents to $destination_example_path"
        # Copy the contents of examples/example_name/dist to dist/example_name
        mkdir -p "$destination_example_path"
        cp -r "$source_dist_path/"* "$destination_example_path/"
    else
        echo "No dist directory found in $example_dir_path (for example $example_name). Skipping."
    fi
done

# Copy and modify the main index.html to the root of the OUTPUT_DIR
ROOT_INDEX_HTML_SOURCE="index.html"
ROOT_INDEX_HTML_DEST="$OUTPUT_DIR/index.html"

if [ -f "$ROOT_INDEX_HTML_SOURCE" ]; then
    echo "Copying $ROOT_INDEX_HTML_SOURCE to $ROOT_INDEX_HTML_DEST"
    cp "$ROOT_INDEX_HTML_SOURCE" "$ROOT_INDEX_HTML_DEST"

    echo "Updating links in $ROOT_INDEX_HTML_DEST"
    # Modify links from href="/examples/example-name/dist" to href="/example-name/"
    # Using a temporary file for sed in-place editing for compatibility (e.g. macOS sed)
    sed -i.bak 's|href="/examples/\([^/"]*\)/dist"|href="/\1/"|g' "$ROOT_INDEX_HTML_DEST"
    rm -f "${ROOT_INDEX_HTML_DEST}.bak" # Remove backup file created by sed -i
    echo "Links updated in $ROOT_INDEX_HTML_DEST"
else
    echo "Warning: $ROOT_INDEX_HTML_SOURCE not found in the root directory."
fi

# Copy worker.js to dist directory for SPA routing support
WORKER_FILE="worker.js"
WORKER_DEST="$OUTPUT_DIR/$WORKER_FILE"

if [ -f "$WORKER_FILE" ]; then
    echo "Copying $WORKER_FILE to $WORKER_DEST"
    cp "$WORKER_FILE" "$WORKER_DEST"
    echo "Worker file copied successfully."
else
    echo "Warning: $WORKER_FILE not found in the root directory."
fi

# Create .assetsignore to prevent worker.js from being uploaded as an asset
ASSETSIGNORE_FILE="$OUTPUT_DIR/.assetsignore"
echo "Creating $ASSETSIGNORE_FILE to exclude worker.js from asset uploads"
echo "worker.js" > "$ASSETSIGNORE_FILE"
echo ".assetsignore file created successfully."

echo "Postbuild script finished successfully."
