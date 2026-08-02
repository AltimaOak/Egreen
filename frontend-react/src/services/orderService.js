// Orders Service — backed by localStorage, no pre-seeded mock data
import { storageService } from './storageService';
import { activityService } from './activityService';

const ORDERS_KEY = 'orders_list';

export const orderService = {
  _load() {
    // Returns an empty array if nothing has been saved yet — no seeds
    return storageService.load(ORDERS_KEY, []);
  },

  async getOrders() {
    await storageService.simulateDelay(200);
    return this._load();
  },

  async updateOrderStatus(id, status) {
    await storageService.simulateDelay(600);
    const list = this._load();
    const index = list.findIndex(o => o.id === id);
    if (index !== -1) {
      list[index].status = status;
      storageService.save(ORDERS_KEY, list);
      await activityService.logActivity('Order Updated', `Order #${id} status changed to ${status}.`);
      return true;
    }
    return false;
  },

  async addOrder(orderData) {
    await storageService.simulateDelay(600);
    const list = this._load();
    const newOrder = {
      ...orderData,
      id: 'EG' + Date.now(),
      date: new Date().toISOString(),
    };
    list.unshift(newOrder);
    storageService.save(ORDERS_KEY, list);
    await activityService.logActivity('Order Created', `Order #${newOrder.id} placed by ${newOrder.customerName}.`);
    return newOrder;
  },

  async getOrderStats() {
    const list = this._load();
    const totalRevenue = list
      .filter(o => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + (o.amount || 0), 0);
    return {
      totalRevenue,
      ordersCount: list.length,
      pendingCount: list.filter(o => o.status === 'Pending' || o.status === 'Processing').length,
    };
  },
};
