// Orders Service — backend-backed admin order management.
import { api } from '../utils/api';
import { activityService } from './activityService';

function titleCase(status) {
  if (!status) return 'Pending';
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function toOrder(o) {
  return {
    id: o.id,
    customerName: o.user?.name || 'Customer',
    customerEmail: o.user?.email || '',
    items: o.items?.length ?? 0,
    amount: o.total != null ? Number(o.total) : 0,
    status: titleCase(o.status),
    date: o.createdAt,
    brand: o.items?.[0]?.product?.brand?.name || 'Other',
  };
}

export const orderService = {
  async getOrders() {
    const data = await api.get('/api/admin/orders');
    return (data.orders || []).map(toOrder);
  },

  async updateOrderStatus(id, status) {
    await api.patch(`/api/admin/orders/${id}/status`, { status: (status || '').toLowerCase() });
    await activityService.logActivity('Order Updated', `Order #${id} status changed to ${status}.`);
    return true;
  },

  async addOrder() {
    // Orders are created by the customer checkout flow, not from the admin.
    return null;
  },

  async getOrderStats() {
    const list = await this.getOrders();
    const totalRevenue = list
      .filter((o) => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + (o.amount || 0), 0);
    return {
      totalRevenue,
      ordersCount: list.length,
      pendingCount: list.filter((o) => o.status === 'Pending' || o.status === 'Processing').length,
    };
  },
};
