---
name: basket-manager
description: Professional grocery shopping management system. Manages prices across Colombian supermarkets (Mercar, Ara, D1, Cañaveral, Tenderos), shopping lists, price alerts, and location-based recommendations. Uses local SQLite database for privacy.
version: "1.0.0"
author: BeRi0n3
type: skill
tags: [shopping, groceries, prices, supermarket, colombia, budget, alerts]
homepage: https://github.com/iberi22/basket-manager
repository: https://github.com/iberi22/basket-manager
user-invocable: true
---

# Basket Manager - OpenClaw Skill

Professional grocery shopping management system for Colombian supermarkets.

## Overview

Basket Manager helps you manage grocery shopping with price comparison, shopping lists, and alerts. Designed for Colombian supermarkets: Mercar, Ara, D1, Cañaveral, Éxito, Jumbo, Carulla, and local "Tenderos".

## Quick Start

```bash
# Install dependencies
npm install

# Initialize database
npm run db:init

# Start server
npm run dev
```

Server runs on `http://localhost:3003`

## Features

### 1. Store Management
- Register supermarkets with geolocation
- Support for: Mercar, Ara, D1, Cañaveral, Éxito, Jumbo, Carulla
- Find stores near your location

### 2. Price Comparison
- Compare prices across stores
- Find best prices automatically
- Track price history

### 3. Shopping Lists
- Create lists for specific stores
- Add products with quantities
- Track estimated vs actual cost

### 4. Price Alerts
- Get notified when prices drop
- Budget warnings
- Promotion alerts

### 5. Online Price Search
- Search prices in real-time
- Compare across multiple stores
- Get savings recommendations

## Commands

### Find Nearby Stores
```
GET /api/stores/nearby?lat=4.75&lng=-74.05&radius=5
```

### Compare Product Prices
```
GET /api/prices/compare/:productId
```

### Find Best Price
```
GET /api/prices/best/:productId
```

### Search Product Online
```
GET /api/scrape/search?product=leche
```

### Get Savings Recommendation
```
GET /api/scrape/recommend?product=arroz
```

### Create Shopping List
```
POST /api/lists
{
  "name": "Weekly Groceries",
  "store_id": 1
}
```

### Add Item to List
```
POST /api/lists/:id/items
{
  "product_name": "Leche",
  "quantity": 4,
  "estimated_price": 12000
}
```

### Create Price Alert
```
POST /api/alerts
{
  "type": "price_drop",
  "product_id": 1,
  "store_id": 1,
  "threshold": 5000,
  "message": "Leche price dropped!"
}
```

### Check Alerts
```
POST /api/alerts/check
```

### Get Monthly Savings
```
GET /api/savings?month=2026-03
```

## Supported Stores

| Store | Chain | Type |
|-------|-------|------|
| Mercar | Mercar | Supermarket |
| Ara | Ara | Discount |
| D1 | D1 | Discount |
| Cañaveral | Cañaveral | Supermarket |
| Éxito | Éxito | Supermarket |
| Jumbo | Jumbo | Supermarket |
| Carulla | Carulla | Supermarket |
| Tenderos | Local | Convenience |

## Database Schema

### stores
- id, name, chain, address, neighborhood, city, lat, lng, type

### products
- id, name, brand, category_id, unit, barcode

### prices
- id, product_id, store_id, price, promotion, date

### shopping_lists
- id, name, store_id, status, total_estimated, total_actual

### shopping_list_items
- id, list_id, product_id, quantity, estimated_price, actual_price, is_checked

### alerts
- id, type, product_id, store_id, condition, threshold, message, is_active

## Privacy

All data stored locally in SQLite database. No cloud sync by default.

## API Reference

Full API documentation available in repository.

---

*Skill for OpenClaw - Compatible with AgentSkills spec*
