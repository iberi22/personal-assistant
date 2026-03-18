/**
 * Personal Assistant Database Schema
 * Complete database for all skills
 */

import Database from 'better-sqlite3';
import { join } from 'path';

const DB_PATH = join(process.cwd(), 'data', 'personal-assistant.db');

export const db = new Database(DB_PATH);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// ==================== STORES (Basket Manager) ====================
db.exec(`
  CREATE TABLE IF NOT EXISTS stores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    chain TEXT,
    address TEXT,
    neighborhood TEXT,
    city TEXT DEFAULT 'Bogotá',
    phone TEXT,
    type TEXT CHECK(type IN ('supermarket', 'discount', 'wholesale', 'local', 'convenience')),
    latitude REAL,
    longitude REAL,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// ==================== PRODUCTS ====================
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    brand TEXT,
    category_id INTEGER REFERENCES categories(id),
    unit TEXT NOT NULL CHECK(unit IN ('kg', 'g', 'lb', 'l', 'ml', 'un', 'paq', 'pza', 'lata', 'botella', 'bolsa', 'otro')),
    default_unit_price REAL,
    barcode TEXT,
    image_url TEXT,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// ==================== CATEGORIES (Common) ====================
db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    parent_id INTEGER REFERENCES categories(id),
    icon TEXT DEFAULT '📦',
    color TEXT DEFAULT '#6366f1',
    type TEXT CHECK(type IN ('product', 'expense', 'income', 'ingredient')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// ==================== PRICES ====================
db.exec(`
  CREATE TABLE IF NOT EXISTS prices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL REFERENCES products(id),
    store_id INTEGER NOT NULL REFERENCES stores(id),
    price REAL NOT NULL,
    unit_price REAL,
    promotion TEXT,
    promotion_type TEXT CHECK(promotion_type IN ('discount', 'bogo', 'package', 'card', null)),
    promotion_quantity INTEGER,
    promotion_price REAL,
    observation TEXT,
    date DATE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, store_id, date)
  );
`);

// ==================== SHOPPING LISTS ====================
db.exec(`
  CREATE TABLE IF NOT EXISTS shopping_lists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    store_id INTEGER REFERENCES stores(id),
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'completed', 'cancelled')),
    total_estimated REAL DEFAULT 0,
    total_actual REAL DEFAULT 0,
    created_by TEXT DEFAULT 'family',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS shopping_list_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    list_id INTEGER NOT NULL REFERENCES shopping_lists(id),
    product_id INTEGER REFERENCES products(id),
    product_name TEXT,
    quantity REAL DEFAULT 1,
    unit TEXT DEFAULT 'un',
    estimated_price REAL,
    actual_price REAL,
    is_checked INTEGER DEFAULT 0,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// ==================== RECIPES (Meal Planner) ====================
db.exec(`
  CREATE TABLE IF NOT EXISTS recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    prep_time INTEGER,
    cook_time INTEGER,
    servings INTEGER DEFAULT 1,
    calories REAL,
    protein REAL,
    carbs REAL,
    fat REAL,
    instructions TEXT,
    image_url TEXT,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS ingredients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT,
    unit TEXT DEFAULT 'un',
    calories_per_unit REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS recipe_ingredients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recipe_id INTEGER NOT NULL REFERENCES recipes(id),
    ingredient_id INTEGER NOT NULL REFERENCES ingredients(id),
    quantity REAL NOT NULL,
    unit TEXT DEFAULT 'un',
    notes TEXT,
    UNIQUE(recipe_id, ingredient_id)
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS meal_plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    week_start DATE NOT NULL,
    day INTEGER CHECK(day >= 0 AND day <= 6),
    meal_type TEXT CHECK(meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
    recipe_id INTEGER NOT NULL REFERENCES recipes(id),
    UNIQUE(week_start, day, meal_type)
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS daily_nutrition (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE NOT NULL UNIQUE,
    total_calories REAL DEFAULT 0,
    protein REAL DEFAULT 0,
    carbs REAL DEFAULT 0,
    fat REAL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS diet_templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    daily_calories REAL,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS template_meals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    template_id INTEGER NOT NULL REFERENCES diet_templates(id),
    day INTEGER,
    meal_type TEXT,
    recipe_id INTEGER REFERENCES recipes(id)
  );
`);

