#!/bin/bash

# Script to install dependencies and update RealtimeKit packages in all examples
# Exits on first error to prevent cascading failures

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Parse optional env argument
# Supported:
#   npm run build -- --env staging
#   npm run build -- --env prod
#
# Defaults to prod for:
# - no args
# - invalid/missing env value
ENV="prod"

if [ $# -eq 0 ]; then
    :
elif [ $# -eq 2 ] && [ "$1" = "--env" ]; then
    if [ "$2" = "staging" ] || [ "$2" = "prod" ]; then
        ENV="$2"
    else
        print_warning "Invalid env '$2'; defaulting to prod"
        ENV="prod"
    fi
else
    print_warning "Unsupported arguments; expected: --env <staging|prod>. Defaulting to prod"
    ENV="prod"
fi

NPM_TAG="latest"
if [ "$ENV" = "staging" ]; then
    NPM_TAG="staging"
fi

SED_INPLACE=()
if sed --version >/dev/null 2>&1; then
    SED_INPLACE=(-i)
else
    SED_INPLACE=(-i '')
fi

print_info "Using env: $ENV"
print_info "Using npm dist-tag: $NPM_TAG"

# Check for jq
if ! command -v jq &> /dev/null; then
    echo "jq is required but not installed. Please install jq and rerun the script."
    exit 1
fi

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
EXAMPLES_DIR="$SCRIPT_DIR/examples"

# Get latest package versions
print_info "Fetching latest package versions..."
if [ -n "$NPM_TAG" ]; then
    REALTIMEKIT_VERSION=$(npm view "@cloudflare/realtimekit" version --tag "$NPM_TAG" 2>/dev/null || echo "1.1.5")
    REALTIMEKIT_REACT_UI_VERSION=$(npm view "@cloudflare/realtimekit-react-ui" version --tag "$NPM_TAG" 2>/dev/null || echo "1.0.4")
    REALTIMEKIT_UI_VERSION=$(npm view "@cloudflare/realtimekit-ui" version --tag "$NPM_TAG" 2>/dev/null || echo "1.0.4")
    REALTIMEKIT_UI_ADDONS_VERSION=$(npm view "@cloudflare/realtimekit-ui-addons" version --tag "$NPM_TAG" 2>/dev/null || echo "0.0.4")
else
    REALTIMEKIT_VERSION=$(npm view "@cloudflare/realtimekit" version 2>/dev/null || echo "1.1.5")
    REALTIMEKIT_REACT_UI_VERSION=$(npm view "@cloudflare/realtimekit-react-ui" version 2>/dev/null || echo "1.0.4")
    REALTIMEKIT_UI_VERSION=$(npm view "@cloudflare/realtimekit-ui" version 2>/dev/null || echo "1.0.4")
    REALTIMEKIT_UI_ADDONS_VERSION=$(npm view "@cloudflare/realtimekit-ui-addons" version 2>/dev/null || echo "0.0.4")
fi

print_info "Using versions:"
echo "  @cloudflare/realtimekit: $REALTIMEKIT_VERSION"
echo "  @cloudflare/realtimekit-react: $REALTIMEKIT_REACT_VERSION"
echo "  @cloudflare/realtimekit-react-ui: $REALTIMEKIT_REACT_UI_VERSION"
echo "  @cloudflare/realtimekit-ui: $REALTIMEKIT_UI_VERSION"
echo "  @cloudflare/realtimekit-ui-addons: $REALTIMEKIT_UI_ADDONS_VERSION"

print_info "Before starting update process, removing node_modules & package-lock.json from root directory..."
rm -rf node_modules package-lock.json

print_info "Nuking NPM Cache due to trust issues..."
npm cache clean --force

print_info "Installing dependencies in all example repositories..."

# Process each example directory
for example_dir in "$EXAMPLES_DIR"/*; do
    if [ -d "$example_dir" ] && [ -f "$example_dir/package.json" ]; then
        example_name=$(basename "$example_dir")
        echo ""
        print_info "=== Processing $example_name ==="
        
        cd "$example_dir" || {
            print_error "Failed to enter directory $example_dir"
            exit 1
        }
        
        # Clean install - remove node_modules
        print_info "Cleaning node_modules in $example_name..."
        rm -rf node_modules
        
        # Ensure all required RealtimeKit packages are present in package.json
        print_info "Ensuring all RealtimeKit packages are present in $example_name..."
        
        # Function to add package if not present
        add_package_if_missing() {
            local package_name="$1"
            local package_version="$2"
            if ! jq -e ".dependencies[\"$package_name\"]" package.json > /dev/null; then
                print_info "Adding missing package: $package_name"
                jq ".dependencies[\"$package_name\"] = \"^$package_version\"" package.json > package.json.tmp && mv package.json.tmp package.json
            fi
        }
        
        # Add missing packages
        add_package_if_missing "@cloudflare/realtimekit" "$REALTIMEKIT_VERSION"
        add_package_if_missing "@cloudflare/realtimekit-react" "$REALTIMEKIT_REACT_VERSION"
        add_package_if_missing "@cloudflare/realtimekit-react-ui" "$REALTIMEKIT_REACT_UI_VERSION"
        add_package_if_missing "@cloudflare/realtimekit-ui" "$REALTIMEKIT_UI_VERSION"
        add_package_if_missing "@cloudflare/realtimekit-ui-addons" "$REALTIMEKIT_UI_ADDONS_VERSION"
        
        # Update package.json versions
        print_info "Updating package.json versions in $example_name..."
        
        # Update RealtimeKit packages in package.json
        if grep -q "@cloudflare/realtimekit\"" package.json; then
            print_info "Updating @cloudflare/realtimekit version in package.json..."
            sed "${SED_INPLACE[@]}" -e "s/\"@cloudflare\/realtimekit\": \"[\^~]*[^\"]*\"/\"@cloudflare\/realtimekit\": \"^$REALTIMEKIT_VERSION\"/g" package.json
        fi
        
        if grep -q "@cloudflare/realtimekit-react\"" package.json; then
            print_info "Updating @cloudflare/realtimekit-react version in package.json..."
            sed "${SED_INPLACE[@]}" -e "s/\"@cloudflare\/realtimekit-react\": \"[\^~]*[^\"]*\"/\"@cloudflare\/realtimekit-react\": \"^$REALTIMEKIT_REACT_VERSION\"/g" package.json
        fi
        
        if grep -q "@cloudflare/realtimekit-react-ui\"" package.json; then
            print_info "Updating @cloudflare/realtimekit-react-ui version in package.json..."
            sed "${SED_INPLACE[@]}" -e "s/\"@cloudflare\/realtimekit-react-ui\": \"[\^~]*[^\"]*\"/\"@cloudflare\/realtimekit-react-ui\": \"^$REALTIMEKIT_REACT_UI_VERSION\"/g" package.json
        fi
        
        if grep -q "@cloudflare/realtimekit-ui\"" package.json; then
            print_info "Updating @cloudflare/realtimekit-ui version in package.json..."
            sed "${SED_INPLACE[@]}" -e "s/\"@cloudflare\/realtimekit-ui\": \"[\^~]*[^\"]*\"/\"@cloudflare\/realtimekit-ui\": \"^$REALTIMEKIT_UI_VERSION\"/g" package.json
        fi
        
        if grep -q "@cloudflare/realtimekit-ui-addons\"" package.json; then
            print_info "Updating @cloudflare/realtimekit-ui-addons version in package.json..."
            sed "${SED_INPLACE[@]}" -e "s/\"@cloudflare\/realtimekit-ui-addons\": \"[\^~]*[^\"]*\"/\"@cloudflare\/realtimekit-ui-addons\": \"^$REALTIMEKIT_UI_ADDONS_VERSION\"/g" package.json
        fi

        # Single npm install after updating all versions
        print_info "Installing all dependencies in $example_name..."
        if ! npm install --legacy-peer-deps --no-workspaces; then
            print_error "Failed to install dependencies in $example_name"
            exit 1
        fi
        
        cd - > /dev/null
        print_success "✓ Completed $example_name"
    fi
done

echo ""
print_success "🎉 All examples processed successfully!"
