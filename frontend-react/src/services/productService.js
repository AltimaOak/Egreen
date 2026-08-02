// Product Service — backed by localStorage, no pre-seeded mock data
import { storageService } from './storageService';
import { activityService } from './activityService';

const PRODUCTS_KEY = 'products_list';

function generateSlug(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

export const productService = {
  _load() {
    return storageService.load(PRODUCTS_KEY, []);
  },

  /**
   * Fetch all products — returns [] if none added yet
   */
  async getProducts() {
    await storageService.simulateDelay(300);
    return this._load();
  },

  /**
   * Fetch unique brands from existing products
   */
  async getBrands() {
    await storageService.simulateDelay(100);
    const list = this._load();
    const brandSet = {};
    list.forEach(p => { if (p.brand) brandSet[p.brand] = (brandSet[p.brand] || 0) + 1; });
    return Object.keys(brandSet).map(b => ({ value: b, label: b, count: brandSet[b] }));
  },

  /**
   * Fetch single product by ID
   */
  async getProduct(id) {
    await storageService.simulateDelay(150);
    const list = this._load();
    return list.find(p => p.id === String(id)) || null;
  },

  /**
   * Create a new product
   */
  async createProduct(productData) {
    await storageService.simulateDelay(1000);
    const list = this._load();

    const newProduct = {
      ...productData,
      id: 'prod_' + Date.now(),
      slug: productData.slug || generateSlug(productData.name),
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
    };

    list.unshift(newProduct);
    storageService.save(PRODUCTS_KEY, list);
    await activityService.logActivity('Product Created', `Product "${newProduct.name}" (SKU: ${newProduct.SKU}) has been created.`);
    return newProduct;
  },

  /**
   * Update an existing product
   */
  async updateProduct(id, productData) {
    await storageService.simulateDelay(1000);
    const list = this._load();
    const index = list.findIndex(p => p.id === String(id));

    if (index === -1) throw new Error(`Product with ID ${id} not found.`);

    const updated = {
      ...list[index],
      ...productData,
      slug: productData.slug || generateSlug(productData.name),
      updatedDate: new Date().toISOString(),
    };

    list[index] = updated;
    storageService.save(PRODUCTS_KEY, list);
    await activityService.logActivity('Product Updated', `Product "${updated.name}" (SKU: ${updated.SKU}) was modified.`);
    return updated;
  },

  /**
   * Delete a product by ID
   */
  async deleteProduct(id) {
    await storageService.simulateDelay(800);
    const list = this._load();
    const product = list.find(p => p.id === String(id));

    if (!product) return false;

    storageService.save(PRODUCTS_KEY, list.filter(p => p.id !== String(id)));
    await activityService.logActivity('Product Deleted', `Product "${product.name}" (SKU: ${product.SKU}) was permanently deleted.`);
    return true;
  },
};
