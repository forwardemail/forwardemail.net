#!/bin/bash

# Exit the script if any command fails
set -e

# Print the start of the build process
echo "Starting the build process..."

# Ensure the build context is clean
echo "Cleaning up previous Docker images..."
docker system prune -f

# Set the image tag based on the Git tag or commit hash
TAG_NAME=$(echo "$GITHUB_REF" | sed 's/refs\/tags\///g')
IMAGE_NAME="ghcr.io/${GITHUB_REPOSITORY}/${TAG_NAME}-selfhosted"

# Build the Docker image using the custom Dockerfile
echo "Building Docker image with tag: $IMAGE_NAME"
docker build -f Dockerfile-selfhosted -t "$IMAGE_NAME" .

# Optionally, you can add any additional steps here, like pushing other images or running tests

# If you want to perform additional build steps like testing:
# echo "Running unit tests..."
# npm test

# Print a message indicating that the build has completed
echo "Docker image $IMAGE_NAME has been successfully built."

# Optionally, add a message for pushing to GitHub Container Registry
echo "You can now push the image using 'docker push $IMAGE_NAME'"
