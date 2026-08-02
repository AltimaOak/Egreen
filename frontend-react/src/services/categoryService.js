// Categories Service — backed by localStorage, no pre-seeded mock data
import { storageService } from './storageService';
import { activityService } from './activityService';

const CATEGORIES_KEY = 'categories_list';

export const categoryService = {
  _load() {
    return storageService.load(CATEGORIES_KEY, []);
  },

  async getCategories() {
    await storageService.simulateDelay(100);
    return this._load();
  },

  async toggleCategoryStatus(id) {
    await storageService.simulateDelay(300);
    const list = this._load();
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
    await storageService.simulateDelay(300);
    const list = this._load();
    const newCat = {
      ...category,
      id: 'cat_' + Date.now(),
      count: 0,
      logoText: category.name.substring(0, 2).toUpperCase(),
    };
    list.push(newCat);
    storageService.save(CATEGORIES_KEY, list);
    await activityService.logActivity('Category Created', `New brand category "${newCat.name}" was added.`);
    return newCat;
  },

  async updateCategory(id, categoryData) {
    await storageService.simulateDelay(300);
    const list = this._load();
    const index = list.findIndex(c => c.id === id);
    if (index !== -1) {
      list[index] = {
        ...list[index],
        ...categoryData,
        logoText: (categoryData.name || list[index].name).substring(0, 2).toUpperCase(),
      };
      storageService.save(CATEGORIES_KEY, list);
      await activityService.logActivity('Category Updated', `Category "${list[index].name}" was updated.`);
      return list[index];
    }
    return null;
  },

  async deleteCategory(id) {
    await storageService.simulateDelay(300);
    const list = this._load();
    const cat = list.find(c => c.id === id);
    const updated = list.filter(c => c.id !== id);
    storageService.save(CATEGORIES_KEY, updated);
    if (cat) {
      await activityService.logActivity('Category Deleted', `Brand category "${cat.name}" was removed.`);
    }
    return true;
  },
};
