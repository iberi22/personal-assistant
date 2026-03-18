# Personal Assistant

A comprehensive personal assistant system for family management, consisting of multiple specialized skills.

## Overview

Personal Assistant is a modular system designed to help manage family groceries, meal planning, finances, and daily routines. Built for OpenClaw with professional standards.

## Skills

### 1. Basket Manager
**Purpose:** Grocery shopping management

**Features:**
- Price comparison across Colombian supermarkets
- Shopping lists with cost estimation
- Price alerts and promotions
- Store geolocation

**Supported Stores:**
- Mercar, Ara, D1, Cañaveral
- Éxito, Jumbo, Carulla

### 2. Meal Planner
**Purpose:** Weekly menu planning and nutrition

**Features:**
- Recipe management
- Weekly meal planning
- Nutrition tracking
- Automatic shopping list generation

### 3. Finance Tracker
**Purpose:** Income and expense management

**Features:**
- Transaction tracking
- Budget management
- Savings goals
- Monthly reports

### 4. Personal Routine
**Purpose:** Daily habits and routines

**Features:**
- Habit tracking
- Streak system
- Daily goals
- Reminders

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

## API Documentation

### Basket Manager

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/stores | List all stores |
| GET | /api/stores/nearby | Find nearby stores |
| GET | /api/prices/compare/:id | Compare prices |
| GET | /api/prices/best/:id | Get best price |
| POST | /api/lists | Create shopping list |
| POST | /api/alerts | Create alert |

### Meal Planner

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/recipes | List recipes |
| GET | /api/meal-plans/current | Current week plan |
| POST | /api/meal-plans | Create meal plan |
| GET | /api/nutrition/:date | Daily nutrition |

### Finance Tracker

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/transactions | List transactions |
| POST | /api/transactions | Add transaction |
| GET | /api/budgets | Budget status |
| GET | /api/savings | Savings summary |

### Personal Routine

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/routines | List routines |
| POST | /api/habits/log | Log habit completion |
| GET | /api/streaks | Current streaks |

## Architecture

```
personal-assistant/
├── basket-manager/       # Grocery management skill
│   ├── SKILL.md
│   └── src/
├── meal-planner/        # Meal planning skill
├── finance-tracker/    # Finance management skill
└── personal-routine/   # Habit tracking skill
```

## Supported Supermarkets

| Store | Type | Location |
|-------|------|----------|
| Mercar | Supermarket | Bogotá |
| Ara | Discount | Urban |
| D1 | Discount | Various |
| Cañaveral | Supermarket | Bogotá |
| Éxito | Supermarket | Nationwide |
| Jumbo | Supermarket | Nationwide |
| Carulla | Supermarket | Bogotá |

## Technologies

- **Backend:** Node.js + Express
- **Database:** SQLite (local, private)
- **Language:** TypeScript
- **API:** REST

## Privacy

All personal data stays local in SQLite database. No cloud sync by default.

## License

MIT

## Author

BeRi0n3 - https://github.com/BeRi0n3

---

⭐ If you like this project, star it on GitHub!
