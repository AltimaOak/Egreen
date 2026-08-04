// Category Service — backend-backed. Used by the admin product form for the
// category dropdown.
import { api } from '../utils/api';

function toCategory(c) {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    value: c.slug,
    label: c.name,
    count: c._count?.products ?? 0,
  };
}

export const categoryService = {
  async getCategories() {
    const data = await api.get('/api/categories');
    return (data.categories || []).map(toCategory);
  },

  // Kept for parity with the old API; categories have no active flag.
  async toggleCategoryStatus() {
    return true;
  },

  async addCategory(category) {
    const data = await api.post('/api/categories', { name: category.name });
    return toCategory(data.category);
  },

  async updateCategory(id, categoryData) {
    const data = await api.put(`/api/categories/${id}`, { name: categoryData.name });
    return toCategory(data.category);
  },

  async deleteCategory(id) {
    await api.del(`/api/categories/${id}`);
    return true;
  },
};
