// Catalog Service — reads the customer-facing product catalog from the backend
// API and maps each Product to the shape the customer Products page expects.
import { api } from '../utils/api';

// `stock` is a numeric unit count from the backend (0 = Out of stock,
// < 5 = Low Stock, otherwise In Stock). The catalog page renders it as such.

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
  const parsedStock = Number(p.stock);
  const stock = Number.isFinite(parsedStock) ? parsedStock : 10;

  const specsList = parseSpecs(p.specs, p.condition || 'Refurbished');
  const warrantySpec = specsList.find((s) => s.key && s.key.toLowerCase() === 'warranty');
  const featuresObj = typeof p.features === 'object' && p.features !== null && !Array.isArray(p.features) ? p.features : {};
  const warranty = featuresObj.warranty || (warrantySpec ? warrantySpec.value : '3 Years');
  const pricingTiers = Array.isArray(featuresObj.pricingTiers) ? featuresObj.pricingTiers : [];
  const variantGroups = Array.isArray(featuresObj.__variantGroups) ? featuresObj.__variantGroups : [];

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
    gallery: Array.isArray(p.gallery) ? p.gallery : (typeof p.gallery === 'string' ? (()=>{ try { return JSON.parse(p.gallery); } catch(e){ return []; } })() : []),
  features: Array.isArray(p.features)
    ? p.features
    : (Array.isArray(featuresObj.bulletFeatures)
      ? featuresObj.bulletFeatures
      : (Array.isArray(featuresObj.features) ? featuresObj.features : [])),
    warranty: warranty,
    pricingTiers: pricingTiers,
    status: p.isActive ? 'Active' : 'Inactive',
    stock: typeof stock === 'number' && !isNaN(stock) ? stock : 10,
    condition: p.condition || 'Refurbished',
    rawSpecs: p.specs || '',
    specifications: specsList,
    price: p.price != null && !isNaN(Number(p.price)) ? Number(p.price) : null,
    offerPrice: p.offerPrice != null && !isNaN(Number(p.offerPrice)) ? Number(p.offerPrice) : null,
    rating: p.rating ? Number(p.rating) : 4.5,
    variantGroups,
  variants: Array.isArray(p.variants) ? p.variants : [],
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

