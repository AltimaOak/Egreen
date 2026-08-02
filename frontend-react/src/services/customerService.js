// Customers Service — backed by localStorage, no pre-seeded mock data
import { storageService } from './storageService';
import { activityService } from './activityService';

const CUSTOMERS_KEY = 'customers_list';

export const customerService = {
  _load() {
    return storageService.load(CUSTOMERS_KEY, []);
  },

  async getCustomers() {
    await storageService.simulateDelay(150);
    return this._load();
  },

  async addCustomer(customerData) {
    await storageService.simulateDelay(400);
    const list = this._load();
    const newCustomer = {
      ...customerData,
      id: 'cust_' + Date.now(),
      joinedDate: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
      orders: 0,
      totalSpent: 0,
      status: 'Active',
    };
    list.push(newCustomer);
    storageService.save(CUSTOMERS_KEY, list);
    await activityService.logActivity('Customer Added', `New customer "${newCustomer.name}" registered.`);
    return newCustomer;
  },

  async updateCustomer(id, data) {
    await storageService.simulateDelay(400);
    const list = this._load();
    const index = list.findIndex(c => c.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...data };
      storageService.save(CUSTOMERS_KEY, list);
      await activityService.logActivity('Customer Updated', `Customer "${list[index].name}" was updated.`);
      return list[index];
    }
    return null;
  },

  async getCustomerStats() {
    const list = this._load();
    if (!list.length) return { totalCustomers: 0, activeCustomers: 0, newThisMonth: 0, repeatCustomers: 0, avgSpent: 0 };

    const active = list.filter(c => c.status === 'Active').length;
    const totalSpentSum = list.reduce((s, c) => s + (c.totalSpent || 0), 0);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000);
    const newThisMonth = list.filter(c => {
      const j = new Date(c.joinedDate);
      return !isNaN(j) && j >= thirtyDaysAgo;
    }).length;
    const repeatCustomers = list.filter(c => (c.orders || 0) >= 2).length;

    return {
      totalCustomers: list.length,
      activeCustomers: active,
      newThisMonth,
      repeatCustomers,
      avgSpent: list.length > 0 ? Math.round(totalSpentSum / list.length) : 0,
    };
  },
};
