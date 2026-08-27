// Customers Service — backend-backed admin customer list.
import { api } from '../utils/api';

function toCustomer(u) {
  const orders = u.orders || [];
  const totalSpent = orders.reduce((s, o) => s + (Number(o.total) || 0), 0);
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone || '',
    companyName: u.companyName || '',
    orders: orders.length,
    totalSpent,
    status: 'Active',
    joinedDate: u.createdAt,
  };
}

export const customerService = {
  async getCustomers() {
    try {
      const data = await api.get('/api/admin/users');
      return (data.users || []).map(toCustomer);
    } catch (err) {
      console.warn('Backend unavailable for customers:', err.message);
      return [];
    }
  },

  async addCustomer() {
    return null;
  },

  async updateCustomer() {
    return null;
  },

  async getCustomerStats() {
    const list = await this.getCustomers();
    if (!list.length) {
      return { totalCustomers: 0, activeCustomers: 0, newThisMonth: 0, repeatCustomers: 0, avgSpent: 0 };
    }

    const active = list.filter((c) => c.status === 'Active').length;
    const totalSpentSum = list.reduce((s, c) => s + (c.totalSpent || 0), 0);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000);
    const newThisMonth = list.filter((c) => {
      const j = new Date(c.joinedDate);
      return !isNaN(j) && j >= thirtyDaysAgo;
    }).length;
    const repeatCustomers = list.filter((c) => (c.orders || 0) >= 2).length;

    return {
      totalCustomers: list.length,
      activeCustomers: active,
      newThisMonth,
      repeatCustomers,
      avgSpent: list.length > 0 ? Math.round(totalSpentSum / list.length) : 0,
    };
  },
};
