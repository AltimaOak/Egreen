// Catalog Service — reads the customer-facing product catalog from the backend
// API and maps each Product to the shape the customer Products page expects.
import { api } from '../utils/api';

// The DB stores `stock` as a string; the catalog page renders it as a number
// (0 = Out of stock, < 5 = Low Stock, otherwise In Stock).
const STOCK_TO_NUMBER = {
  'In Stock': 100,
  'Low Stock': 3,
  'Out of stock': 0,
};

/**
 * Parse raw specs string or array into structured key-value specification objects.
 */
function parseSpecs(specsRaw, condition) {
  const list = [];
  if (condition) {
    list.push({ key: 'Condition', value: condition });
  }

  if (typeof specsRaw === 'string' && specsRaw.trim()) {
    const parts = specsRaw.split(/[,;\n]+/);
    for (const part of parts) {
      if (!part.includes(':')) continue;
      const idx = part.indexOf(':');
      const key = part.slice(0, idx).trim();
      const value = part.slice(idx + 1).trim();
      if (key && value && !list.some(s => s.key.toLowerCase() === key.toLowerCase())) {
        list.push({ key, value });
      }
    }
  } else if (Array.isArray(specsRaw)) {
    for (const item of specsRaw) {
      if (item && item.key && item.value && !list.some(s => s.key.toLowerCase() === item.key.toLowerCase())) {
        list.push(item);
      }
    }
  }
  return list;
}

/**
 * Map a backend Product row into the flat shape the Products page consumes.
 * @param {object} p - Product from GET /api/products
 */
function toCatalogProduct(p) {
  const stock = typeof p.stock === 'number'
    ? p.stock
    : (p.stock in STOCK_TO_NUMBER ? STOCK_TO_NUMBER[p.stock] : (p.stock != null ? Number(p.stock) : 10));

  const specsList = parseSpecs(p.specs, p.condition || 'Refurbished');

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    sku: p.sku || null,
    description: p.description || '',
    category: p.category?.slug || '',
    categoryName: p.category?.name || '',
    brand: p.brand?.name || (p.brandId === 1 ? 'Dell' : p.brandId === 2 ? 'HP' : p.brandId === 3 ? 'Lenovo' : 'Enterprise Hardware'),
    brandId: p.brandId,
    image: p.image || '',
    status: p.isActive ? 'Active' : 'Inactive',
    stock: typeof stock === 'number' && !isNaN(stock) ? stock : 10,
    condition: p.condition || 'Refurbished',
    rawSpecs: p.specs || '',
    specifications: specsList,
    price: p.price != null && !isNaN(Number(p.price)) ? Number(p.price) : null,
    offerPrice: p.offerPrice != null && !isNaN(Number(p.offerPrice)) ? Number(p.offerPrice) : null,
    rating: p.rating ? Number(p.rating) : 4.5,
  };
}

/**
 * Fetch all active, customer-facing products from the backend.
 * @returns {Promise<Array<object>>} mapped catalog products
 */
export async function fetchCatalogProducts() {
  const data = await api.get('/api/products?limit=100');
  return (data.products || []).map(toCatalogProduct);
}

