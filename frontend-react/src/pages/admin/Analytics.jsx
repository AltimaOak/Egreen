// Analytics & Performance Visualizer Component
import React, { useState } from 'react';
import { BarChart3, TrendingUp, DollarSign, RefreshCw, ShoppingCart, Percent } from 'lucide-react';
import { formatPrice } from '../../utils/helpers';

const Analytics = () => {
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <div style={{ textAlign: 'left' }}>
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Analytics</h1>
          <p className="admin-page-subtitle">Track revenue trends, product insights, and customer activity.</p>
        </div>
      </div>
      
      {/* Analytics Tabs */}
      <div className="admin-editor-tabs" style={{ marginBottom: '24px' }}>
        {['Overview', 'Sales Analysis', 'Products Insights', 'Customers Registry'].map(tab => (
          <button 
            key={tab}
            className={`admin-editor-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main performance trend and share grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6 mb-6">
        
        {/* Line Chart */}
        <div className="admin-card" style={{ marginBottom: 0 }}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="admin-modal-title">Revenue Trend</h3>
            <span style={{ fontSize: '0.85rem', color: '#10B981', fontWeight: 600 }}>+12.5% vs last month</span>
          </div>

          <div style={{ position: 'relative', width: '100%', padding: '10px 0' }}>
            <svg viewBox="0 0 500 200" className="admin-chart-svg" style={{ overflow: 'visible' }}>
              <defs>
                <linearGradient id="revenue-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              <line x1="0" y1="40" x2="500" y2="40" className="chart-grid-line" stroke="#E2E8F0" />
              <line x1="0" y1="80" x2="500" y2="80" className="chart-grid-line" stroke="#E2E8F0" />
              <line x1="0" y1="120" x2="500" y2="120" className="chart-grid-line" stroke="#E2E8F0" />
              <line x1="0" y1="160" x2="500" y2="160" className="chart-grid-line" stroke="#E2E8F0" />

              <path d="M 0 200 L 0 140 C 80 150, 160 90, 240 100 C 320 60, 400 80, 500 20 L 500 200 Z" fill="url(#revenue-gradient)" />
              <path d="M 0 140 C 80 150, 160 90, 240 100 C 320 60, 400 80, 500 20" stroke="#10B981" strokeWidth="3" fill="none" />

              <circle cx="0" cy="140" r="4" className="chart-point" />
              <circle cx="160" cy="90" r="4" className="chart-point" />
              <circle cx="320" cy="60" r="4" className="chart-point" />
              <circle cx="500" cy="20" r="4" className="chart-point" />
            </svg>
            <div className="flex justify-between mt-2" style={{ fontSize: '0.75rem', color: 'var(--admin-text-body)' }}>
              <span>May 1</span>
              <span>May 8</span>
              <span>May 16</span>
              <span>May 24</span>
              <span>May 30</span>
            </div>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="admin-card" style={{ marginBottom: 0, display: 'flex', flexDirection: 'column' }}>
          <h3 className="admin-modal-title" style={{ marginBottom: '16px' }}>Sales by Brand</h3>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, position: 'relative', minHeight: '180px' }}>
            {/* SVG Donut Chart */}
            <svg width="150" height="150" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
              {/* Dell - 40% (dasharray: 2 * pi * r = 2 * 3.14 * 30 = 188.4) */}
              <circle cx="50" cy="50" r="30" fill="none" stroke="#1D4ED8" strokeWidth="12" strokeDasharray="188.4" strokeDashoffset="0" />
              {/* Lenovo - 30% */}
              <circle cx="50" cy="50" r="30" fill="none" stroke="#EF4444" strokeWidth="12" strokeDasharray="188.4" strokeDashoffset="-75.3" />
              {/* HP - 20% */}
              <circle cx="50" cy="50" r="30" fill="none" stroke="#10B981" strokeWidth="12" strokeDasharray="188.4" strokeDashoffset="-131.8" />
              {/* Acer - 10% */}
              <circle cx="50" cy="50" r="30" fill="none" stroke="#F59E0B" strokeWidth="12" strokeDasharray="188.4" strokeDashoffset="-169.5" />
            </svg>
            <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyBetween: 'center' }}>
              <span style={{ fontSize: '1.15rem', fontWeight: 'bold', color: 'var(--admin-text-heading)' }}>₹12.4L</span>
              <span style={{ fontSize: '0.68rem', color: 'var(--admin-text-body)' }}>Total Revenue</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.75rem', marginTop: '16px' }}>
            <div className="flex items-center gap-1"><span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#1D4ED8' }}></span> Dell (40%)</div>
            <div className="flex items-center gap-1"><span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#EF4444' }}></span> Lenovo (30%)</div>
            <div className="flex items-center gap-1"><span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }}></span> HP (20%)</div>
            <div className="flex items-center gap-1"><span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F59E0B' }}></span> Acer (10%)</div>
          </div>
        </div>
      </div>

      {/* Grid of details statistic boxes at bottom */}
      <div className="admin-stats-grid" style={{ marginBottom: 0 }}>
        {/* Selling category */}
        <div className="admin-stat-card">
          <span className="admin-stat-label">Top Selling Category</span>
          <span className="admin-stat-val" style={{ fontSize: '1.2rem', margin: '4px 0' }}>Laptops</span>
          <span style={{ fontSize: '0.78rem' }}>1,246 units sold <span className="trend-up" style={{ fontWeight: 600 }}>+16.2%</span></span>
        </div>

        {/* Avg Order */}
        <div className="admin-stat-card">
          <span className="admin-stat-label">Avg. Order Value</span>
          <span className="admin-stat-val" style={{ fontSize: '1.2rem', margin: '4px 0' }}>₹5,560</span>
          <span style={{ fontSize: '0.78rem' }}>Per conversion <span className="trend-up" style={{ fontWeight: 600 }}>+6.4%</span></span>
        </div>

        {/* Conversion rate */}
        <div className="admin-stat-card">
          <span className="admin-stat-label">Conversion Rate</span>
          <span className="admin-stat-val" style={{ fontSize: '1.2rem', margin: '4px 0' }}>3.24%</span>
          <span style={{ fontSize: '0.78rem' }}>Session checkouts <span className="trend-up" style={{ fontWeight: 600 }}>+2.1%</span></span>
        </div>

        {/* Customer growth */}
        <div className="admin-stat-card">
          <span className="admin-stat-label">Customer Growth</span>
          <span className="admin-stat-val" style={{ fontSize: '1.2rem', margin: '4px 0' }}>+348 clients</span>
          <span style={{ fontSize: '0.78rem' }}>This month <span className="trend-up" style={{ fontWeight: 600 }}>+12.6%</span></span>
        </div>
      </div>

    </div>
  );
};

export default Analytics;
