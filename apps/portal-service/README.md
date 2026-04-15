# Portal Service

Microservice for Lightning POS Portal.

## Architecture

Follows Clean Architecture (Antigravity):
- **Domain**: Entities and business rules.
- **Application**: Use Cases and Interfaces.
- **Infrastructure**: Express setup, Controllers, Mappers, and Repositories.

## APIs

- `GET /api/v1/products`: List all products.
- `GET /api/v1/products/:id`: Get product detail.

## Development

```bash
pnpm dev
```
