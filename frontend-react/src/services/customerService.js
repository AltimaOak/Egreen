// Mock Customers Registry Service
import { storageService } from './storageService';

const CUSTOMERS_KEY = 'customers_list';

const DEFAULT_CUSTOMERS = [
  { id: 'cust_1', name: 'Rahul Sharma', email: 'rahul@gmail.com', orders: 8, totalSpent: 248800, status: 'Active', joinedDate: 'May 2024' },
  { id: 'cust_2', name: 'Priya Singh', email: 'priya@gmail.com', orders: 5, totalSpent: 128400, status: 'Active', joinedDate: 'Apr 2024' },
  { id: 'cust_3', name: 'Amit Verma', email: 'amit@gmail.com', orders: 12, totalSpent: 312900, status: 'Active', joinedDate: 'Mar 2024' },
  { id: 'cust_4', name: 'Neha Kapoor', email: 'neha@gmail.com', orders: 4, totalSpent: 98700, status: 'Active', joinedDate: 'Mar 2024' },
  { id: 'cust_5', name: 'Karan Mehta', email: 'karan@gmail.com', orders: 6, totalSpent: 145800, status: 'Active', joinedDate: 'Feb 2024' }
];

export const customerService = {
  _ensureSeeded() {
    const list = storageService.load(CUSTOMERS_KEY, null);
    if (list === null) {
      storageService.save(CUSTOMERS_KEY, DEFAULT_CUSTOMERS);
      return DEFAULT_CUSTOMERS;
    }
    return list;
  },

  async getCustomers() {
    await storageService.simulateDelay(150);
    return this._ensureSeeded();
  },

  async getCustomerStats() {
    const list = this._ensureSeeded();
    const active = list.filter(c => c.status === 'Active').length;
    const totalSpentSum = list.reduce((sum, c) => sum + c.totalSpent, 0);
    return {
      totalCustomers: list.length,
      activeCustomers: active,
      newThisMonth: 12, // mock value
      avgSpent: Math.round(totalSpentSum / list.length)
    };
  }
};
