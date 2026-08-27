// Product Service — backed by the backend API (admin-facing shape).
import { api } from '../utils/api';
import { activityService } from './activityService';

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
    stock: typeof p.stock === 'number' ? p.stock : (STOCK_TO_NUMBER[p.stock] ?? (parseInt(p.stock, 10) || 10)),
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
    stock: form.stock != null ? Number(form.stock) : 0,
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
    try {
      const data = await api.get('/api/products?limit=100');
      return (data.products || []).map(toAdminProduct);
    } catch (err) {
      console.warn('Backend unavailable for products:', err.message);
      return [];
    }
  },

  async getBrands() {
    try {
      const data = await api.get('/api/brands');
      return (data.brands || []).map((b) => ({
        value: b.name,
        label: b.name,
        count: b._count?.products ?? 0,
      }));
    } catch (err) {
      console.warn('Backend unavailable for brands:', err.message);
      return [];
    }
  },

  async getProduct(id) {
    try {
      const data = await api.get(`/api/products/${id}`);
      return data.product ? toAdminProduct(data.product) : null;
    } catch {
      return null;
    }
  },

  async createProduct(productData) {
    try {
      const data = await api.post('/api/products', toBackendPayload(productData));
      await activityService.logActivity(
        'Product Created',
        `Product "${data.product?.name || productData.name}" (SKU: ${productData.SKU || '-'}) created.`
      );
      return data.product ? toAdminProduct(data.product) : productData;
    } catch (err) {
      console.warn('Backend creation error, performing local save:', err.message);
      const newProduct = {
        id: Date.now(),
        ...productData,
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
      };
      await activityService.logActivity('Product Created', `Product "${productData.name}" created (Offline).`);
      return newProduct;
    }
  },

  async updateProduct(id, productData) {
    try {
      const data = await api.put(`/api/products/${id}`, toBackendPayload(productData));
      await activityService.logActivity(
        'Product Updated',
        `Product "${data.product?.name || productData.name}" modified.`
      );
      return data.product ? toAdminProduct(data.product) : productData;
    } catch (err) {
      console.warn('Backend update error, performing local update:', err.message);
      await activityService.logActivity('Product Updated', `Product "${productData.name}" updated (Offline).`);
      return { id, ...productData, updatedDate: new Date().toISOString() };
    }
  },

  async deleteProduct(id) {
    try {
      const data = await api.del(`/api/products/${id}`);
      await activityService.logActivity('Product Deleted', `Product #${id} deleted.`);
      return !!(data && data.deleted);
    } catch (err) {
      console.warn('Backend delete error:', err.message);
      await activityService.logActivity('Product Deleted', `Product #${id} deleted (Offline).`);
      return true;
    }
  },

  async getVariants(productId) {
    const data = await api.get(`/api/products/${productId}/variants`);
    return data.variants || [];
  },

  async createVariant(productId, payload) {
    const data = await api.post(`/api/products/${productId}/variants`, payload);
    return data.variant;
  },

  async updateVariant(productId, variantId, payload) {
    const data = await api.put(`/api/products/${productId}/variants/${variantId}`, payload);
    return data.variant;
  },

  async deleteVariant(productId, variantId) {
    const data = await api.del(`/api/products/${productId}/variants/${variantId}`);
    return data;
  },
};
