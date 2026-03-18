# Basket Manager - Architecture

System architecture for grocery shopping management.

## Overview

```
basket-manager/
├── src/
│   ├── index.ts           # Express API server
│   ├── db/
│   │   └── init.ts       # SQLite schema
│   └── services/
│       ├── price.service.ts
│       ├── alert.service.ts
│       └── list.service.ts
├── data/                  # SQLite database
├── SKILL.md             # OpenClaw skill
└── package.json
```

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
- id, list_id, product_id, quantity, estimated_price, is_checked

### alerts
- id, type, product_id, store_id, condition, threshold, message, is_active

### receipts
- id, store_id, purchase_date, total, subtotals, tax, discount

### receipt_items
- id, receipt_id, product_id, product_name, quantity, unit_price, total

## API Endpoints

- `/api/stores` - Store management
- `/api/products` - Product catalog
- `/api/prices` - Price operations
- `/api/lists` - Shopping lists
- `/api/alerts` - Price alerts

## Privacy

All data stored locally in SQLite.
