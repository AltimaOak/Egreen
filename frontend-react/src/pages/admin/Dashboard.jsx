// Admin Main Dashboard Component — Redesigned
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, StatCard, Badge, Button, SkeletonTable, EmptyState } from '../../components/admin/UI';
import { productService } from '../../services/productService';
import { orderService } from '../../services/orderService';
import { customerService } from '../../services/customerService';
import { activityService } from '../../services/activityService';
import { storageService } from '../../services/storageService';
import {
  DollarSign,
  ShoppingCart,
  ShoppingBag,
  Users,
  Clock,
  Package,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  FileText,
} from 'lucide-react';
import { formatPrice, formatDate, truncateText } from '../../utils/helpers';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
} from 'recharts';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    products: 0,
    customers: 0,
  });
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [activities, setActivities] = useState([]);
  const [pendingChanges, setPendingChanges] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const prodList = await productService.getProducts();
        const ordStats = await orderService.getOrderStats();
        const custStats = await customerService.getCustomerStats();
        const ordList = await orderService.getOrders();
        const actList = await activityService.getActivities();

        setStats({
          revenue: ordStats.totalRevenue,
          orders: ordStats.ordersCount,
          products: prodList.length,
          customers: custStats.totalCustomers,
        });
        setOrders(ordList);
        setProducts(prodList);
        setActivities(actList);
      } catch (e) {
        console.error('Failed to load dashboard data', e);
      } finally {
        setLoading(false);
      }
    };

    const pending = storageService.load('pending_changes_count', 0);
    const updated = storageService.load('last_updated_time', null);
    setPendingChanges(pending);
    setLastUpdated(updated);

    loadData();
  }, []);

  const chartData = useMemo(() => {
    if (!orders.length) return [];

    const byDay = {};
    orders.forEach((o) => {
      const day = new Date(o.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      byDay[day] = (byDay[day] || 0) + o.amount;
    });

    return Object.keys(byDay).map((day) => ({
      day,
      revenue: byDay[day],
    }));
  }, [orders]);

  if (loading) {
    return (
      <div>
        <div className="admin-stats-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} padding="sm">
              <div className="h-4 bg-muted/20 rounded w-3/4 animate-pulse mb-3"></div>
              <div className="h-6 bg-muted/20 rounded w-1/2 animate-pulse"></div>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6">
          <Card padding="sm"><SkeletonTable rows={5} cols={3} /></Card>
          <Card padding="sm"><SkeletonTable rows={5} cols={1} /></Card>
        </div>
      </div>
    );
  }

  const pendingOrders = orders.filter(o => o.status === 'Pending' || o.status === 'Processing').length;

  return (
    <div>
      {/* Page header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-subtitle">Overview of your Egreen Technology admin panel.</p>
        </div>
        {lastUpdated && (
          <div className="text-right">
            <p className="text-xs text-muted">Last updated</p>
            <p className="text-sm font-medium text-text">{new Date(lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
          </div>
        )}
      </div>

      {/* Status banner */}
      {pendingChanges > 0 && (
        <div className="mb-6 p-4 bg-warning/10 border border-warning/20 rounded-[var(--radius-card)]">
          <div className="flex items-center gap-3">
            <Clock size={16} className="text-warning" />
            <div>
              <span className="text-sm font-medium text-text">
                {pendingChanges} pending change{pendingChanges !== 1 ? 's' : ''} awaiting sync
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto"
              onClick={async () => {
                await activityService.clearPendingChanges();
                setPendingChanges(0);
              }}
            >
              <CheckCircle size={14} /> Mark as synced
            </Button>
          </div>
        </div>
      )}

      {/* KPI Stats */}
      <div className="admin-stats-grid">
        <StatCard
          title="Total Revenue"
          value={formatPrice(stats.revenue)}
          icon={<DollarSign size={20} />}
          iconBg="bg-success/10"
          iconColor="text-success"
          trend={12.5}
          trendUp={true}
          subtitle="vs last week"
        />
        <StatCard
          title="Total Orders"
          value={stats.orders.toLocaleString()}
          icon={<ShoppingCart size={20} />}
          iconBg="bg-danger/10"
          iconColor="text-danger"
          trend={8.2}
          trendUp={false}
          subtitle="vs last week"
        />
        <StatCard
          title="Total Products"
          value={stats.products.toString()}
          icon={<ShoppingBag size={20} />}
          iconBg="bg-blue/10"
          iconColor="text-blue"
          trend={5.7}
          trendUp={true}
          subtitle="vs last week"
        />
        <StatCard
          title="Total Customers"
          value={stats.customers.toLocaleString()}
          icon={<Users size={20} />}
          iconBg="bg-indigo/10"
          iconColor="text-indigo"
          trend={15.3}
          trendUp={true}
          subtitle="vs last week"
        />
      </div>

      {/* Main content grid: Chart + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6 mb-6">
        {/* Sales Overview Chart */}
        <Card title="Sales Overview" subtitle="Revenue from orders (last 7 days)">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 10, fill: 'var(--color-muted)' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: 'var(--color-muted)' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '10px' }}
                  labelStyle={{ color: 'var(--color-muted)', fontSize: '11px' }}
                  itemStyle={{ color: 'var(--color-text)', fontSize: '12px' }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  fill="var(--color-primary)"
                  fillOpacity={0.1}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card title="Recent Activity" subtitle="Latest admin actions">
          {activities.length === 0 ? (
            <EmptyState
              icon={<FileText size={24} />}
              title="No activity yet"
              description="Activity logs will appear here once you start managing content."
            />
          ) : (
            <div className="space-y-3">
              {activities.slice(0, 6).map((act) => (
                <div key={act.id} className="flex items-start gap-3 pb-3 border-b border-border last:border-0">
                  <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle size={12} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text">{act.action}</p>
                    <p className="text-xs text-muted mt-0.5 truncate">{act.details}</p>
                    <p className="text-xs text-muted mt-0.5">{formatDate(act.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Recent Products */}
      <div className="grid grid-cols-[1fr_280px] gap-6">
        <Card
          title="Recent Products"
          subtitle="Latest products in inventory"
          action={
            <Button variant="ghost" size="sm" as={Link} to="/admin/products">
              View All
            </Button>
          }
        >
          {products.length === 0 ? (
            <EmptyState
              title="No products found"
              description="Add your first product to get started."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th className="text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {products.slice(0, 5).map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div className="flex items-center gap-2">
                          {p.image ? (
                            <img src={p.image} alt={p.name} className="admin-table-img" />
                          ) : (
                            <div className="admin-table-img flex items-center justify-center bg-muted/10 text-muted text-xs">
                              No Image
                            </div>
                          )}
                          <div>
                            <strong className="text-sm text-text">{truncateText(p.name, 30)}</strong>
                          </div>
                        </div>
                      </td>
                      <td className="text-xs text-muted">{p.SKU || '-'}</td>
                      <td className="font-medium">{formatPrice(p.price)}</td>
                      <td>
                        <span className={p.stock === 0 ? 'text-danger' : (p.stock < 5 ? 'text-warning' : 'text-text')}>
                          {p.stock === 0 ? 'Out of stock' : `${p.stock} units`}
                        </span>
                      </td>
                      <td className="text-right">
                        <Badge variant={p.status === 'Active' ? 'success' : 'warning'}>
                          {p.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* System Checkup */}
        <Card title="System Checkup" subtitle="Current status overview">
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-text flex items-center gap-2">
                <CheckCircle size={12} className="text-success" />
                Authentication
              </span>
              <Badge variant="success">Active</Badge>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-text flex items-center gap-2">
                <CheckCircle size={12} className="text-success" />
                Storage (localStorage)
              </span>
              <Badge variant="success">OK</Badge>
            </div>
            {pendingOrders > 0 && (
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-text flex items-center gap-2">
                  <Clock size={12} className="text-warning" />
                  Pending orders
                </span>
                <Badge variant="warning">{pendingOrders}</Badge>
              </div>
            )}
            <div className="pt-3 mt-3 border-t border-border">
              <Button variant="ghost" size="sm" className="w-full">
                Run full diagnostics
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
