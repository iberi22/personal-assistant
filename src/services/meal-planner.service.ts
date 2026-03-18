/**
 * Meal Planner Service
 * Weekly menu planning, recipes, and nutrition tracking
 */

import { db } from '../db/init';
import { SQLiteDB } from '../db/connection';

// ==================== RECIPES ====================
export const recipeService = {
  getAll(filters?: { category?: string; search?: string }) {
    let query = 'SELECT * FROM recipes WHERE is_active = 1';
    const params: any[] = [];
    
    if (filters?.category) {
      query += ' AND category = ?';
      params.push(filters.category);
    }
    if (filters?.search) {
      query += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }
    
    query += ' ORDER BY name';
    return db.prepare(query).all(...params);
  },
  
  getById(id: number) {
    const recipe = db.prepare('SELECT * FROM recipes WHERE id = ?').get(id);
    
    if (recipe) {
      (recipe as any).ingredients = db.prepare(`
        SELECT ri.*, i.name as ingredient_name, i.category as ingredient_category
        FROM recipe_ingredients ri
        JOIN ingredients i ON ri.ingredient_id = i.id
        WHERE ri.recipe_id = ?
      `).all(id);
    }
    
    return recipe;
  },
  
  create(recipe: any) {
    const result = db.prepare(`
      INSERT INTO recipes (name, description, category, prep_time, cook_time, servings, calories, instructions, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      recipe.name, recipe.description, recipe.category, recipe.prep_time,
      recipe.cook_time, recipe.servings, recipe.calories, recipe.instructions, recipe.image_url
    );
    return { id: result.lastInsertRowid, ...recipe };
  },
  
  addIngredient(recipeId: number, ingredientId: number, quantity: number, unit: string, notes?: string) {
    const result = db.prepare(`
      INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, notes)
      VALUES (?, ?, ?, ?, ?)
    `).run(recipeId, ingredientId, quantity, unit, notes);
    return { id: result.lastInsertRowid };
  }
};

// ==================== MEAL PLANS ====================
export const mealPlanService = {
  getCurrentWeek() {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const weekStart = startOfWeek.toISOString().split('T')[0];
    
    return db.prepare(`
      SELECT mp.*, 
             r.name as recipe_name, r.calories,
             r.prep_time, r.cook_time
      FROM meal_plans mp
      JOIN recipes r ON mp.recipe_id = r.id
      WHERE mp.week_start = ?
      ORDER BY mp.day, mp.meal_type
    `).all(weekStart);
  },
  
  getByWeek(weekStart: string) {
    return db.prepare(`
      SELECT mp.*, 
             r.name as recipe_name, r.calories,
             r.prep_time, r.cook_time
      FROM meal_plans mp
      JOIN recipes r ON mp.recipe_id = r.id
      WHERE mp.week_start = ?
      ORDER BY mp.day, mp.meal_type
    `).all(weekStart);
  },
  
  addMeal(weekStart: string, day: number, mealType: string, recipeId: number) {
    // Remove existing meal if any
    db.prepare(`
      DELETE FROM meal_plans WHERE week_start = ? AND day = ? AND meal_type = ?
    `).run(weekStart, day, mealType);
    
    // Add new meal
    const result = db.prepare(`
      INSERT INTO meal_plans (week_start, day, meal_type, recipe_id)
      VALUES (?, ?, ?, ?)
    `).run(weekStart, day, mealType, recipeId);
    
    return { id: result.lastInsertRowid };
  },
  
  generateShoppingList(weekStart: string) {
    // Get all ingredients for the week's meals
    const meals = this.getByWeek(weekStart);
    
    const ingredients: Map<number, { name: string; totalQuantity: number; unit: string }> = new Map();
    
    for (const meal of meals) {
      const recipeIngredients = db.prepare(`
        SELECT ri.ingredient_id, i.name, ri.quantity, ri.unit
        FROM recipe_ingredients ri
        JOIN ingredients i ON ri.ingredient_id = i.id
        WHERE ri.recipe_id = ?
      `).all((meal as any).recipe_id) as any[];
      
      for (const ing of recipeIngredients) {
        if (ingredients.has(ing.ingredient_id)) {
          const existing = ingredients.get(ing.ingredient_id)!;
          existing.totalQuantity += ing.quantity;
        } else {
          ingredients.set(ing.ingredient_id, {
            name: ing.name,
            totalQuantity: ing.quantity,
            unit: ing.unit
          });
        }
      }
    }
    
    return Array.from(ingredients.entries()).map(([id, data]) => ({
      ingredient_id: id,
      ...data
    }));
  }
};

// ==================== NUTRITION ====================
export const nutritionService = {
  getDailyNutrition(date: string) {
    return db.prepare(`
      SELECT * FROM daily_nutrition WHERE date = ?
    `).get(date);
  },
  
  calculateDayNutrition(date: string) {
    // Get all meals for the day
    const dayOfWeek = new Date(date).getDay();
    const today = new Date(date);
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);
    const weekStart = startOfWeek.toISOString().split('T')[0];
    
    const meals = db.prepare(`
      SELECT r.calories, r.protein, r.carbs, r.fat
      FROM meal_plans mp
      JOIN recipes r ON mp.recipe_id = r.id
      WHERE mp.week_start = ? AND mp.day = ?
    `).all(weekStart, dayOfWeek) as any[];
    
    const totals = meals.reduce((acc, meal) => ({
      calories: acc.calories + (meal.calories || 0),
      protein: acc.protein + (meal.protein || 0),
      carbs: acc.carbs + (meal.carbs || 0),
      fat: acc.fat + (meal.fat || 0)
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
    
    // Save or update daily nutrition
    db.prepare(`
      INSERT OR REPLACE INTO daily_nutrition (date, total_calories, protein, carbs, fat)
      VALUES (?, ?, ?, ?, ?)
    `).run(date, totals.calories, totals.protein, totals.carbs, totals.fat);
    
    return {
      date,
      ...totals,
      mealsCount: meals.length
    };
  },
  
  getWeeklyNutrition(weekStart: string) {
    const days = [];
    const start = new Date(weekStart);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      days.push(date.toISOString().split('T')[0]);
    }
    
    return days.map(date => this.calculateDayNutrition(date));
  }
};

// ==================== INGREDIENTS ====================
export const ingredientService = {
  getAll() {
    return db.prepare('SELECT * FROM ingredients ORDER BY category, name').all();
  },
  
  getByCategory(category: string) {
    return db.prepare('SELECT * FROM ingredients WHERE category = ? ORDER BY name').all(category);
  },
  
  search(query: string) {
    return db.prepare('SELECT * FROM ingredients WHERE name LIKE ? ORDER BY name LIMIT 20')
      .all(`%${query}%`);
  },
  
  create(ingredient: any) {
    const result = db.prepare(`
      INSERT INTO ingredients (name, category, unit, calories_per_unit)
      VALUES (?, ?, ?, ?)
    `).run(ingredient.name, ingredient.category, ingredient.unit, ingredient.calories_per_unit);
    return { id: result.lastInsertRowid, ...ingredient };
  }
};

// ==================== DIET TEMPLATES ====================
export const dietService = {
  getTemplates() {
    return db.prepare('SELECT * FROM diet_templates WHERE is_active = 1').all();
  },
  
  applyTemplate(templateId: number, weekStart: string) {
    const template = db.prepare('SELECT * FROM diet_templates WHERE id = ?').get(templateId);
    if (!template) return null;
    
    const meals = db.prepare(`
      SELECT day, meal_type, recipe_id FROM template_meals WHERE template_id = ?
    `).all(templateId) as any[];
    
    for (const meal of meals) {
      mealPlanService.addMeal(weekStart, meal.day, meal.meal_type, meal.recipe_id);
    }
    
    return { template, mealsAdded: meals.length };
  }
};
