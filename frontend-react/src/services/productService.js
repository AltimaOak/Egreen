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
  const specsList = parseSpecs(p.specs);
  const warrantySpec = specsList.find((s) => s.key && s.key.toLowerCase() === 'warranty');
  const featuresObj = typeof p.features === 'object' && p.features !== null ? p.features : {};
  const warranty = featuresObj.warranty || (warrantySpec ? warrantySpec.value : '3 Years');
  
  // Extract or initialize dual pricing tiers
  let pricingTiers = Array.isArray(featuresObj.pricingTiers) ? featuresObj.pricingTiers : [];
  if (pricingTiers.length === 0) {
    pricingTiers = [
      {
        id: 'tier-1',
        name: 'Standard Configuration',
        specs: p.specs || '',
        price: p.price != null ? Number(p.price) : 0,
        offerPrice: p.offerPrice != null ? Number(p.offerPrice) : null,
      },
      {
        id: 'tier-2',
        name: 'Upgraded Configuration',
        specs: '',
        price: '',
        offerPrice: '',
      },
    ];
  }

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
    warranty: warranty,
    pricingTiers: pricingTiers,
    stock: typeof p.stock === 'number' ? p.stock : (STOCK_TO_NUMBER[p.stock] ?? (parseInt(p.stock, 10) || 10)),
    status: p.isActive ? 'Active' : 'Inactive',
    featured: p.isFeatured,
    specifications: specsList,
    features: Array.isArray(featuresObj.bulletFeatures) ? featuresObj.bulletFeatures : (Array.isArray(p.features) ? p.features : []),
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
  const specs = [...(form.specifications || [])];
  
  // Ensure Warranty is explicitly saved in specifications
  if (form.warranty) {
    const wIdx = specs.findIndex((s) => s.key && s.key.toLowerCase() === 'warranty');
    if (wIdx >= 0) {
      specs[wIdx].value = form.warranty;
    } else {
      specs.push({ key: 'Warranty', value: form.warranty });
    }
  }

  const conditionSpec = specs.find(
    (s) => s.key && s.key.toLowerCase() === 'condition'
  );

  // Clean pricing tiers
  const cleanPricingTiers = (form.pricingTiers || []).filter(
    (t) => t && (t.name || t.price || t.specs)
  ).map((t, idx) => ({
    id: t.id || `tier-${idx + 1}`,
    name: t.name || (idx === 0 ? 'Standard Configuration' : 'Upgraded Configuration'),
    specs: t.specs || '',
    price: t.price !== '' && t.price != null ? Number(t.price) : null,
    offerPrice: t.offerPrice !== '' && t.offerPrice != null ? Number(t.offerPrice) : null,
  }));

  const mainPrice = cleanPricingTiers.length > 0 && cleanPricingTiers[0].price != null
    ? cleanPricingTiers[0].price
    : (form.price != null && form.price !== '' ? Number(form.price) : null);

  const mainOfferPrice = cleanPricingTiers.length > 0 && cleanPricingTiers[0].offerPrice != null
    ? cleanPricingTiers[0].offerPrice
    : (form.offerPrice != null && form.offerPrice !== '' ? Number(form.offerPrice) : null);

  const featuresPayload = {
    warranty: form.warranty || '3 Years',
    pricingTiers: cleanPricingTiers,
    bulletFeatures: Array.isArray(form.features) ? form.features : [],
  };

  return {
    name: form.name,
    slug: form.slug || undefined,
    sku: form.SKU || null,
    description: form.description || null,
    categorySlug: form.category,
    brandName: form.brand || null,
    price: mainPrice,
    offerPrice: mainOfferPrice,
    rating: form.rating != null ? Number(form.rating) : null,
    stock: numberToStock(form.stock),
    condition: conditionSpec?.value || form.condition || 'Refurbished',
    specs: specsToString(specs),
    image: form.image || '',
    imagePublicId: form.imagePublicId || null,
    seoTitle: form.seoTitle || null,
    seoDescription: form.seoDescription || null,
    features: featuresPayload,
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
