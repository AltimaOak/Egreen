// Mock Orders Management Service
import { storageService } from './storageService';
import { activityService } from './activityService';

const ORDERS_KEY = 'orders_list';

const DEFAULT_ORDERS = [
  { id: 'EG1286', customerName: 'Rahul Sharma', customerEmail: 'rahul@gmail.com', items: '2 items', amount: 45000, status: 'Completed', date: new Date(Date.now() - 3600000 * 2).toISOString() }, // 2 hours ago
  { id: 'EG1285', customerName: 'Priya Singh', customerEmail: 'priya@gmail.com', items: '1 item', amount: 12500, status: 'Processing', date: new Date(Date.now() - 3600000 * 12).toISOString() }, // 12 hours ago
  { id: 'EG1284', customerName: 'Amit Verma', customerEmail: 'amit@gmail.com', items: '3 items', amount: 25999, status: 'Shipped', date: new Date(Date.now() - 86400000).toISOString() }, // 1 day ago
  { id: 'EG1283', customerName: 'Neha Kapoor', customerEmail: 'neha@gmail.com', items: '2 items', amount: 16400, status: 'Pending', date: new Date(Date.now() - 86400000 * 2).toISOString() }, // 2 days ago
  { id: 'EG1282', customerName: 'Karan Mehta', customerEmail: 'karan@gmail.com', items: '1 item', amount: 8250, status: 'Delivered', date: new Date(Date.now() - 86400000 * 3).toISOString() } // 3 days ago
];

export const orderService = {
  _ensureSeeded() {
    const list = storageService.load(ORDERS_KEY, null);
    if (list === null) {
      storageService.save(ORDERS_KEY, DEFAULT_ORDERS);
      return DEFAULT_ORDERS;
    }
    return list;
  },

  async getOrders() {
    await storageService.simulateDelay(200);
    return this._ensureSeeded();
  },

  async updateOrderStatus(id, status) {
    await storageService.simulateDelay(800);
    const list = this._ensureSeeded();
    const index = list.findIndex(o => o.id === id);
    if (index !== -1) {
      list[index].status = status;
      storageService.save(ORDERS_KEY, list);
      await activityService.logActivity('Order Updated', `Order #${id} status changed to ${status}.`);
      return true;
    }
    return false;
  },

  async getOrderStats() {
    const list = this._ensureSeeded();
    const totalRevenue = list
      .filter(o => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + o.amount, 0);
    return {
      totalRevenue,
      ordersCount: list.length,
      pendingCount: list.filter(o => o.status === 'Pending' || o.status === 'Processing').length
    };
  }
};
