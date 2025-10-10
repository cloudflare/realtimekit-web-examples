#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Define the root directory for output and source samples
OUTPUT_DIR="dist"
SAMPLES_DIR="samples"

echo "Starting postbuild script..."

# Clean and create the main output directory
echo "Preparing output directory: $OUTPUT_DIR"
rm -rf "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR"

# Loop through each directory in the samples directory
# Using find to be more robust with names and ensure we only get directories
find "$SAMPLES_DIR" -mindepth 1 -maxdepth 1 -type d | while read sample_dir_path; do
    sample_name=$(basename "$sample_dir_path")
    source_dist_path="$sample_dir_path/dist"
    destination_sample_path="$OUTPUT_DIR/$sample_name"

    # Check if the dist subdirectory exists within the sample directory
    if [ -d "$source_dist_path" ]; then
        echo "Found $source_dist_path for sample: $sample_name"
        echo "Moving $source_dist_path to $destination_sample_path"
        # Move the samples/sample_name/dist directory to dist/sample_name
        cp -r "$source_dist_path" "$destination_sample_path"
    else
        echo "No dist directory found in $sample_dir_path (for sample $sample_name). Skipping."
    fi
done

# Copy and modify the main index.html to the root of the OUTPUT_DIR
ROOT_INDEX_HTML_SOURCE="index.html"
ROOT_INDEX_HTML_DEST="$OUTPUT_DIR/index.html"

if [ -f "$ROOT_INDEX_HTML_SOURCE" ]; then
    echo "Copying $ROOT_INDEX_HTML_SOURCE to $ROOT_INDEX_HTML_DEST"
    cp "$ROOT_INDEX_HTML_SOURCE" "$ROOT_INDEX_HTML_DEST"

    echo "Updating links in $ROOT_INDEX_HTML_DEST"
    # Modify links from href="/samples/sample-name/dist" to href="/sample-name/"
    # Using a temporary file for sed in-place editing for compatibility (e.g. macOS sed)
    sed -i.bak 's|href="/samples/\([^/"]*\)/dist"|href="/\1/"|g' "$ROOT_INDEX_HTML_DEST"
    rm -f "${ROOT_INDEX_HTML_DEST}.bak" # Remove backup file created by sed -i
    echo "Links updated in $ROOT_INDEX_HTML_DEST"
else
    echo "Warning: $ROOT_INDEX_HTML_SOURCE not found in the root directory."
fi

echo "Postbuild script finished successfully."
