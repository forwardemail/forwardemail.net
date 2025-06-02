# API Documentation

## Overview

Forward Email provides a comprehensive API for managing email forwarding, domains, aliases, and more. The API documentation is generated from an OpenAPI specification and rendered using [Scalar](https://github.com/scalar/scalar).

## API Specification Process

The API specification is maintained as a structured OpenAPI v3 JSON file:

- **File Location**: The specification is stored as `api-spec.json` in the `assets/` folder
- **Build Process**: During the build process, the specification is copied to the build folder
- **Web Routes**: The API documentation is served via the `/api` and `/email-api` web routes
- **Renderer**: The documentation is rendered using Scalar API tool, configured in `app/views/email-api.pug`

## Maintaining the API Specification

When updating the API, follow these steps to maintain the specification:

1. **Edit the Specification**: Update `assets/api-spec.json` with new endpoints, schemas, or descriptions
2. **Use Markdown**: Leverage rich markdown in descriptions for better rendering in Scalar
3. **Follow Best Practices**:
   - Keep the main API description concise and high-level
   - Place error details in the Error schema component
   - Add specific examples to individual endpoints
   - Use tables for parameter descriptions
   - Include code examples with syntax highlighting

## Markdown Enhancement Guidelines

The API specification uses markdown for rich documentation in Scalar:

### Schema Descriptions

```json
{
  "schemas": {
    "Example": {
      "description": "## Example Object\n\n### Properties Overview\n\n| Property | Type | Description |\n|----------|------|-------------|\n| id | string | Unique identifier |\n| name | string | The name of the example |\n\n### Example JSON\n\n```json\n{\n  \"id\": \"123\",\n  \"name\": \"Example Name\"\n}\n```"
    }
  }
}
```

### Endpoint Descriptions

```json
{
  "paths": {
    "/v1/example": {
      "get": {
        "description": "**Get Example**\n\n### Parameters\n\n| Parameter | Type | Required | Description |\n|-----------|------|----------|-------------|\n| id | string | Yes | Example ID |\n\n### Example Request\n\n```bash\ncurl https://api.forwardemail.net/v1/example \\\n  -u API_TOKEN:\n```\n\n### Example Response\n\n```json\n{\n  \"id\": \"123\",\n  \"name\": \"Example Name\"\n}\n```"
      }
    }
  }
}
```

## Testing Documentation Changes

After updating the API specification:

1. Run the build process to copy the updated specification to the build folder
2. Navigate to `/api` or `/email-api` in your development environment
3. Verify that the documentation renders correctly in Scalar
4. Check that all markdown formatting appears as expected
5. Test the "Try It" functionality if available

## Scalar Configuration

The Scalar API documentation tool is configured in `app/views/email-api.pug`. If you need to customize the Scalar rendering:

1. Edit the configuration in this file
2. Refer to the [Scalar documentation](https://github.com/scalar/scalar) for available options
3. Test changes in the development environment before deploying

## Deployment

When deploying API documentation changes:

1. Ensure the updated `api-spec.json` is included in the deployment
2. Verify that the build process correctly copies the specification
3. Check the live documentation after deployment to confirm changes are visible
