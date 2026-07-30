// Product Service for CRUD Operations
import { storageService } from './storageService';
import { activityService } from './activityService';
import { products as originalProducts } from '../data/products';

const PRODUCTS_KEY = 'products_list';

/**
 * Generate standard slug from string
 * @param {string} text 
 */
function generateSlug(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')       // Replace spaces with -
    .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
    .replace(/\-\-+/g, '-');    // Replace multiple - with single -
}

export const productService = {
  /**
   * Seed original products if Local Storage is empty
   * @private
   */
  _ensureSeeded() {
    const list = storageService.load(PRODUCTS_KEY, null);
    if (list === null) {
      // Map original products to the new extended schema
      const seeded = originalProducts.map(p => {
        const brandMatch = p.name.match(/(Dell|HP|Lenovo|Intel|Asus|Apacer)/i);
        const brand = brandMatch ? brandMatch[0] : 'Generic';
        
        return {
          id: String(p.id),
          name: p.name,
          slug: generateSlug(p.name),
          category: p.category || 'other',
          description: p.specs || `High-quality ${p.condition} ${p.name} designed for business and professional workspaces.`,
          price: p.condition === 'New' ? 24999 : 14999,
          offerPrice: p.condition === 'New' ? 21999 : 11999,
          brand: brand,
          SKU: `EG-${brand.toUpperCase()}-${p.id}`,
          stock: p.stock === 'Low Stock' ? 3 : (p.stock === 'Out of Stock' ? 0 : 15),
          rating: 4.5,
          status: 'Active', // Default status
          featured: p.id <= 3, // Make first 3 items featured
          features: [
            'Tested and certified genuine',
            'Energy-efficient performance',
            'Compact form factor'
          ],
          specifications: [
            { key: 'Specs Details', value: p.specs || 'Contact for specs' },
            { key: 'Condition', value: p.condition || 'Refurbished' }
          ],
          seoTitle: `${p.name} - Egreen Technology`,
          seoDescription: `Buy ${p.condition} ${p.name} online. Specs: ${p.specs || 'Contact for specs'}. Cheap bulk wholesale rates at Egreen.`,
          createdDate: new Date(Date.now() - 30 * 24 * 3600000).toISOString(), // 30 days ago
          updatedDate: new Date().toISOString(),
          image: p.image || '',
          gallery: []
        };
      });
      storageService.save(PRODUCTS_KEY, seeded);
      return seeded;
    }
    return list;
  },

  /**
   * Fetch all products
   * @returns {Promise<Array>}
   */
  async getProducts() {
    await storageService.simulateDelay(500); // minor delay for listings
    return this._ensureSeeded();
  },

  /**
   * Fetch product by ID
   * @param {string} id 
   * @returns {Promise<any|null>}
   */
  async getProduct(id) {
    await storageService.simulateDelay(300);
    const list = this._ensureSeeded();
    return list.find(p => p.id === String(id)) || null;
  },

  /**
   * Create new product
   * @param {any} productData 
   * @returns {Promise<any>}
   */
  async createProduct(productData) {
    await storageService.simulateDelay(2000); // 2s simulated API delay
    const list = this._ensureSeeded();
    
    const newProduct = {
      ...productData,
      id: 'prod_' + Date.now(),
      slug: productData.slug || generateSlug(productData.name),
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString()
    };

    list.unshift(newProduct);
    storageService.save(PRODUCTS_KEY, list);
    
    // Log Activity
    await activityService.logActivity('Product Created', `Product "${newProduct.name}" (SKU: ${newProduct.SKU}) has been created.`);
    
    return newProduct;
  },

  /**
   * Update existing product
   * @param {string} id 
   * @param {any} productData 
   * @returns {Promise<any>}
   */
  async updateProduct(id, productData) {
    await storageService.simulateDelay(2000); // 2s simulated API delay
    const list = this._ensureSeeded();
    const index = list.findIndex(p => p.id === String(id));
    
    if (index === -1) {
      throw new Error(`Product with ID ${id} not found.`);
    }

    const updatedProduct = {
      ...list[index],
      ...productData,
      slug: productData.slug || generateSlug(productData.name),
      updatedDate: new Date().toISOString()
    };

    list[index] = updatedProduct;
    storageService.save(PRODUCTS_KEY, list);
    
    // Log Activity
    await activityService.logActivity('Product Updated', `Product "${updatedProduct.name}" (SKU: ${updatedProduct.SKU}) was modified.`);
    
    return updatedProduct;
  },

  /**
   * Delete product by ID
   * @param {string} id 
   * @returns {Promise<boolean>}
   */
  async deleteProduct(id) {
    await storageService.simulateDelay(2000); // 2s simulated API delay
    const list = this._ensureSeeded();
    const product = list.find(p => p.id === String(id));
    
    if (!product) {
      return false;
    }

    const filtered = list.filter(p => p.id !== String(id));
    storageService.save(PRODUCTS_KEY, filtered);
    
    // Log Activity
    await activityService.logActivity('Product Deleted', `Product "${product.name}" (SKU: ${product.SKU}) was permanently deleted.`);
    
    return true;
  }
};
