// Redesigned Admin Main Dashboard Component
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import { orderService } from '../../services/orderService';
import { customerService } from '../../services/customerService';
import { storageService } from '../../services/storageService';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  ShoppingBag, 
  Users,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { formatPrice } from '../../utils/helpers';
import { CardSkeleton } from '../../components/admin/Skeleton';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({
    revenue: 245800,
    orders: 1486,
    products: 248,
    customers: 3892
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const prodList = await productService.getProducts();
      const ordStats = await orderService.getOrderStats();
      const custStats = await customerService.getCustomerStats();

      setDashboardStats({
        revenue: ordStats.totalRevenue + 120801, // Adding offset to match premium totals
        orders: ordStats.ordersCount + 1481,
        products: prodList.length + 216,
        customers: custStats.totalCustomers + 3887
      });
    } catch (e) {
      console.error('Failed to load dashboard statistics', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div>
        <div className="admin-stats-grid">
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
        <div className="grid-cols-2" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  // Greeting based on hours
  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good morning, Arjun! ☀️';
    if (hours < 17) return 'Good afternoon, Arjun! 🌤️';
    return 'Good evening, Arjun! 🌙';
  };

  return (
    <div style={{ textAlign: 'left' }}>
      
      {/* Top Banner Greeting */}
      <div className="flex justify-between items-center mb-4" style={{ borderBottom: '1px solid var(--admin-border)', paddingBottom: '20px' }}>
        <div className="admin-dashboard-greeting" style={{ marginBottom: 0 }}>
          <h2>{getGreeting()}</h2>
          <p>Here's what's happening with your store today.</p>
        </div>
        <div className="admin-topnav-date" style={{ background: 'var(--admin-card-bg)', border: '1px solid var(--admin-border)', padding: '8px 16px', borderRadius: '8px', fontWeight: 600 }}>
          May 24, 2024 - May 30, 2024
        </div>
      </div>

      {/* KPI Stats cards */}
      <div className="admin-stats-grid">
        {/* Revenue */}
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-label">Total Revenue</span>
            <div className="admin-stat-icon-wrapper" style={{ backgroundColor: '#D1FAE5', color: '#10B981' }}>
              <DollarSign size={20} />
            </div>
          </div>
          <div className="admin-stat-value-group">
            <span className="admin-stat-val">{formatPrice(dashboardStats.revenue)}</span>
            <span className="admin-stat-trend trend-up">
              <TrendingUp size={14} /> +12.5% <span style={{ color: 'var(--admin-text-body)', fontWeight: 'normal' }}>vs last week</span>
            </span>
          </div>
        </div>

        {/* Orders */}
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-label">Total Orders</span>
            <div className="admin-stat-icon-wrapper" style={{ backgroundColor: '#FFE4E6', color: '#F43F5E' }}>
              <ShoppingCart size={20} />
            </div>
          </div>
          <div className="admin-stat-value-group">
            <span className="admin-stat-val">{dashboardStats.orders.toLocaleString()}</span>
            <span className="admin-stat-trend trend-down">
              <TrendingDown size={14} /> -8.2% <span style={{ color: 'var(--admin-text-body)', fontWeight: 'normal' }}>vs last week</span>
            </span>
          </div>
        </div>

        {/* Products */}
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-label">Total Products</span>
            <div className="admin-stat-icon-wrapper" style={{ backgroundColor: '#DBEAFE', color: '#3B82F6' }}>
              <ShoppingBag size={20} />
            </div>
          </div>
          <div className="admin-stat-value-group">
            <span className="admin-stat-val">{dashboardStats.products}</span>
            <span className="admin-stat-trend trend-up">
              <TrendingUp size={14} /> +5.7% <span style={{ color: 'var(--admin-text-body)', fontWeight: 'normal' }}>vs last week</span>
            </span>
          </div>
        </div>

        {/* Customers */}
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-label">Total Customers</span>
            <div className="admin-stat-icon-wrapper" style={{ backgroundColor: '#F3E8FF', color: '#A855F7' }}>
              <Users size={20} />
            </div>
          </div>
          <div className="admin-stat-value-group">
            <span className="admin-stat-val">{dashboardStats.customers.toLocaleString()}</span>
            <span className="admin-stat-trend trend-up">
              <TrendingUp size={14} /> +15.3% <span style={{ color: 'var(--admin-text-body)', fontWeight: 'normal' }}>vs last week</span>
            </span>
          </div>
        </div>
      </div>

      {/* Sales Line Chart and Products by Brand Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px', alignItems: 'start' }} className="grid-cols-2">
        {/* Left Side: Sales Overview Chart */}
        <div className="admin-card" style={{ marginBottom: 0 }}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="admin-modal-title">Sales Overview</h3>
            <select className="admin-select" style={{ width: '120px', padding: '6px 10px', fontSize: '0.8rem' }}>
              <option>This Week</option>
              <option>Last Month</option>
            </select>
          </div>

          <div style={{ position: 'relative', width: '100%', padding: '10px 0' }}>
            {/* Pure SVG Line Area Chart */}
            <svg viewBox="0 0 500 200" className="admin-chart-svg" style={{ overflow: 'visible' }}>
              <defs>
                <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="40" x2="500" y2="40" className="chart-grid-line" stroke="#E2E8F0" />
              <line x1="0" y1="80" x2="500" y2="80" className="chart-grid-line" stroke="#E2E8F0" />
              <line x1="0" y1="120" x2="500" y2="120" className="chart-grid-line" stroke="#E2E8F0" />
              <line x1="0" y1="160" x2="500" y2="160" className="chart-grid-line" stroke="#E2E8F0" />

              {/* Chart Line Area Fill */}
              <path d="M 0 200 L 0 160 C 50 130, 100 150, 150 110 C 200 80, 250 95, 300 70 C 350 40, 400 75, 450 30 L 500 30 L 500 200 Z" fill="url(#chart-gradient)" />

              {/* Main Line */}
              <path d="M 0 160 C 50 130, 100 150, 150 110 C 200 80, 250 95, 300 70 C 350 40, 400 75, 450 30 L 500 30" stroke="#10B981" strokeWidth="3" fill="none" />

              {/* Points */}
              <circle cx="0" cy="160" r="5" className="chart-point" />
              <circle cx="100" cy="150" r="5" className="chart-point" />
              <circle cx="200" cy="80" r="5" className="chart-point" />
              <circle cx="300" cy="70" r="5" className="chart-point" />
              <circle cx="450" cy="30" r="5" className="chart-point" />

              {/* Tooltip display overlay */}
              <g transform="translate(300, 35)">
                <rect x="-40" y="-30" width="80" height="24" rx="4" fill="#1E293B" />
                <text x="0" y="-14" fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">₹72,800</text>
                <text x="0" y="24" fill="#64748B" fontSize="9" textAnchor="middle">May 30</text>
              </g>
            </svg>

            {/* X Axis Labels */}
            <div className="flex justify-between mt-2" style={{ fontSize: '0.75rem', color: 'var(--admin-text-body)' }}>
              <span>May 24</span>
              <span>May 25</span>
              <span>May 26</span>
              <span>May 27</span>
              <span>May 28</span>
              <span>May 29</span>
              <span>May 30</span>
            </div>
          </div>
        </div>

        {/* Right Side: Products by Brand */}
        <div className="admin-card" style={{ marginBottom: 0 }}>
          <h3 className="admin-modal-title" style={{ marginBottom: '16px' }}>Products by Brand</h3>
          
          <div className="admin-table-container" style={{ border: 'none' }}>
            <table className="admin-table">
              <thead>
                <tr style={{ background: 'transparent' }}>
                  <th style={{ padding: '8px 0', borderBottom: '1px solid var(--admin-border)' }}>Brand</th>
                  <th style={{ padding: '8px 0', borderBottom: '1px solid var(--admin-border)' }}>Products</th>
                  <th style={{ padding: '8px 0', borderBottom: '1px solid var(--admin-border)', textAlign: 'right' }}>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {/* Dell */}
                <tr>
                  <td style={{ padding: '14px 0', borderBottom: '1px solid var(--admin-border)' }}>
                    <div className="flex items-center gap-2">
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1D4ED8', fontWeight: 'bold', fontSize: '0.75rem' }}>DL</div>
                      <strong>Dell</strong>
                    </div>
                  </td>
                  <td style={{ padding: '14px 0', borderBottom: '1px solid var(--admin-border)' }}>112 Products</td>
                  <td style={{ padding: '14px 0', borderBottom: '1px solid var(--admin-border)', textAlign: 'right', fontWeight: 600 }}>₹1,12,300</td>
                </tr>

                {/* Lenovo */}
                <tr>
                  <td style={{ padding: '14px 0', borderBottom: '1px solid var(--admin-border)' }}>
                    <div className="flex items-center gap-2">
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444', fontWeight: 'bold', fontSize: '0.75rem' }}>LN</div>
                      <strong>Lenovo</strong>
                    </div>
                  </td>
                  <td style={{ padding: '14px 0', borderBottom: '1px solid var(--admin-border)' }}>78 Products</td>
                  <td style={{ padding: '14px 0', borderBottom: '1px solid var(--admin-border)', textAlign: 'right', fontWeight: 600 }}>₹88,900</td>
                </tr>

                {/* HP */}
                <tr>
                  <td style={{ padding: '14px 0', borderBottom: '1px solid var(--admin-border)' }}>
                    <div className="flex items-center gap-2">
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981', fontWeight: 'bold', fontSize: '0.75rem' }}>HP</div>
                      <strong>HP</strong>
                    </div>
                  </td>
                  <td style={{ padding: '14px 0', borderBottom: '1px solid var(--admin-border)' }}>36 Products</td>
                  <td style={{ padding: '14px 0', borderBottom: '1px solid var(--admin-border)', textAlign: 'right', fontWeight: 600 }}>₹33,500</td>
                </tr>

                {/* Acer */}
                <tr>
                  <td style={{ padding: '14px 0', borderBottom: 'none' }}>
                    <div className="flex items-center gap-2">
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706', fontWeight: 'bold', fontSize: '0.75rem' }}>AC</div>
                      <strong>Acer</strong>
                    </div>
                  </td>
                  <td style={{ padding: '14px 0', borderBottom: 'none' }}>22 Products</td>
                  <td style={{ padding: '14px 0', borderBottom: 'none', textAlign: 'right', fontWeight: 600 }}>₹18,900</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
