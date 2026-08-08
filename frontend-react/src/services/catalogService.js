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
 * Map a backend Product row into the flat shape the Products page consumes.
 * @param {object} p - Product from GET /api/products
 */
function toCatalogProduct(p) {
  const stock =
    p.stock in STOCK_TO_NUMBER ? STOCK_TO_NUMBER[p.stock] : 100;

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description || '',
    category: p.category?.slug || '',
    image: p.image || '',
    status: p.isActive ? 'Active' : 'Inactive',
    stock,
    // The page derives the condition badge from a spec keyed 'condition'.
    specifications: [{ key: 'Condition', value: p.condition || 'Refurbished' }],
    price: p.price != null ? Number(p.price) : null,
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
