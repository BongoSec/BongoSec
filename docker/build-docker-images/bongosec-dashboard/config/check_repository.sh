#!/bin/bash

# Exit on any error
set -e

# Default variables
BONGOSEC_VERSION=${BONGOSEC_VERSION:-"5.0"}
REPO_BASE="bongosec.github.io/packages"
RELEASE_REPO_BASE="packages.bongosec.github.io"
APT_KEY="https://${REPO_BASE}/key/GPG-KEY-BONGOSEC"
RELEASE_APT_KEY="https://${RELEASE_REPO_BASE}/key/GPG-KEY-BONGOSEC"

# Function to check if a URL is accessible
check_url() {
    local url=$1
    if ! curl --output /dev/null --silent --head --fail "$url"; then
        echo "Error: Cannot access $url"
        return 1
    fi
    return 0
}

# Function to import GPG key
import_gpg_key() {
    local key_url=$1
    if ! check_url "$key_url"; then
        echo "Error: Cannot access GPG key at $key_url"
        return 1
    fi
    
    if ! rpm --import "$key_url"; then
        echo "Error: Failed to import GPG key from $key_url"
        return 1
    fi
    return 0
}

# Check if BONGOSEC_VERSION is set
if [ -z "${BONGOSEC_VERSION}" ]; then
    echo "Error: BONGOSEC_VERSION is not set"
    exit 1
fi

# Check tag to use the correct repository
BONGOSEC_TAG=$(curl --silent https://api.github.com/repos/bongosec/bongosec/git/refs/tags | grep '["]ref["]:' | sed -E 's/.*\"([^\"]+)\".*/\1/' | cut -c 11- | grep "^v${BONGOSEC_VERSION}$" || true)

if [[ -n "${BONGOSEC_TAG}" ]]; then
    echo "Using release repository for version ${BONGOSEC_VERSION}"
    APT_KEY="${RELEASE_APT_KEY}"
    REPO_URL="https://${RELEASE_REPO_BASE}/5.x/yum/"
else
    echo "Using pre-release repository for version ${BONGOSEC_VERSION}"
    REPO_URL="https://${REPO_BASE}/pre-release/yum/"
fi

# Import GPG key
if ! import_gpg_key "${APT_KEY}"; then
    echo "Error: Failed to import GPG key"
    exit 1
fi

# Create repository configuration
REPOSITORY="[bongosec]
gpgcheck=1
gpgkey=${APT_KEY}
enabled=1
name=EL-\$releasever - Bongosec
baseurl=${REPO_URL}
protect=1
priority=1
module_hotfixes=1"

# Write repository configuration
echo -e "${REPOSITORY}" | tee /etc/yum.repos.d/bongosec.repo

# Verify repository configuration
if ! yum repolist enabled | grep -q "bongosec"; then
    echo "Error: Failed to enable bongosec repository"
    exit 1
fi

echo "Repository configuration completed successfully"