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

print_info "Using env: $ENV"
print_info "Using npm dist-tag: $NPM_TAG"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
EXAMPLES_DIR="$SCRIPT_DIR/examples"

update_realtimekit_cdn_imports() {
    local file_path="$1"

    if [ ! -f "$file_path" ]; then
        return 0
    fi

    local -a sed_inplace
    if sed --version >/dev/null 2>&1; then
        sed_inplace=(-i)
    else
        sed_inplace=(-i '')
    fi

    # Replace any jsDelivr npm URL for @cloudflare/realtimekit* packages to use the chosen dist-tag.
    # Example:
    #   https://cdn.jsdelivr.net/npm/@cloudflare/realtimekit@latest/dist/browser.js
    # becomes:
    #   https://cdn.jsdelivr.net/npm/@cloudflare/realtimekit@staging/dist/browser.js
    sed -E "${sed_inplace[@]}" \
        -e "s|(https://cdn\\.jsdelivr\\.net/npm/@cloudflare/realtimekit[^@/]*@)[^/]+(/)|\\1${NPM_TAG}\\2|g" \
        "$file_path"
}

if [ -d "$EXAMPLES_DIR" ]; then
    for example_dir in "$EXAMPLES_DIR"/*; do
        if [ ! -d "$example_dir" ]; then
            continue
        fi

        while IFS= read -r html_file; do
            print_info "Updating RealtimeKit CDN imports: $html_file"
            update_realtimekit_cdn_imports "$html_file"
        done < <(find "$example_dir" -type f -name "*.html")
    done
else
    print_warning "Examples directory not found: $EXAMPLES_DIR"
fi


echo ""
print_success "🎉 All examples processed successfully!"