// ==================== FINANCE ====================
db.exec(`
  CREATE TABLE IF NOT EXISTS accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT CHECK(type IN ('cash', 'bank', 'credit_card', 'investment', 'savings')),
    balance REAL DEFAULT 0,
    currency TEXT DEFAULT 'COP',
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    account_id INTEGER NOT NULL REFERENCES accounts(id),
    category_id INTEGER REFERENCES categories(id),
    type TEXT CHECK(type IN ('income', 'expense', 'transfer')),
    amount REAL NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    receipt_image TEXT,
    notes TEXT,
    tags TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS budgets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER REFERENCES categories(id),
    amount REAL NOT NULL,
    period TEXT CHECK(period IN ('daily', 'weekly', 'monthly', 'yearly')),
    start_date DATE NOT NULL,
    end_date DATE,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS savings_goals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    target_amount REAL NOT NULL,
    current_amount REAL DEFAULT 0,
    deadline DATE,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// ==================== PERSONAL ROUTINE ====================
db.exec(`
  CREATE TABLE IF NOT EXISTS routines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    frequency TEXT CHECK(frequency IN ('daily', 'weekly', 'custom')),
    time TEXT,
    duration_minutes INTEGER,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS routine_tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    routine_id INTEGER NOT NULL REFERENCES routines(id),
    name TEXT NOT NULL,
    time TEXT,
    duration_minutes INTEGER,
    task_order INTEGER DEFAULT 0
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS habit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    habit_id INTEGER REFERENCES routines(id),
    date DATE NOT NULL,
    completed INTEGER DEFAULT 0,
    notes TEXT,
    completed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(habit_id, date)
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS daily_goals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE NOT NULL,
    goal_type TEXT,
    target REAL,
    achieved REAL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(date, goal_type)
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS streaks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    habit_id INTEGER NOT NULL REFERENCES routines(id),
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_completed DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(habit_id)
  );
`);

// ==================== ALERTS ====================
db.exec(`
  CREATE TABLE IF NOT EXISTS alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL CHECK(type IN ('price_drop', 'budget', 'promotion', 'habit', 'bill')),
    product_id INTEGER REFERENCES products(id),
    store_id INTEGER REFERENCES stores(id),
    condition TEXT NOT NULL,
    threshold REAL NOT NULL,
    message TEXT,
    is_active INTEGER DEFAULT 1,
    last_triggered DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// ==================== INDEXES ====================
db.exec(`CREATE INDEX IF NOT EXISTS idx_prices_product ON prices(product_id);`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_prices_store ON prices(store_id);`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_prices_date ON prices(date);`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_habit_logs_date ON habit_logs(date);`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_stores_location ON stores(latitude, longitude);`);

// ==================== SEED DEFAULT DATA ====================

// Insert product categories
const insertCategory = db.prepare(`
  INSERT OR IGNORE INTO categories (name, icon, color, type) VALUES (?, ?, ?, ?)
`);

const defaultCategories = [
  // Product categories
  ['Detergentes', '🧴', '#3b82f6', 'product'],
  ['Jabones', '🧼', '#8b5cf6', 'product'],
  ['Limpiadores', '🧽', '#06b6d4', 'product'],
  ['Papeles', '🧻', '#f59e0b', 'product'],
  ['Lácteos', '🥛', '#22c55e', 'product'],
  ['Carnes', '🥩', '#ef4444', 'product'],
  ['Frutas', '🍎', '#10b981', 'product'],
  ['Verduras', '🥬', '#14b8a6', 'product'],
  ['Granos', '🌾', '#f97316', 'product'],
  ['Bebidas', '🧃', '#06b6d4', 'product'],
  // Expense categories
  ['Supermercado', '🛒', '#22c55e', 'expense'],
  ['Transporte', '🚗', '#3b82f6', 'expense'],
  ['Servicios', '💡', '#8b5cf6', 'expense'],
  ['Entretenimiento', '🎬', '#ec4899', 'expense'],
  // Income categories
  ['Salario', '💵', '#10b981', 'income'],
  ['Freelance', '💻', '#14b8a6', 'income'],
  ['Inversión', '📈', '#6366f1', 'income'],
  // Ingredient categories
  ['Proteínas', '🥩', '#ef4444', 'ingredient'],
  ['Vegetales', '🥬', '#22c55e', 'ingredient'],
  ['Carbohidratos', '🍚', '#f59e0b', 'ingredient'],
];

for (const cat of defaultCategories) {
  insertCategory.run(...cat);
}

// Insert stores
const insertStore = db.prepare(`
  INSERT OR IGNORE INTO stores (name, chain, type, city, neighborhood) VALUES (?, ?, ?, ?, ?)
`);

const defaultStores = [
  ['Mercar', 'Mercar', 'supermarket', 'Bogotá', 'Chapinero'],
  ['Ara', 'Ara', 'discount', 'Bogotá', 'Centro'],
  ['D1', 'D1', 'discount', 'Bogotá', 'Various'],
  ['Cañaveral', 'Cañaveral', 'supermarket', 'Bogotá', 'Cañaveral'],
  ['Éxito', 'Éxito', 'supermarket', 'Bogotá', 'Calle 80'],
  ['Jumbo', 'Jumbo', 'supermarket', 'Bogotá', 'Santa Ana'],
  ['Carrefour', 'Carrefour', 'supermarket', 'Bogotá', 'Chapinero'],
];

for (const store of defaultStores) {
  insertStore.run(...store);
}

// Insert default account
db.prepare(`INSERT OR IGNORE INTO accounts (name, type, balance) VALUES (?, ?, ?)`)
  .run('Efectivo', 'cash', 0);

db.prepare(`INSERT OR IGNORE INTO accounts (name, type, balance) VALUES (?, ?, ?)`)
  .run('Cuenta Principal', 'bank', 0);

console.log('✅ Personal Assistant Database initialized at:', DB_PATH);
