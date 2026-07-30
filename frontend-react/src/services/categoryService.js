// Mock Categories Management Service
import { storageService } from './storageService';
import { activityService } from './activityService';

const CATEGORIES_KEY = 'categories_list';

const DEFAULT_CATEGORIES = [
  { id: 'cat_dell', name: 'Dell', logoText: 'DE', count: 112, subcategories: 'Laptops, Monitors, Accessories', status: 'Active' },
  { id: 'cat_lenovo', name: 'Lenovo', logoText: 'LN', count: 78, subcategories: 'Laptops, Tablets, Accessories', status: 'Active' },
  { id: 'cat_hp', name: 'HP', logoText: 'HP', count: 36, subcategories: 'Laptops, Printers, Accessories', status: 'Active' },
  { id: 'cat_acer', name: 'Acer', logoText: 'AC', count: 22, subcategories: 'Laptops, Monitors, Accessories', status: 'Active' },
  { id: 'cat_others', name: 'Other Brands', logoText: 'OT', count: 0, subcategories: 'Accessories, Others', status: 'Active' }
];

export const categoryService = {
  _ensureSeeded() {
    const list = storageService.load(CATEGORIES_KEY, null);
    if (list === null) {
      storageService.save(CATEGORIES_KEY, DEFAULT_CATEGORIES);
      return DEFAULT_CATEGORIES;
    }
    return list;
  },

  async getCategories() {
    await storageService.simulateDelay(100);
    return this._ensureSeeded();
  },

  async toggleCategoryStatus(id) {
    await storageService.simulateDelay(300);
    const list = this._ensureSeeded();
    const index = list.findIndex(c => c.id === id);
    if (index !== -1) {
      const nextStatus = list[index].status === 'Active' ? 'Inactive' : 'Active';
      list[index].status = nextStatus;
      storageService.save(CATEGORIES_KEY, list);
      await activityService.logActivity('Category Modified', `Category "${list[index].name}" status toggled to ${nextStatus}.`);
      return true;
    }
    return false;
  },

  async addCategory(category) {
    await storageService.simulateDelay(1000);
    const list = this._ensureSeeded();
    const newCat = {
      ...category,
      id: 'cat_' + Date.now(),
      count: 0,
      logoText: category.name.substring(0, 2).toUpperCase()
    };
    list.push(newCat);
    storageService.save(CATEGORIES_KEY, list);
    await activityService.logActivity('Category Created', `New brand category "${newCat.name}" was added.`);
    return newCat;
  }
};
