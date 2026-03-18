# Basket Manager

Professional grocery shopping management system for Colombian supermarkets.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/iberi22/basket-manager)](https://github.com/iberi22/basket-manager/stargazers)

## About

Basket Manager is an open source system for managing supermarket product prices, comparing prices between stores, creating shopping lists, and finding the best deals. Designed for Colombian supermarkets.

## Features

- **Price Comparison**: Compare prices across multiple stores
- **Shopping Lists**: Create and manage shopping lists with cost estimation
- **Price Alerts**: Get notified when prices drop
- **Store Geolocation**: Find stores near your location
- **Receipt Tracking**: Full purchase history

## Quick Start

```bash
# Clone repository
git clone https://github.com/iberi22/basket-manager.git
cd basket-manager

# Install dependencies
npm install

# Initialize database
npm run db:init

# Start server
npm run dev
```

Server runs at `http://localhost:3003`

## Supported Stores

| Store | Type | City |
|-------|------|------|
| Cañaveral | Supermarket | Cali, Bogotá |
| Mercar | Supermarket | Bogotá |
| Ara | Discount | Urban |
| D1 | Discount | Various |
| Éxito | Supermarket | Nationwide |
| Jumbo | Supermarket | Nationwide |
| Carulla | Supermarket | Bogotá |

## API

See [SKILL.md](SKILL.md) for complete API documentation.

## Technologies

- Node.js + Express
- SQLite (better-sqlite3)
- TypeScript

## Contributing

1. Fork the project
2. Create a branch (`git checkout -b feature/new-feature`)
3. Commit changes
4. Push and open PR

## License

MIT

## Author

BeRi0n3 - https://github.com/BeRi0n3
