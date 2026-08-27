// Brand Service — backend-backed brand management for the "Brand Categories"
// admin page. Keeps the same method names the old categoryService used so the
// Categories page only changes its import.
import { api } from '../utils/api';
import { activityService } from './activityService';

function toBrand(b) {
  return {
    id: b.id,
    name: b.name,
    slug: b.slug,
    logoText: (b.name || '').substring(0, 2).toUpperCase(),
    count: b._count?.products ?? 0,
    status: 'Active',
  };
}

export const brandService = {
  async getCategories() {
    try {
      const data = await api.get('/api/brands');
      return (data.brands || []).map(toBrand);
    } catch (err) {
      console.warn('Backend unavailable for brands:', err.message);
      return [];
    }
  },

  // Brands have no active flag — keep the UI toggle harmless.
  async toggleCategoryStatus() {
    return true;
  },

  async addCategory(category) {
    const data = await api.post('/api/brands', { name: category.name });
    await activityService.logActivity('Category Created', `New brand category "${category.name}" was added.`);
    return toBrand(data.brand);
  },

  async updateCategory(id, categoryData) {
    const data = await api.put(`/api/brands/${id}`, { name: categoryData.name });
    await activityService.logActivity('Category Updated', `Category "${categoryData.name}" was updated.`);
    return toBrand(data.brand);
  },

  async deleteCategory(id) {
    await api.del(`/api/brands/${id}`);
    await activityService.logActivity('Category Deleted', `Brand category #${id} was removed.`);
    return true;
  },
};
