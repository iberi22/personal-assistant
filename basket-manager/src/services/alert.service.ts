/**
 * Basket Manager - Alert & List Services
 * Alerts and shopping list management
 */

import { db } from '../db/init';

// ==================== ALERT SERVICE ====================
export const alertService = {
  getAll(activeOnly: boolean = true) {
    let query = 'SELECT * FROM alerts';
    if (activeOnly) query += ' WHERE is_active = 1';
    query += ' ORDER BY created_at DESC';
    return db.prepare(query).all();
  },

  create(alert: any) {
    const result = db.prepare(`
      INSERT INTO alerts (type, product_id, store_id, condition, threshold, message, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      alert.type, alert.product_id, alert.store_id, alert.condition,
      alert.threshold, alert.message, alert.is_active !== false ? 1 : 0
    );
    return { id: result.lastInsertRowid, ...alert };
  },

  checkAlerts() {
    const alerts = this.getAll(true) as any[];
    const triggered: any[] = [];

    for (const alert of alerts) {
      let shouldTrigger = false;

      if (alert.type === 'price_drop') {
        const price = db.prepare(`
          SELECT price FROM prices 
          WHERE product_id = ? AND store_id = ?
          ORDER BY date DESC LIMIT 1
        `).get(alert.product_id, alert.store_id) as any;

        if (price && price.price <= alert.threshold) {
          shouldTrigger = true;
          alert.current_price = price.price;
        }
      } else if (alert.type === 'promotion') {
        const promo = db.prepare(`
          SELECT * FROM prices 
          WHERE product_id = ? AND promotion IS NOT NULL
          AND date >= date('now', '-7 days')
          ORDER BY date DESC LIMIT 1
        `).get(alert.product_id);

        if (promo) {
          shouldTrigger = true;
          alert.promotion = promo;
        }
      }

      if (shouldTrigger) {
        triggered.push(alert);
        // Update last triggered
        db.prepare('UPDATE alerts SET last_triggered = CURRENT_TIMESTAMP WHERE id = ?').run(alert.id);
      }
    }

    return triggered;
  },

  deactivate(id: number) {
    return db.prepare('UPDATE alerts SET is_active = 0 WHERE id = ?').run(id);
  },

  delete(id: number) {
    return db.prepare('DELETE FROM alerts WHERE id = ?').run(id);
  }
};

// ==================== SHOPPING LIST SERVICE ====================
export const listService = {
  getAll(status?: string) {
    let query = `
      SELECT sl.*, s.name as store_name, 
             (SELECT COUNT(*) FROM shopping_list_items WHERE list_id = sl.id AND is_checked = 0) as items_pending,
             (SELECT COUNT(*) FROM shopping_list_items WHERE list_id = sl.id) as total_items
      FROM shopping_lists sl
      LEFT JOIN stores s ON sl.store_id = s.id
    `;

    if (status) {
      query += ' WHERE sl.status = ?';
      return db.prepare(query).all(status);
    }

    query += ' ORDER BY sl.created_at DESC';
    return db.prepare(query).all();
  },

  getById(id: number) {
    const list = db.prepare(`
      SELECT sl.*, s.name as store_name
      FROM shopping_lists sl
      LEFT JOIN stores s ON sl.store_id = s.id
      WHERE sl.id = ?
    `).get(id);

    if (list) {
      (list as any).items = db.prepare(`
        SELECT sli.*, p.name as product_name, p.unit as product_unit, p.category_id, c.name as category_name, c.icon as category_icon
        FROM shopping_list_items sli
        LEFT JOIN products p ON sli.product_id = p.id
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE sli.list_id = ?
        ORDER BY sli.is_checked, c.name, sli.product_name
      `).all(id);
    }

    return list;
  },

  create(list: any) {
    const result = db.prepare(`
      INSERT INTO shopping_lists (name, description, store_id, total_estimated, created_by)
      VALUES (?, ?, ?, ?, ?)
    `).run(list.name, list.description, list.store_id, list.total_estimated || 0, list.created_by || 'family');
    return { id: result.lastInsertRowid, ...list };
  },

  addItem(item: any) {
    const result = db.prepare(`
      INSERT INTO shopping_list_items (list_id, product_id, product_name, quantity, unit, estimated_price, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      item.list_id, item.product_id, item.product_name, 
      item.quantity || 1, item.unit || 'un', 
      item.estimated_price, item.notes
    );
    return { id: result.lastInsertRowid, ...item };
  },

  updateItem(id: number, updates: any) {
    const fields = [];
    const params = [];

    if (updates.quantity !== undefined) { fields.push('quantity = ?'); params.push(updates.quantity); }
    if (updates.estimated_price !== undefined) { fields.push('estimated_price = ?'); params.push(updates.estimated_price); }
    if (updates.actual_price !== undefined) { fields.push('actual_price = ?'); params.push(updates.actual_price); }
    if (updates.is_checked !== undefined) { fields.push('is_checked = ?'); params.push(updates.is_checked); }
    if (updates.notes !== undefined) { fields.push('notes = ?'); params.push(updates.notes); }

    params.push(id);
    return db.prepare(`UPDATE shopping_list_items SET ${fields.join(', ')} WHERE id = ?`).run(...params);
  },

  complete(id: number, total: number) {
    return db.prepare(`
      UPDATE shopping_lists SET status = 'completed', total_actual = ?, completed_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(total, id);
  },

  deleteItem(id: number) {
    return db.prepare('DELETE FROM shopping_list_items WHERE id = ?').run(id);
  }
};
