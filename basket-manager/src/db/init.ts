/**
 * Basket Manager - Database Schema
 * SQLite database for grocery shopping management
 */

import Database from 'better-sqlite3';
import { join } from 'path';

const DB_PATH = join(process.cwd(), 'data', 'basket.db');

export const db = new Database(DB_PATH);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// ==================== STORES ====================
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

// ==================== CATEGORIES ====================
db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    parent_id INTEGER REFERENCES categories(id),
    icon TEXT DEFAULT '📦',
    color TEXT DEFAULT '#6366f1',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
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

// ==================== ALERTS ====================
db.exec(`
  CREATE TABLE IF NOT EXISTS alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL CHECK(type IN ('price_drop', 'budget', 'promotion', 'price_increase')),
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
db.exec(`CREATE INDEX IF NOT EXISTS idx_stores_location ON stores(latitude, longitude);`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_alerts_active ON alerts(is_active);`);

// ==================== SEED DEFAULT DATA ====================

// Insert categories
const insertCategory = db.prepare(`
  INSERT OR IGNORE INTO categories (name, icon, color) VALUES (?, ?, ?)
`);

const defaultCategories = [
  ['Detergentes', '🧴', '#3b82f6'],
  ['Jabones', '🧼', '#8b5cf6'],
  ['Limpiadores', '🧽', '#06b6d4'],
  ['Papeles', '🧻', '#f59e0b'],
  ['Lácteos', '🥛', '#22c55e'],
  ['Carnes', '🥩', '#ef4444'],
  ['Frutas', '🍎', '#10b981'],
  ['Verduras', '🥬', '#14b8a6'],
  ['Granos', '🌾', '#f97316'],
  ['Cereales', '🥣', '#eab308'],
  ['Enlatados', '🥫', '#78716c'],
  ['Condimentos', '🧂', '#f59e0b'],
  ['Bebidas', '🧃', '#06b6d4'],
  ['Snacks', '🍿', '#f472b6'],
  ['Panadería', '🍞', '#d97706'],
];

for (const cat of defaultCategories) {
  insertCategory.run(...cat);
}

// Insert Colombian stores
const insertStore = db.prepare(`
  INSERT OR IGNORE INTO stores (name, chain, type, city, neighborhood) VALUES (?, ?, ?, ?, ?)
`);

const defaultStores = [
  ['Mercar Chapinero', 'Mercar', 'supermarket', 'Bogotá', 'Chapinero'],
  ['Ara Centro', 'Ara', 'discount', 'Bogotá', 'Centro'],
  ['D1 Calle 72', 'D1', 'discount', 'Bogotá', 'Barrios Unidos'],
  ['Cañaveral', 'Cañaveral', 'supermarket', 'Bogotá', 'Cañaveral'],
  ['Éxito Calle 80', 'Éxito', 'supermarket', 'Bogotá', 'Calle 80'],
  ['Jumbo Santa Ana', 'Jumbo', 'supermarket', 'Bogotá', 'Santa Ana'],
  ['Carulla', 'Carulla', 'supermarket', 'Bogotá', 'Zona Rosa'],
];

for (const store of defaultStores) {
  insertStore.run(...store);
}

console.log('✅ Basket Manager Database initialized at:', DB_PATH);
