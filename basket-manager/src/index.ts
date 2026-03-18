/**
 * Basket Manager - Express API Server
 * REST API for grocery shopping management
 */

import express from 'express';
import cors from 'cors';
import { priceService, storeService, productService, categoryService } from './services/price.service';
import { alertService, listService } from './services/alert.service';

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'Basket Manager',
    version: '1.0.0',
    timestamp: new Date().toISOString() 
  });
});

// ==================== STORES ====================
app.get('/api/stores', (req, res) => {
  try {
    res.json(storeService.getAll());
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/stores/nearby', (req, res) => {
  try {
    const { lat, lng, radius } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({ error: 'lat and lng required' });
    }
    res.json(storeService.getNearbyStores(
      Number(lat), 
      Number(lng), 
      Number(radius) || 5
    ));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/stores/search', (req, res) => {
  try {
    const { neighborhood, city } = req.query;
    res.json(storeService.searchByLocation(neighborhood as string, city as string));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/stores', (req, res) => {
  try {
    const store = storeService.create(req.body);
    res.status(201).json(store);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// ==================== PRODUCTS ====================
app.get('/api/products', (req, res) => {
  try {
    const { categoryId, search } = req.query;
    res.json(productService.getAll({
      categoryId: categoryId ? Number(categoryId) : undefined,
      search: search as string
    }));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/products/search', (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);
    res.json(productService.search(q as string));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/products/:id', (req, res) => {
  try {
    const product = productService.getById(Number(req.params.id));
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/products', (req, res) => {
  try {
    const product = productService.create(req.body);
    res.status(201).json(product);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// ==================== CATEGORIES ====================
app.get('/api/categories', (req, res) => {
  try {
    res.json(categoryService.getAll());
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== PRICES ====================
app.get('/api/prices', (req, res) => {
  try {
    const { productId, storeId } = req.query;
    res.json(priceService.getCurrent(
      productId ? Number(productId) : undefined,
      storeId ? Number(storeId) : undefined
    ));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/prices/compare/:productId', (req, res) => {
  try {
    res.json(priceService.comparePrices(Number(req.params.productId)));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/prices/best/:productId', (req, res) => {
  try {
    const best = priceService.getBestPrice(Number(req.params.productId));
    if (!best) return res.status(404).json({ error: 'No prices found' });
    res.json(best);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/prices', (req, res) => {
  try {
    const price = priceService.addPrice(req.body);
    res.status(201).json(price);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/prices/history/:productId', (req, res) => {
  try {
    const { days } = req.query;
    res.json(priceService.getHistory(Number(req.params.productId), Number(days) || 30));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== ALERTS ====================
app.get('/api/alerts', (req, res) => {
  try {
    const { active } = req.query;
    res.json(alertService.getAll(active !== 'false'));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/alerts', (req, res) => {
  try {
    const alert = alertService.create(req.body);
    res.status(201).json(alert);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/alerts/check', (req, res) => {
  try {
    const triggered = alertService.checkAlerts();
    res.json({ triggered, count: triggered.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/alerts/:id', (req, res) => {
  try {
    alertService.delete(Number(req.params.id));
    res.json({ success: true });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// ==================== SHOPPING LISTS ====================
app.get('/api/lists', (req, res) => {
  try {
    const { status } = req.query;
    res.json(listService.getAll(status as string));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/lists/:id', (req, res) => {
  try {
    const list = listService.getById(Number(req.params.id));
    if (!list) return res.status(404).json({ error: 'List not found' });
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/lists', (req, res) => {
  try {
    const list = listService.create(req.body);
    res.status(201).json(list);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/lists/:id/items', (req, res) => {
  try {
    const item = listService.addItem({ ...req.body, list_id: Number(req.params.id) });
    res.status(201).json(item);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.patch('/api/lists/items/:id', (req, res) => {
  try {
    listService.updateItem(Number(req.params.id), req.body);
    res.json({ success: true });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/lists/items/:id', (req, res) => {
  try {
    listService.deleteItem(Number(req.params.id));
    res.json({ success: true });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/lists/:id/complete', (req, res) => {
  try {
    const { total } = req.body;
    listService.complete(Number(req.params.id), total);
    res.json({ success: true });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🛒 Basket Manager API running on port ${PORT}`);
});

export default app;
