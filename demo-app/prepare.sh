#!/bin/bash

set -e

# Get the script directory

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PUBLIC_DIR="$SCRIPT_DIR/public"

echo "Building and copying examples..."

# Function to build and copy examples from a framework directory
build_and_copy_examples() {
  local framework_dir=$1
  local framework_name=$2
  
  echo "Processing ${framework_name}..."
  
  # Navigate to framework directory
  cd "$PROJECT_ROOT/$framework_dir"
  
  # Run build
  echo "Building ${framework_name}..."
  npm run build || true

  # for html examples
  mkdir -p "$PUBLIC_DIR/$framework_name"
  
  echo "📁 Copying all examples from ${framework_dir} to demo-app"

  # Copy dist contents
  cp -r "./dist/" "$PUBLIC_DIR/$framework_name/"
  # Delete the dist folder after successful copy
  rm -rf "./dist"
  return 0

  # Return to project root for next iteration
  cd "$PROJECT_ROOT"
}

# Process each framework
build_and_copy_examples "react-examples" "react-examples"
build_and_copy_examples "angular-examples" "angular-examples"
build_and_copy_examples "html-examples" "html-examples"

echo "Done! All examples have been built and copied to demo-app/public/"
