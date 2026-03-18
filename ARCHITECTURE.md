# Personal Assistant - Multi-Skill Architecture

## Overview

A comprehensive personal assistant system for family management, consisting of multiple specialized skills that work together.

## System Architecture

```
personal-assistant/
├── skills/
│   ├── basket-manager/       # Grocery & supermarket management
│   ├── meal-planner/         # Weekly menus & diet planning
│   ├── finance-tracker/      # Income & expenses
│   ├── personal-routine/     # Daily routines & habits
│   └── notifications/         # Alerts & reminders
├── shared/
│   ├── database/             # Shared SQLite database
│   ├── models/               # Shared TypeScript models
│   └── services/             # Common services
└── api/                      # REST API server
```

## Skills Description

### 1. Basket Manager (Canasta Familiar)

**Purpose:** Manage grocery shopping across Colombian supermarkets

**Supermarkets:**
- Mercar
- Ara
- D1
- Cañaveral
- Tiendas de los Tenderos
- Éxito
- Jumbo
- Carulla

**Features:**
- Price comparison between stores
- Shopping lists by store
- Price alerts
- Weekly deals
- Location-based store recommendations

**Database Schema:**
```sql
-- Stores
stores(id, name, chain, address, neighborhood, city, lat, lng, type)

-- Products  
products(id, name, brand, category, unit, barcode)

-- Prices
prices(id, product_id, store_id, price, promotion, date)

-- Shopping Lists
shopping_lists(id, name, store_id, status, created_at)

-- List Items
list_items(id, list_id, product_id, quantity, checked)
```

### 2. Meal Planner

**Purpose:** Plan weekly meals, diets, and nutrition

**Features:**
- Weekly menu planning
- Recipe management
- Nutrition tracking
- Calorie counting
- Shopping list generation from menus
- Diet templates (vegetarian, keto, etc.)
- Meal prep scheduling

**Database Schema:**
```sql
-- Recipes
recipes(id, name, description, prep_time, cook_time, servings, calories)

-- Ingredients
ingredients(id, name, category, unit)

-- Recipe Ingredients
recipe_ingredients(id, recipe_id, ingredient_id, quantity)

-- Meal Plans
meal_plans(id, week_start, created_at)

-- Plan Meals
plan_meals(id, plan_id, day, meal_type, recipe_id)

-- Nutrition
daily_nutrition(id, date, total_calories, protein, carbs, fat)
```

### 3. Finance Tracker

**Purpose:** Track income, expenses, and budgets

**Features:**
- Income tracking (salary, freelance, investments)
- Expense categorization
- Budget limits per category
- Monthly/weekly reports
- Savings goals
- Bill reminders

**Database Schema:**
```sql
-- Accounts
accounts(id, name, type, balance, currency)

-- Transactions
transactions(id, account_id, category, type, amount, date, description)

-- Categories
categories(id, name, type, icon, color)

-- Budgets
budgets(id, category_id, amount, period, start_date)

-- Savings Goals
savings_goals(id, name, target_amount, current_amount, deadline)
```

### 4. Personal Routine

**Purpose:** Manage daily habits and routines

**Features:**
- Daily routine templates
- Habit tracking
- Reminders
- Progress tracking
- Daily/weekly goals
- Streaks and gamification

**Database Schema:**
```sql
-- Routines
routines(id, name, description, frequency)

-- Routine Tasks
routine_tasks(id, routine_id, name, time, duration, order)

-- Habit Tracking
habit_logs(id, habit_id, date, completed, notes)

-- Daily Goals
daily_goals(id, date, goal_type, target, achieved)

-- Streaks
streaks(id, habit_id, current_streak, longest_streak, last_completed)
```

## Integration Between Skills

### Meal Plan → Shopping List
```
Weekly Menu → Ingredients → Auto-generate Shopping List → Compare Prices
```

### Finance → Budget Alerts
```
Expenses → Category → Budget Threshold → Alert
```

### Routine → Notifications
```
Habit → Time → Reminder → Complete → Update Streak
```

## API Endpoints

### Basket Manager
- `GET /api/stores` - List stores
- `GET /api/stores/nearby?lat=&lng=&radius=` - Nearby stores
- `GET /api/prices/compare/:productId` - Price comparison
- `GET /api/shopping-lists` - All lists
- `POST /api/shopping-lists` - Create list

### Meal Planner
- `GET /api/recipes` - All recipes
- `GET /api/meal-plans/current` - This week's plan
- `POST /api/meal-plans` - Create meal plan
- `GET /api/nutrition/:date` - Daily nutrition

### Finance Tracker
- `GET /api/transactions` - All transactions
- `POST /api/transactions` - Add transaction
- `GET /api/budgets` - Budget status
- `GET /api/savings` - Savings summary

### Personal Routine
- `GET /api/routines` - All routines
- `POST /api/habits/log` - Log habit completion
- `GET /api/streaks` - Current streaks

## Colombian Supermarkets Data

### Mercar
- Type: Supermarket chain
- Focus: Low prices
- Locations: Bogotá and nearby

### Ara
- Type: Discount supermarket
- Focus: Value for money
- Locations: Multiple cities

### D1
- Type: Discount store
- Focus: Essential products
- Locations: Urban areas

### Cañaveral
- Type: Supermarket
- Focus: Quality products
- Locations: Various

### Tiendas de los Tenderos
- Type: Neighborhood stores
- Focus: Convenience
- Locations: Residential areas

## Technical Stack

- **Backend:** Node.js + Express
- **Database:** SQLite (local, private)
- **Language:** TypeScript
- **API:** REST
- **Notifications:** Telegram Bot API

## Privacy

All personal data stays local in SQLite database. No cloud sync by default.

---

*Last Updated: 2026-03-17*
