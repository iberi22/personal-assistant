---
name: personal-routine
description: Personal habit tracking and daily routine management. Track habits, streaks, daily goals, and build better routines.
version: "1.0.0"
author: BeRi0n3
type: skill
tags: [habits, routine, productivity, goals, streaks, discipline, health, fitness]
homepage: https://github.com/iberi22/personal-assistant
repository: https://github.com/iberi22/personal-assistant
user-invocable: true
---

# Personal Routine - OpenClaw Skill

Habit tracking and daily routine management.

## Features

### Habit Tracking
- Create custom habits
- Daily check-ins
- Track completion
- Add notes

### Streaks System
- Track consecutive days
- Longest streak record
- Streak recovery grace period
- Visual progress

### Daily Goals
- Set daily targets
- Track achievement
- Progress charts

### Routines
- Morning routine
- Evening routine
- Custom routines
- Time-based reminders

## Quick Start

```bash
npm install
npm run db:init
npm run dev
```

Server: `http://localhost:3003`

## API Endpoints

### Habits

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/habits | List habits |
| POST | /api/habits | Create habit |
| POST | /api/habits/log | Log completion |
| GET | /api/habits/:id/stats | Habit statistics |

### Streaks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/streaks | All streaks |
| GET | /api/streaks/:id | Streak details |

### Daily Goals

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/goals/daily | Today's goals |
| POST | /api/goals | Create goal |
| PUT | /api/goals/:id | Update progress |

### Routines

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/routines | List routines |
| POST | /api/routines | Create routine |
| POST | /api/routines/:id/complete | Complete routine |

## Examples

### Create Habit
```json
POST /api/habits
{
  "name": "Morning Exercise",
  "description": "30 minutes of exercise",
  "frequency": "daily",
  "reminder_time": "07:00"
}
```

### Log Habit Completion
```json
POST /api/habits/log
{
  "habit_id": 1,
  "date": "2026-03-18",
  "completed": true,
  "notes": "Did yoga and stretching"
}
```

### Create Daily Goal
```json
POST /api/goals
{
  "date": "2026-03-18",
  "target": 8,
  "achieved": 0,
  "goal_type": "work_hours"
}
```

### Create Routine
```json
POST /api/routines
{
  "name": "Morning Routine",
  "description": "Start the day right",
  "tasks": [
    {"name": "Wake up", "time": "06:00"},
    {"name": "Exercise", "time": "06:30"},
    {"name": "Shower", "time": "07:00"},
    {"name": "Breakfast", "time": "07:30"}
  ]
}
```

## Habit Categories

- Health & Fitness
- Productivity
- Learning
- Personal Care
- Finance
- Relationships

## Streak Rules

- Streak continues if completed today
- Grace period: 1 day
- Longest streak is recorded
- Streak resets after grace period

## Gamification

- Achievement badges
- Milestone celebrations
- Progress charts
- Weekly summaries

## Reports

- Daily completion rate
- Weekly trends
- Monthly review
- Year summary

---

*Skill for OpenClaw - AgentSkills compatible*
