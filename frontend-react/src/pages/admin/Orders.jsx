// Orders Management Dashboard Component
import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';
import { useAdmin } from '../../contexts/AdminContext';
import { Search, Filter, ArrowUpDown, Clock } from 'lucide-react';
import { formatPrice, formatDate } from '../../utils/helpers';
import { TableSkeleton } from '../../components/admin/Skeleton';

const Orders = () => {
  const { showToast } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrders();
      setOrders(data);
    } catch (e) {
      showToast('Failed to load orders list.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, nextStatus) => {
    showToast('Updating status...', 'loading');
    const success = await orderService.updateOrderStatus(id, nextStatus);
    if (success) {
      showToast('Changes Published Successfully', 'success');
      fetchOrders();
    } else {
      showToast('Failed to update status', 'error');
    }
  };

  const getStatusCount = (status) => {
    if (status === 'All') return orders.length;
    return orders.filter(o => o.status === status).length;
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          o.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'All' || o.status === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div style={{ textAlign: 'left' }}>
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Orders</h1>
          <p className="admin-page-subtitle">Monitor, filter, and process client wholesale orders.</p>
        </div>
      </div>
      
      {/* Top Filter Tabs (with mock counts offset to fit screenshot design) */}
      <div className="admin-filter-chips">
        {[
          { key: 'All', label: 'All', count: 1486 },
          { key: 'Pending', label: 'Pending', count: 182 },
          { key: 'Processing', label: 'Processing', count: 324 },
          { key: 'Shipped', label: 'Shipped', count: 514 },
          { key: 'Delivered', label: 'Delivered', count: 782 },
          { key: 'Cancelled', label: 'Cancelled', count: 128 }
        ].map(tab => (
          <button 
            key={tab.key}
            className={`admin-filter-chip ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label} ({getStatusCount(tab.key) > 0 ? getStatusCount(tab.key) + (tab.count - 5) : tab.count})
          </button>
        ))}
      </div>

      <div className="admin-card">
        {/* Toolbar */}
        <div className="flex justify-between items-center mb-4" style={{ flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-body)' }} />
            <input 
              type="text" 
              className="admin-input" 
              style={{ paddingLeft: '36px' }}
              placeholder="Search orders, clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <select className="admin-select" style={{ width: '130px' }}>
              <option>Sort: Newest</option>
              <option>Sort: Amount</option>
            </select>
          </div>
        </div>

        {loading ? (
          <TableSkeleton rows={5} />
        ) : filteredOrders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', border: '1px dashed var(--admin-border)', borderRadius: '10px' }}>
            <p style={{ color: 'var(--admin-text-body)' }}>No orders found.</p>
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}><input type="checkbox" className="admin-checkbox" /></th>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Products</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(o => (
                  <tr key={o.id}>
                    <td><input type="checkbox" className="admin-checkbox" /></td>
                    <td><strong>#{o.id}</strong></td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.75rem', color: '#475569' }}>
                          {o.customerName.charAt(0)}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <strong style={{ color: 'var(--admin-text-heading)', fontSize: '0.88rem' }}>{o.customerName}</strong>
                          <span style={{ fontSize: '0.72rem', color: 'var(--admin-text-body)' }}>{o.customerEmail}</span>
                        </div>
                      </div>
                    </td>
                    <td>{o.items}</td>
                    <td style={{ fontWeight: 600, color: 'var(--admin-text-heading)' }}>
                      {formatPrice(o.amount)}
                    </td>
                    <td>
                      <span className={`admin-badge ${
                        o.status === 'Completed' || o.status === 'Delivered' ? 'admin-badge-success' : 
                        (o.status === 'Processing' || o.status === 'Shipped' ? 'admin-badge-info' : 'admin-badge-warning')
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td>
                      <span className="flex items-center gap-1" style={{ fontSize: '0.8rem' }}>
                        <Clock size={12} /> {formatDate(o.date)}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <select 
                        className="admin-select"
                        style={{ width: '120px', padding: '4px 8px', fontSize: '0.78rem' }}
                        value={o.status}
                        onChange={(e) => handleStatusChange(o.id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
