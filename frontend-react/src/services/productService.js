// Product Service — backed by the backend API (admin-facing shape).
import { api } from '../utils/api';
import { activityService } from './activityService';

const STOCK_TO_NUMBER = {
  'In Stock': 100,
  'Low Stock': 3,
  'Out of stock': 0,
};

function numberToStock(n) {
  const num = Number(n) || 0;
  if (num === 0) return 'Out of stock';
  if (num < 5) return 'Low Stock';
  return 'In Stock';
}

// The backend stores specs as "Key: Value, Key: Value"; the admin form uses an
// array of { key, value }.
function parseSpecs(specs) {
  if (!specs) return [];
  return specs
    .split(', ')
    .filter(Boolean)
    .map((part) => {
      const idx = part.indexOf(': ');
      if (idx === -1) return { key: part, value: '' };
      return { key: part.slice(0, idx).trim(), value: part.slice(idx + 2).trim() };
    });
}

function specsToString(specifications) {
  return (specifications || [])
    .filter((s) => s && s.key && s.value)
    .map((s) => `${s.key}: ${s.value}`)
    .join(', ');
}

function toAdminProduct(p) {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    SKU: p.sku || '',
    description: p.description || '',
    category: p.category?.slug || '',
    brand: p.brand?.name || '',
    price: p.price != null ? Number(p.price) : 0,
    offerPrice: p.offerPrice != null ? Number(p.offerPrice) : null,
    stock: STOCK_TO_NUMBER[p.stock] ?? 100,
    status: p.isActive ? 'Active' : 'Inactive',
    featured: p.isFeatured,
    specifications: parseSpecs(p.specs),
    features: p.features || [],
    rating: p.rating != null ? Number(p.rating) : null,
    image: p.image || '',
    imagePublicId: p.imagePublicId || '',
    gallery: p.gallery || [],
    seoTitle: p.seoTitle || '',
    seoDescription: p.seoDescription || '',
    createdDate: p.createdAt,
    updatedDate: p.updatedAt,
  };
}

function toBackendPayload(form) {
  const conditionSpec = (form.specifications || []).find(
    (s) => s.key && s.key.toLowerCase() === 'condition'
  );
  return {
    name: form.name,
    slug: form.slug || undefined,
    sku: form.SKU || null,
    description: form.description || null,
    categorySlug: form.category,
    brandName: form.brand || null,
    price: form.price != null ? Number(form.price) : null,
    offerPrice: form.offerPrice != null ? Number(form.offerPrice) : null,
    rating: form.rating != null ? Number(form.rating) : null,
    stock: numberToStock(form.stock),
    condition: conditionSpec?.value || 'New',
    specs: specsToString(form.specifications),
    image: form.image || '',
    imagePublicId: form.imagePublicId || null,
    seoTitle: form.seoTitle || null,
    seoDescription: form.seoDescription || null,
    features: form.features || [],
    gallery: form.gallery || [],
    isFeatured: !!form.featured,
    isActive: form.status === 'Active',
  };
}

export const productService = {
  async getProducts() {
    const data = await api.get('/api/products?limit=100');
    return (data.products || []).map(toAdminProduct);
  },

  async getBrands() {
    const data = await api.get('/api/brands');
    return (data.brands || []).map((b) => ({
      value: b.name,
      label: b.name,
      count: b._count?.products ?? 0,
    }));
  },

  async getProduct(id) {
    const data = await api.get(`/api/products/${id}`);
    return data.product ? toAdminProduct(data.product) : null;
  },

  async createProduct(productData) {
    const data = await api.post('/api/products', toBackendPayload(productData));
    await activityService.logActivity(
      'Product Created',
      `Product "${data.product?.name}" (SKU: ${productData.SKU || '-'}) has been created.`
    );
    return toAdminProduct(data.product);
  },

  async updateProduct(id, productData) {
    const data = await api.put(`/api/products/${id}`, toBackendPayload(productData));
    await activityService.logActivity(
      'Product Updated',
      `Product "${data.product?.name}" (SKU: ${productData.SKU || '-'}) was modified.`
    );
    return toAdminProduct(data.product);
  },

  async deleteProduct(id) {
    const data = await api.del(`/api/products/${id}`);
    await activityService.logActivity('Product Deleted', `Product #${id} was deleted.`);
    return !!(data && data.deleted);
  },
};
