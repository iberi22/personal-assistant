---
name: personal-assistant
description: Comprehensive personal assistant for family management. Includes grocery shopping, meal planning, finance tracking, and personal routine management. Uses local SQLite database for privacy.
version: "1.0.0"
author: BeRi0n3
type: skill
tags: [personal, assistant, family, shopping, meal-planning, finance, habits, routine, open-source]
homepage: https://github.com/iberi22/personal-assistant
repository: https://github.com/iberi22/personal-assistant
user-invocable: true
---

# Personal Assistant - OpenClaw Skill

Comprehensive personal assistant system for family management.

## Overview

Personal Assistant helps manage family daily life including grocery shopping, meal planning, finances, and personal routines. Designed for Colombian context with local supermarkets.

## Skills

### 1. Basket Manager
- Price comparison across stores
- Shopping lists
- Price alerts
- Store geolocation

### 2. Meal Planner
- Recipe management
- Weekly menu planning
- Nutrition tracking
- Auto-generate shopping lists

### 3. Finance Tracker
- Income/expense tracking
- Budget management
- Savings goals
- Monthly reports

### 4. Personal Routine
- Habit tracking
- Streaks
- Daily goals
- Reminders

## Quick Start

```bash
npm install
npm run db:init
npm run dev
```

Server: `http://localhost:3003`

## Commands

### Find Nearby Stores
```
GET /api/stores/nearby?lat=4.75&lng=-74.05&radius=5
```

### Compare Prices
```
GET /api/prices/compare/1
```

### Create Shopping List
```
POST /api/lists
{
  "name": "Weekly Groceries",
  "store_id": 1
}
```

### Get Meal Plan
```
GET /api/meal-plans/current
```

### Add Expense
```
POST /api/transactions
{
  "type": "expense",
  "amount": 50000,
  "category": "supermarket",
  "description": "Weekly groceries"
}
```

### Log Habit
```
POST /api/habits/log
{
  "habit_id": 1,
  "date": "2026-03-18",
  "completed": true
}
```

## Supported Stores

- Mercar, Ara, D1, Cañaveral
- Éxito, Jumbo, Carulla

## Database

All data stored locally in SQLite. Privacy-first design.

## Privacy

- ✅ Local SQLite database
- ✅ No cloud sync
- ✅ No external data sharing

---

*Skill for OpenClaw - AgentSkills compatible*
