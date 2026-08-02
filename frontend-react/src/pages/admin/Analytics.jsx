import React, { useState, useEffect, useMemo } from 'react';
import { orderService } from '../../services/orderService';
import { customerService } from '../../services/customerService';
import { productService } from '../../services/productService';
import { CardSkeleton } from '../../components/admin/Skeleton';
import { formatPrice } from '../../utils/helpers';
import { Card, StatCard, Tabs, Badge, AdminPageHeader } from '../../components/admin/UI';
import MagicBento from '../../components/admin/MagicBento';
import { DollarSign, ShoppingCart, TrendingUp, Users, Sparkles } from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

const COLORS = ['#10B981','#3B82F6','#8B5CF6','#F59E0B','#EF4444','#6366F1'];

const Analytics = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    revenueTrend: 0, newClients: 0, ordersCount: 0,
    totalRevenue: 0, avgOrderValue: 0, conversionRate: 0,
    topCategory: '', categoryUnitsSold: 0, brandRevenue: {}, chartPoints: [],
  });

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [orders, customers, products] = await Promise.all([
          orderService.getOrders(),
          customerService.getCustomers(),
          productService.getProducts(),
        ]);

        const now = new Date();
        const d30 = new Date(now - 30 * 86400000);
        const d60 = new Date(now - 60 * 86400000);

        const sum  = list => list.reduce((s, o) => s + (o.amount || 0), 0);
        const rev  = (list, from, to) => sum(list.filter(o => { const t = new Date(o.date); return t >= from && (!to || t < to); }));
        const tm   = rev(orders, d30);
        const lm   = rev(orders, d60, d30);
        const revT = lm > 0 ? Math.round(((tm - lm) / lm) * 100 * 10) / 10 : (tm > 0 ? 100 : 0);

        const totalRevenue    = sum(orders.filter(o => o.status !== 'Cancelled'));
        const avgOrderValue   = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;
        const completed       = orders.filter(o => ['Completed','Delivered'].includes(o.status)).length;
        const conversionRate  = orders.length > 0 ? Math.round((completed / orders.length) * 100 * 10) / 10 : 0;
        const newClients      = customers.filter(c => { const j = new Date(c.joinedDate); return !isNaN(j) && j >= d30; }).length;

        // Chart
        const dayMap = {};
        [...orders].sort((a, b) => new Date(a.date) - new Date(b.date)).forEach(o => {
          const d = new Date(o.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
          dayMap[d] = (dayMap[d] || 0) + (o.amount || 0);
        });
        const chartPoints = Object.entries(dayMap).map(([day, revenue]) => ({ day, revenue }));

        // Brand map
        const brandRevenue = {};
        orders.forEach(o => { const b = o.brand || 'Other'; brandRevenue[b] = (brandRevenue[b] || 0) + (o.amount || 0); });

        // Top category
        const catMap = {};
        products.forEach(p => { const c = p.category || 'Other'; catMap[c] = (catMap[c] || 0) + (p.stock || 0); });
        let topCategory = '', categoryUnitsSold = 0;
        Object.entries(catMap).forEach(([k, v]) => { if (v > categoryUnitsSold) { categoryUnitsSold = v; topCategory = k; } });

        setData({ revenueTrend: revT, newClients, ordersCount: orders.length, totalRevenue, avgOrderValue, conversionRate, topCategory: topCategory || 'N/A', categoryUnitsSold, brandRevenue, chartPoints });
      } catch (e) { console.error('Analytics error', e); }
      finally { setLoading(false); }
    })();
  }, []);

  const pieData = useMemo(() =>
    Object.entries(data.brandRevenue).map(([name, value], i) => ({ name, value, color: COLORS[i % COLORS.length] })),
    [data.brandRevenue]
  );

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="admin-stats-grid"><CardSkeleton count={4} /></div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <AdminPageHeader title="Analytics & Executive Insights" subtitle="Track revenue trends, product metrics, and interactive store intelligence." />

      <Tabs tabs={['Overview','Sales Analysis','Products Insights','Customer Registry']} activeTab={activeTab} onChange={setActiveTab} />

      {/* KPI row */}
      <div className="admin-stats-grid">
        <StatCard title="Total Revenue" value={formatPrice(data.totalRevenue)} icon={<DollarSign size={20} />} iconBg="rgba(16,185,129,0.12)" iconColor="var(--color-primary)" trend={data.revenueTrend} trendUp={data.revenueTrend >= 0} subtitle="vs last month" />
        <StatCard title="Avg. Order Value" value={formatPrice(data.avgOrderValue)} icon={<ShoppingCart size={20} />} iconBg="rgba(59,130,246,0.12)" iconColor="var(--color-blue)" subtitle="per transaction" />
        <StatCard title="Conversion Rate" value={`${data.conversionRate}%`} icon={<TrendingUp size={20} />} iconBg="rgba(99,102,241,0.12)" iconColor="var(--color-indigo)" subtitle="completed orders" />
        <StatCard title="New Clients" value={`+${data.newClients}`} icon={<Users size={20} />} iconBg="rgba(245,158,11,0.12)" iconColor="var(--color-warning)" subtitle="this month" />
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 20 }}>
        <Card title="Revenue Trend" subtitle="Daily order revenue over time">
          <div style={{ height: 250, marginTop: 12 }}>
            {data.chartPoints.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.chartPoints} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="analyticsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="var(--color-primary)" stopOpacity={0.22} />
                      <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--color-muted)' }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: 'var(--color-muted)' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={v => [formatPrice(v), 'Revenue']}
                    contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 12 }}
                    labelStyle={{ color: 'var(--color-muted)', fontSize: 11 }}
                    itemStyle={{ color: 'var(--color-text)', fontSize: 13 }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={2.5} fill="url(#analyticsGrad)" dot={{ r: 3.5, fill: 'var(--color-primary)', strokeWidth: 0 }} activeDot={{ r: 5 }} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-muted)', fontSize: '0.85rem' }}>No data available</div>
            )}
          </div>
        </Card>

        <Card title="Sales by Brand" subtitle="Revenue by manufacturer">
          <div style={{ height: 250, marginTop: 12 }}>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="45%" innerRadius={48} outerRadius={72} paddingAngle={4} dataKey="value">
                    {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip formatter={v => formatPrice(v)} contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 12 }} />
                  <Legend verticalAlign="bottom" height={36} formatter={v => <span style={{ fontSize: '0.75rem', color: 'var(--color-text)', fontWeight: 600 }}>{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-muted)', fontSize: '0.85rem' }}>No brand data</div>
            )}
          </div>
        </Card>
      </div>

      {/* Interactive Bento Feature Section */}
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={18} color="var(--color-primary)" />
            <span>Interactive Store Modules & Intelligence</span>
          </div>
        }
        subtitle="Hover and click cards to explore animated Bento insights with tilt, spotlight, and particle stars."
      >
        <div style={{ marginTop: 16 }}>
          <MagicBento
            textAutoHide={true}
            enableStars={true}
            enableSpotlight={true}
            enableBorderGlow={true}
            enableTilt={true}
            enableMagnetism={true}
            clickEffect={true}
            spotlightRadius={300}
            particleCount={14}
            glowColor="16, 185, 129"
          />
        </div>
      </Card>
    </div>
  );
};

export default Analytics;
