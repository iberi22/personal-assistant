/**
 * Basket Manager - Price Service
 * Price comparison and management
 */

import { db } from '../db/init';

// ==================== PRICE SERVICE ====================
export const priceService = {
  // Get current prices for all products or specific product/store
  getCurrent(productId?: number, storeId?: number) {
    let query = `
      SELECT p.*, pr.name as product_name, pr.brand, pr.unit as product_unit,
             s.name as store_name, s.neighborhood, s.city
      FROM prices p
      JOIN products pr ON p.product_id = pr.id
      JOIN stores s ON p.store_id = s.id
      WHERE p.date = (SELECT MAX(date) FROM prices WHERE product_id = p.product_id AND store_id = p.store_id)
    `;
    const params: any[] = [];
    
    if (productId) {
      query += ' AND p.product_id = ?';
      params.push(productId);
    }
    if (storeId) {
      query += ' AND p.store_id = ?';
      params.push(storeId);
    }
    
    query += ' ORDER BY pr.name, s.name';
    return db.prepare(query).all(...params);
  },

  // Compare prices for a product across all stores
  comparePrices(productId: number) {
    return db.prepare(`
      SELECT p.*, s.name as store_name, s.neighborhood, s.city, s.latitude, s.longitude
      FROM prices p
      JOIN stores s ON p.store_id = s.id
      WHERE p.product_id = ?
      AND p.date = (SELECT MAX(date) FROM prices WHERE product_id = ? AND store_id = p.store_id)
      ORDER BY p.price ASC
    `).all(productId, productId);
  },

  // Get best price for a product
  getBestPrice(productId: number) {
    return db.prepare(`
      SELECT p.*, s.name as store_name
      FROM prices p
      JOIN stores s ON p.store_id = s.id
      WHERE p.product_id = ?
      AND p.date = (SELECT MAX(date) FROM prices WHERE product_id = ? AND store_id = p.store_id)
      ORDER BY p.price ASC
      LIMIT 1
    `).get(productId, productId);
  },

  // Add new price
  addPrice(price: any) {
    const result = db.prepare(`
      INSERT INTO prices (product_id, store_id, price, unit_price, promotion, promotion_type, promotion_quantity, promotion_price, observation, date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      price.product_id, price.store_id, price.price, price.unit_price,
      price.promotion, price.promotion_type, price.promotion_quantity,
      price.promotion_price, price.observation, price.date || new Date().toISOString().split('T')[0]
    );
    return { id: result.lastInsertRowid, ...price };
  },

  // Get price history for a product
  getHistory(productId: number, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    return db.prepare(`
      SELECT p.date, p.price, p.promotion, s.name as store_name
      FROM prices p
      JOIN stores s ON p.store_id = s.id
      WHERE p.product_id = ? AND p.date >= ?
      ORDER BY p.date DESC
    `).all(productId, startDate.toISOString().split('T')[0]);
  }
};

// ==================== STORE SERVICE ====================
export const storeService = {
  getAll() {
    return db.prepare('SELECT * FROM stores WHERE is_active = 1 ORDER BY name').all();
  },

  getById(id: number) {
    return db.prepare('SELECT * FROM stores WHERE id = ?').get(id);
  },

  getNearby(lat: number, lng: number, radiusKm: number = 5) {
    const latDelta = radiusKm / 111;
    const lngDelta = radiusKm / 111;
    
    return db.prepare(`
      SELECT *,
        ((latitude - ?) * (latitude - ?) + (longitude - ?) * (longitude - ?)) as distance
      FROM stores 
      WHERE is_active = 1
      AND latitude BETWEEN ? AND ?
      AND longitude BETWEEN ? AND ?
      ORDER BY distance
    `).all(lat, lat, lng, lng, lat - latDelta, lat + latDelta, lng - lngDelta, lng + lngDelta);
  },

  searchByLocation(neighborhood?: string, city?: string) {
    let query = 'SELECT * FROM stores WHERE is_active = 1';
    const params: any[] = [];
    
    if (neighborhood) {
      query += ' AND neighborhood LIKE ?';
      params.push(`%${neighborhood}%`);
    }
    if (city) {
      query += ' AND city LIKE ?';
      params.push(`%${city}%`);
    }
    
    query += ' ORDER BY name';
    return db.prepare(query).all(...params);
  },

  create(store: any) {
    const result = db.prepare(`
      INSERT INTO stores (name, chain, address, neighborhood, city, phone, type, latitude, longitude)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      store.name, store.chain, store.address, store.neighborhood, store.city || 'Bogotá',
      store.phone, store.type, store.latitude, store.longitude
    );
    return { id: result.lastInsertRowid, ...store };
  }
};

// ==================== PRODUCT SERVICE ====================
export const productService = {
  getAll(filters?: { categoryId?: number; search?: string }) {
    let query = `
      SELECT p.*, c.name as category_name, c.icon as category_icon
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = 1
    `;
    const params: any[] = [];
    
    if (filters?.categoryId) {
      query += ' AND p.category_id = ?';
      params.push(filters.categoryId);
    }
    if (filters?.search) {
      query += ' AND (p.name LIKE ? OR p.brand LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }
    
    query += ' ORDER BY p.name';
    return db.prepare(query).all(...params);
  },

  getById(id: number) {
    return db.prepare(`
      SELECT p.*, c.name as category_name, c.icon as category_icon
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `).get(id);
  },

  create(product: any) {
    const result = db.prepare(`
      INSERT INTO products (name, brand, category_id, unit, default_unit_price, barcode)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(product.name, product.brand, product.category_id, product.unit, product.default_unit_price, product.barcode);
    return { id: result.lastInsertRowid, ...product };
  },

  search(query: string) {
    return db.prepare(`
      SELECT p.*, c.name as category_name, c.icon as category_icon
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = 1 AND (p.name LIKE ? OR p.brand LIKE ?)
      ORDER BY p.name
      LIMIT 20
    `).all(`%${query}%`, `%${query}%`);
  }
};

// ==================== CATEGORY SERVICE ====================
export const categoryService = {
  getAll() {
    return db.prepare('SELECT * FROM categories ORDER BY name').all();
  }
};
