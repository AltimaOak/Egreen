import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';
import { useAdmin } from '../../contexts/AdminContext';
import { Search, Clock, Eye, Package, User } from 'lucide-react';
import { formatPrice, formatDate } from '../../utils/helpers';
import { TableSkeleton } from '../../components/admin/Skeleton';
import {
  Card, Table, Badge, Select, Input, Button, Drawer, EmptyState, AdminPageHeader, Tabs,
} from '../../components/admin/UI';

const STATUS_TABS = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const statusVariant = s =>
  s === 'Completed' || s === 'Delivered' ? 'success' :
  s === 'Processing' || s === 'Shipped'  ? 'info'    :
  s === 'Cancelled'                      ? 'danger'  : 'warning';

const Orders = () => {
  const { showToast } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [detailOrder, setDetailOrder] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setOrders(await orderService.getOrders());
    } catch { showToast('Failed to load orders.', 'error'); }
    finally  { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (id, nextStatus) => {
    showToast('Updating…', 'loading');
    const ok = await orderService.updateOrderStatus(id, nextStatus);
    if (ok) {
      showToast('Status updated', 'success');
      fetchOrders();
      if (detailOrder?.id === id) setDetailOrder(p => ({ ...p, status: nextStatus }));
    } else showToast('Failed to update status', 'error');
  };

  const count = (s) => s === 'All' ? orders.length : orders.filter(o => o.status === s).length;

  const filtered = orders
    .filter(o => {
      const q = searchTerm.toLowerCase();
      return (!q || o.customerName.toLowerCase().includes(q) || String(o.id).toLowerCase().includes(q) || (o.customerEmail || '').toLowerCase().includes(q))
          && (activeTab === 'All' || o.status === activeTab);
    })
    .sort((a, b) => {
      let va = a[sortBy], vb = b[sortBy];
      if (sortBy === 'amount') { va = +va || 0; vb = +vb || 0; }
      else if (sortBy === 'date') { va = new Date(va).getTime(); vb = new Date(vb).getTime(); }
      else { va = (va || '').toString().toLowerCase(); vb = (vb || '').toString().toLowerCase(); }
      return va < vb ? (sortOrder === 'asc' ? -1 : 1) : va > vb ? (sortOrder === 'asc' ? 1 : -1) : 0;
    });

  const columns = [
    {
      key: 'select', label: (
        <input type="checkbox" style={{ width: 15, height: 15, accentColor: 'var(--color-primary)', cursor: 'pointer' }}
          checked={filtered.length > 0 && selectedOrders.length === filtered.length}
          onChange={e => setSelectedOrders(e.target.checked ? filtered.map(o => o.id) : [])}
        />
      ),
      render: o => (
        <input type="checkbox" style={{ width: 15, height: 15, accentColor: 'var(--color-primary)', cursor: 'pointer' }}
          checked={selectedOrders.includes(o.id)}
          onChange={() => setSelectedOrders(p => p.includes(o.id) ? p.filter(x => x !== o.id) : [...p, o.id])}
        />
      ),
    },
    {
      key: 'id', label: 'Order ID', sortable: true,
      render: o => (
        <button type="button" onClick={() => { setDetailOrder(o); setDrawerOpen(true); }}
          style={{ fontWeight: 700, color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', padding: 0 }}>
          #{o.id}
        </button>
      ),
    },
    {
      key: 'customerName', label: 'Customer', sortable: true,
      render: o => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.78rem', flexShrink: 0 }}>
            {o.customerName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-text)' }}>{o.customerName}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)' }}>{o.customerEmail}</div>
          </div>
        </div>
      ),
    },
    { key: 'items', label: 'Items', sortable: true, render: o => `${o.items} items` },
    { key: 'amount', label: 'Amount', sortable: true, render: o => <span style={{ fontWeight: 700, color: 'var(--color-text)' }}>{formatPrice(o.amount)}</span> },
    {
      key: 'status', label: 'Status', sortable: true,
      render: o => <Badge variant={statusVariant(o.status)}>{o.status}</Badge>,
    },
    {
      key: 'date', label: 'Date', sortable: true,
      render: o => (
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.78rem', color: 'var(--color-muted)' }}>
          <Clock size={12} /> {formatDate(o.date)}
        </span>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <AdminPageHeader title="Orders" subtitle="Monitor and process all customer orders." />

      {/* Status tabs with counts */}
      <div className="admin-tabs">
        {STATUS_TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`admin-tab-btn${activeTab === tab ? ' active' : ''}`}>
            {tab}
            <span style={{
              marginLeft: 4, padding: '1px 6px', borderRadius: 99,
              fontSize: '0.68rem', fontWeight: 700,
              background: activeTab === tab ? 'var(--color-primary)' : 'rgba(107,114,128,0.12)',
              color: activeTab === tab ? '#fff' : 'var(--color-muted)',
            }}>
              {count(tab)}
            </span>
          </button>
        ))}
      </div>

      <Card>
        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
          <Input
            placeholder="Search orders, customers…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            icon={<Search />}
            className=""
          />
          <Select
            value={`${sortBy}-${sortOrder}`}
            onChange={e => { const [f, o] = e.target.value.split('-'); setSortBy(f); setSortOrder(o); }}
            options={[
              { value: 'date-desc',   label: 'Newest First' },
              { value: 'date-asc',    label: 'Oldest First' },
              { value: 'amount-desc', label: 'Amount: High → Low' },
              { value: 'amount-asc',  label: 'Amount: Low → High' },
            ]}
            className=""
          />
        </div>

        {loading ? (
          <TableSkeleton rows={6} />
        ) : filtered.length === 0 ? (
          <EmptyState icon={<Clock size={28} />} title="No orders found" description="Try adjusting your search or filter." />
        ) : (
          <Table
            columns={columns}
            data={filtered}
            sortKey={sortBy}
            sortOrder={sortOrder}
            onSort={(k, o) => { setSortBy(k); setSortOrder(o); }}
            actions={o => (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
                <Select
                  value={o.status}
                  onChange={e => handleStatusChange(o.id, e.target.value)}
                  options={['Pending','Processing','Shipped','Delivered','Completed','Cancelled'].map(s => ({ value: s, label: s }))}
                  className=""
                />
                <Button variant="ghost" size="sm" title="View details" onClick={() => { setDetailOrder(o); setDrawerOpen(true); }}>
                  <Eye size={14} />
                </Button>
              </div>
            )}
          />
        )}
      </Card>

      {/* Detail Drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={detailOrder ? `Order #${detailOrder.id}` : 'Order Details'}
        size="md"
      >
        {detailOrder && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Summary */}
            <div style={{ padding: 16, background: 'var(--color-background)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-card)', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Status</span>
                <Badge variant={statusVariant(detailOrder.status)}>{detailOrder.status}</Badge>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--color-muted)' }}>Total</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-primary)' }}>{formatPrice(detailOrder.amount)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>Date</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--color-text)' }}>{formatDate(detailOrder.date)}</span>
              </div>
            </div>

            {/* Customer */}
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <User size={13} color="var(--color-primary)" /> Customer Info
              </div>
              <div style={{ padding: '12px 14px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-card)', fontSize: '0.85rem' }}>
                <div style={{ fontWeight: 700, color: 'var(--color-text)', marginBottom: 3 }}>{detailOrder.customerName}</div>
                <div style={{ color: 'var(--color-muted)', fontSize: '0.78rem' }}>{detailOrder.customerEmail}</div>
              </div>
            </div>

            {/* Items */}
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <Package size={13} color="var(--color-primary)" /> Items ({detailOrder.items})
              </div>
              <div style={{ padding: '12px 14px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-card)', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid var(--color-border)', marginBottom: 8 }}>
                  <span style={{ color: 'var(--color-text)' }}>Order Package</span>
                  <span style={{ fontWeight: 700 }}>{formatPrice(detailOrder.amount)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                  <span>Shipping</span>
                  <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>FREE (B2B)</span>
                </div>
              </div>
            </div>

            {/* Status update */}
            <div style={{ paddingTop: 16, borderTop: '1px solid var(--color-border)' }}>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>
                Update Status
              </label>
              <Select
                value={detailOrder.status}
                onChange={e => handleStatusChange(detailOrder.id, e.target.value)}
                options={['Pending','Processing','Shipped','Delivered','Completed','Cancelled'].map(s => ({ value: s, label: s }))}
              />
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default Orders;
