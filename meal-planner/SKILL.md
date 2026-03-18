---
name: meal-planner
description: Weekly meal planning, recipe management, nutrition tracking, and automatic shopping list generation. Integrates with basket manager for grocery planning.
version: "1.0.0"
author: BeRi0n3
type: skill
tags: [meal, planning, recipes, nutrition, diet, cooking, menu, food]
homepage: https://github.com/iberi22/personal-assistant
repository: https://github.com/iberi22/personal-assistant
user-invocable: true
---

# Meal Planner - OpenClaw Skill

Weekly meal planning, recipe management, and nutrition tracking.

## Features

### Recipe Management
- Create and store recipes
- Categorize by type (breakfast, lunch, dinner, snack)
- Track prep time and cook time
- Nutrition information (calories, protein, carbs, fat)

### Weekly Menu Planning
- Plan meals for each day of the week
- Support for multiple meal types (breakfast, lunch, dinner, snack)
- Copy previous weeks
- Diet templates

### Nutrition Tracking
- Daily calorie tracking
- Weekly nutrition summary
- Protein, carbs, fat breakdown

### Shopping List Generation
- Auto-generate shopping list from meal plan
- Combine ingredients from multiple recipes
- Export to basket manager

## Quick Start

```bash
npm install
npm run db:init
npm run dev
```

Server: `http://localhost:3003`

## API Endpoints

### Recipes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/recipes | List all recipes |
| GET | /api/recipes/:id | Get recipe details |
| POST | /api/recipes | Create recipe |
| POST | /api/recipes/:id/ingredients | Add ingredient |

### Meal Plans

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/meal-plans/current | Current week |
| GET | /api/meal-plans/:week | Specific week |
| POST | /api/meal-plans | Add meal to plan |
| DELETE | /api/meal-plans/:id | Remove meal |

### Nutrition

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/nutrition/:date | Daily nutrition |
| GET | /api/nutrition/weekly | Weekly summary |

### Shopping Lists

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/meal-plans/:week/shopping-list | Generate list |

## Examples

### Create Recipe
```json
POST /api/recipes
{
  "name": "Arepa con Queso",
  "category": "breakfast",
  "prep_time": 10,
  "cook_time": 15,
  "servings": 2,
  "calories": 350,
  "instructions": "Mix corn flour with water..."
}
```

### Add Meal to Plan
```json
POST /api/meal-plans
{
  "week_start": "2026-03-16",
  "day": 0,
  "meal_type": "breakfast",
  "recipe_id": 1
}
```

### Get Weekly Nutrition
```
GET /api/nutrition/weekly?week_start=2026-03-16
```

## Categories

- Breakfast
- Lunch
- Dinner
- Snack

## Nutrition Goals

Set daily goals:
- Calories: 2000 (default)
- Protein: 50g
- Carbs: 250g
- Fat: 65g

## Diet Templates

- Vegetarian
- Keto
- Low-carb
- Balanced

---

*Skill for OpenClaw - AgentSkills compatible*
