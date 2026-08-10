import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, StatCard, Badge, Button, EmptyState, AdminPageHeader, SkeletonCard, SkeletonTable } from '../../components/admin/UI';
import { productService } from '../../services/productService';
import { orderService } from '../../services/orderService';
import { customerService } from '../../services/customerService';
import { authService } from '../../services/authService';
import { activityService } from '../../services/activityService';
import { storageService } from '../../services/storageService';
import { DollarSign, ShoppingCart, ShoppingBag, Users, Clock, CheckCircle, FileText } from 'lucide-react';
import { formatPrice, formatDate, truncateText } from '../../utils/helpers';
import { ResponsiveContainer, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Area } from 'recharts';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats]     = useState({ revenue: 0, orders: 0, products: 0, customers: 0 });
  const [orders, setOrders]   = useState([]);
  const [products, setProducts] = useState([]);
  const [trends, setTrends]   = useState({ revenue: 0, orders: 0, products: 0, customers: 0 });
  const [activities, setActivities] = useState([]);
  const [pendingChanges, setPendingChanges] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const pending = storageService.load('pending_changes_count', 0);
    const updated = storageService.load('last_updated_time', null);
    setPendingChanges(pending);
    setLastUpdated(updated);

    const loadData = async () => {
      try {
        const [prodList, ordStats, custStats, custList, ordList, actList] = await Promise.all([
          productService.getProducts(),
          orderService.getOrderStats(),
          customerService.getCustomerStats(),
          customerService.getCustomers(),
          orderService.getOrders(),
          activityService.getActivities(),
        ]);
        setStats({ revenue: ordStats.totalRevenue, orders: ordStats.ordersCount, products: prodList.length, customers: custStats.totalCustomers });
        setOrders(ordList);
        setProducts(prodList);
        setActivities(actList);
        calculateTrends(ordList, prodList, custList);
      } catch (e) {
        console.error('Dashboard data error', e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const calculateTrends = (ordList, prodList, custList) => {
    const now = new Date();
    const d = (days) => new Date(now.getTime() - days * 86400000);
    const rev  = (list, from, to) => list.filter(o => { const t = new Date(o.date); return t >= from && (!to || t < to); }).reduce((s, o) => s + (o.amount || 0), 0);
    const pct  = (c, p) => p > 0 ? Math.round(((c - p) / p) * 100 * 10) / 10 : (c > 0 ? 100 : 0);
    setTrends({
      revenue:   pct(rev(ordList, d(7)), rev(ordList, d(14), d(7))),
      orders:    pct(ordList.filter(o => new Date(o.date) >= d(7)).length, ordList.filter(o => new Date(o.date) >= d(14) && new Date(o.date) < d(7)).length),
      products:  pct(prodList.filter(p => new Date(p.createdDate) >= d(30)).length, prodList.filter(p => new Date(p.createdDate) >= d(60) && new Date(p.createdDate) < d(30)).length),
      customers: pct(custList.filter(c => new Date(c.joinedDate) >= d(30)).length, custList.filter(c => new Date(c.joinedDate) >= d(60) && new Date(c.joinedDate) < d(30)).length),
    });
  };

  const chartData = useMemo(() => {
    if (!orders.length) return [];
    const byDay = {};
    [...orders].sort((a, b) => new Date(a.date) - new Date(b.date)).forEach(o => {
      const day = new Date(o.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
      byDay[day] = (byDay[day] || 0) + o.amount;
    });
    return Object.entries(byDay).map(([day, revenue]) => ({ day, revenue }));
  }, [orders]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <SkeletonCard count={4} />
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
          <div><SkeletonTable rows={5} /></div>
          <div><SkeletonTable rows={5} cols={2} /></div>
        </div>
      </div>
    );
  }

  const pendingOrders = orders.filter(o => o.status === 'Pending' || o.status === 'Processing').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <AdminPageHeader
        title="Dashboard"
        subtitle="Welcome back — here's what's happening in your store."
        action={
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <Link to="/admin/products?action=add" style={{ textDecoration: 'none' }}>
              <Button variant="primary" size="md" icon={<ShoppingBag size={16} />}>
                + Add Product
              </Button>
            </Link>
            <Link to="/admin/orders" style={{ textDecoration: 'none' }}>
              <Button variant="secondary" size="md" icon={<ShoppingCart size={16} />}>
                Manage Orders
              </Button>
            </Link>
          </div>
        }
      />

      {/* Alert banner */}
      {pendingChanges > 0 && (
        <div style={{ padding: '12px 16px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 'var(--radius-card)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Clock size={16} color="var(--color-warning)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)', flex: 1 }}>
            {pendingChanges} pending {pendingChanges === 1 ? 'change' : 'changes'} awaiting sync
          </span>
          <Button variant="ghost" size="sm" onClick={async () => { await activityService.clearPendingChanges(); setPendingChanges(0); }}>
            <CheckCircle size={13} /> Mark synced
          </Button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="admin-stats-grid">
        <StatCard
          title="Total Revenue"
          value={formatPrice(stats.revenue)}
          icon={<DollarSign size={20} />}
          iconBg="rgba(37,99,235,0.12)" iconColor="var(--color-primary)"
          trend={trends.revenue} trendUp={trends.revenue >= 0}
          subtitle="vs last 7 days"
        />
        <StatCard
          title="Total Orders"
          value={stats.orders.toLocaleString()}
          icon={<ShoppingCart size={20} />}
          iconBg="rgba(59,130,246,0.12)" iconColor="var(--color-blue)"
          trend={trends.orders} trendUp={trends.orders >= 0}
          subtitle="vs last 7 days"
        />
        <StatCard
          title="Products"
          value={stats.products.toString()}
          icon={<ShoppingBag size={20} />}
          iconBg="rgba(139,92,246,0.12)" iconColor="var(--color-purple)"
          trend={trends.products} trendUp={trends.products >= 0}
          subtitle="vs last 30 days"
        />
        <StatCard
          title="Customers"
          value={stats.customers.toLocaleString()}
          icon={<Users size={20} />}
          iconBg="rgba(99,102,241,0.12)" iconColor="var(--color-indigo)"
          trend={trends.customers} trendUp={trends.customers >= 0}
          subtitle="vs last 30 days"
        />
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, minWidth: 0 }}>
          {/* Chart */}
          <Card
            title="Revenue Overview"
            subtitle="Daily revenue trend from order data"
            action={<Badge variant="success">Live</Badge>}
          >
            <div style={{ height: 240, marginTop: 8 }}>
              {chartData.length === 0 ? (
                <EmptyState icon={<ShoppingCart size={24} />} title="No revenue data yet" description="Revenue will appear once orders are placed." />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="var(--color-primary)" stopOpacity={0.22} />
                        <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--color-muted)' }} axisLine={false} tickLine={false} />
                    <YAxis
                      tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`}
                      tick={{ fontSize: 11, fill: 'var(--color-muted)' }}
                      axisLine={false} tickLine={false}
                    />
                    <Tooltip
                      formatter={v => [formatPrice(v), 'Revenue']}
                      contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 12 }}
                      labelStyle={{ color: 'var(--color-muted)', fontSize: 11 }}
                      itemStyle={{ color: 'var(--color-text)', fontSize: 13 }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={2.5} fill="url(#revGrad)" dot={{ r: 3.5, fill: 'var(--color-primary)', strokeWidth: 0 }} activeDot={{ r: 5 }} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>

          {/* Recent Products */}
          <Card
            title="Recent Products"
            subtitle="Latest additions to the catalog"
            action={<Link to="/admin/products" style={{ fontSize: '0.78rem', color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}>View all →</Link>}
          >
            {products.length === 0 ? (
              <EmptyState icon={<ShoppingBag size={24} />} title="No products" description="Add your first product." />
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>SKU</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th style={{ textAlign: 'right' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.slice(0, 5).map(p => (
                      <tr key={p.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            {p.image
                              ? <img src={p.image} alt={p.name} className="admin-table-img" />
                              : <div className="admin-table-img" style={{ color: 'var(--color-muted)', fontSize: 11, background: 'var(--color-background)' }}>N/A</div>
                            }
                            <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{truncateText(p.name, 28)}</span>
                          </div>
                        </td>
                        <td style={{ color: 'var(--color-muted)', fontSize: '0.78rem' }}>{p.SKU || '—'}</td>
                        <td style={{ fontWeight: 700 }}>{formatPrice(p.price)}</td>
                        <td style={{ color: p.stock === 0 ? 'var(--color-danger)' : p.stock < 5 ? 'var(--color-warning)' : 'var(--color-text)', fontWeight: 600, fontSize: '0.82rem' }}>
                          {p.stock === 0 ? 'Out of stock' : `${p.stock} units`}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <Badge variant={p.status === 'Active' ? 'success' : 'warning'}>{p.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, minWidth: 0 }}>
          {/* Recent Activity */}
          <Card title="Recent Activity" subtitle="Latest admin actions">
            {activities.length === 0 ? (
              <EmptyState icon={<FileText size={22} />} title="No activity" description="Activity logs appear here." />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0, maxHeight: 300, overflowY: 'auto' }}>
                {activities.slice(0, 8).map((act, i) => (
                  <div key={act.id ?? i} style={{ display: 'flex', gap: 10, paddingBottom: 12, paddingTop: i > 0 ? 12 : 0, borderBottom: i < 7 ? '1px solid var(--color-border)' : 'none' }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                      <CheckCircle size={14} color="var(--color-primary)" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: '0.83rem', fontWeight: 600, color: 'var(--color-text)' }}>{act.action}</p>
                      <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: 'var(--color-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{act.details}</p>
                      <p style={{ margin: '3px 0 0', fontSize: '0.7rem', color: 'var(--color-subtle)' }}>{formatDate(act.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* System Checkup */}
          <Card title="System Status" subtitle="Health overview">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[
                {
                  label: 'Authentication',
                  ok: authService.isAuthenticated(),
                  okLabel: 'Active', failLabel: 'Inactive',
                },
                {
                  label: 'LocalStorage',
                  ok: typeof localStorage !== 'undefined',
                  okLabel: 'Available', failLabel: 'Unavailable',
                },
                {
                  label: 'Pending Orders',
                  ok: pendingOrders === 0,
                  okLabel: 'None', failLabel: `${pendingOrders} pending`,
                  failVariant: 'warning',
                },
              ].map(({ label, ok, okLabel, failLabel, failVariant = 'danger' }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0', borderBottom: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '0.83rem', fontWeight: 600, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CheckCircle size={14} color={ok ? 'var(--color-success)' : 'var(--color-danger)'} />
                    {label}
                  </span>
                  <Badge variant={ok ? 'success' : failVariant}>{ok ? okLabel : failLabel}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
