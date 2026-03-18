---
name: finance-tracker
description: Personal finance management. Track income, expenses, budgets, and savings goals. Uses local SQLite for privacy.
version: "1.0.0"
author: BeRi0n3
type: skill
tags: [finance, budget, expenses, income, savings, money, tracking]
homepage: https://github.com/iberi22/personal-assistant
repository: https://github.com/iberi22/personal-assistant
user-invocable: true
---

# Finance Tracker - OpenClaw Skill

Personal finance management for tracking income, expenses, and savings.

## Features

### Transaction Management
- Record income and expenses
- Categorize transactions
- Add notes and tags
- Attach receipts (images)

### Budget Management
- Set budget limits per category
- Track spending against budget
- Alert when approaching limit

### Savings Goals
- Create savings targets
- Track progress
- Set deadlines
- Calculate required savings rate

### Reports
- Monthly summary
- Category breakdown
- Trend analysis
- Export to CSV

## Quick Start

```bash
npm install
npm run db:init
npm run dev
```

Server: `http://localhost:3003`

## API Endpoints

### Transactions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/transactions | List transactions |
| GET | /api/transactions/:id | Get transaction |
| POST | /api/transactions | Create transaction |
| PUT | /api/transactions/:id | Update transaction |
| DELETE | /api/transactions/:id | Delete transaction |

### Accounts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/accounts | List accounts |
| POST | /api/accounts | Create account |
| GET | /api/accounts/balance | Total balance |

### Budgets

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/budgets | List budgets |
| POST | /api/budgets | Create budget |
| GET | /api/budgets/status | Budget status |

### Savings

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/savings | Savings summary |
| POST | /api/savings/goals | Create goal |
| GET | /api/savings/goals/:id | Goal progress |

### Reports

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/reports/monthly | Monthly report |
| GET | /api/reports/category | By category |
| GET | /api/reports/trends | Trend analysis |

## Examples

### Add Expense
```json
POST /api/transactions
{
  "type": "expense",
  "amount": 75000,
  "category": "supermarket",
  "description": "Weekly groceries",
  "date": "2026-03-17"
}
```

### Add Income
```json
POST /api/transactions
{
  "type": "income",
  "amount": 3000000,
  "category": "salary",
  "description": "Monthly salary",
  "date": "2026-03-01"
}
```

### Create Budget
```json
POST /api/budgets
{
  "category": "supermarket",
  "amount": 500000,
  "period": "monthly",
  "start_date": "2026-03-01"
}
```

### Create Savings Goal
```json
POST /api/savings/goals
{
  "name": "Emergency Fund",
  "target_amount": 5000000,
  "deadline": "2026-12-31"
}
```

## Categories

### Income
- Salary
- Freelance
- Investments
- Other Income

### Expenses
- Supermarket
- Transportation
- Services
- Entertainment
- Health
- Education
- Housing
- Other

## Budget Periods

- Daily
- Weekly
- Monthly
- Yearly

## Reports

- Monthly summary
- Category breakdown
- Year-to-date
- Savings rate
- Expense trends

---

*Skill for OpenClaw - AgentSkills compatible*
