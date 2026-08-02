import React, { useState, useEffect } from 'react';
import { customerService } from '../../services/customerService';
import { useAdmin } from '../../contexts/AdminContext';
import { Search, Users, UserCheck, RefreshCw, Mail, Phone, Calendar, ShoppingBag, DollarSign } from 'lucide-react';
import { formatPrice } from '../../utils/helpers';
import { TableSkeleton } from '../../components/admin/Skeleton';
import {
  Card, StatCard, Table, Badge, Button, Input, Select, Drawer, EmptyState, AdminPageHeader,
} from '../../components/admin/UI';

const Customers = () => {
  const { showToast } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState({ totalCustomers: 0, newThisMonth: 0, repeatCustomers: 0, activeCustomers: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await customerService.getCustomers();
      setCustomers(data);
      const now = new Date();
      const d30 = new Date(now.getTime() - 30 * 86400000);
      setStats({
        totalCustomers:  data.length,
        newThisMonth:    data.filter(c => new Date(c.joinedDate) >= d30).length,
        repeatCustomers: data.filter(c => (c.orders || 0) > 1).length,
        activeCustomers: data.filter(c => c.status === 'Active').length,
      });
    } catch { showToast('Failed to load customers.', 'error'); }
    finally  { setLoading(false); }
  };

  useEffect(() => { fetchCustomers(); }, []);

  const filtered = customers
    .filter(c => {
      const q = searchTerm.toLowerCase();
      return !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || (c.phone || '').toLowerCase().includes(q);
    })
    .sort((a, b) => {
      let va = a[sortBy], vb = b[sortBy];
      if (['totalSpent', 'orders'].includes(sortBy)) { va = +va || 0; vb = +vb || 0; }
      else { va = (va || '').toString().toLowerCase(); vb = (vb || '').toString().toLowerCase(); }
      return va < vb ? (sortOrder === 'asc' ? -1 : 1) : va > vb ? (sortOrder === 'asc' ? 1 : -1) : 0;
    });

  const columns = [
    {
      key: 'name', label: 'Customer', sortable: true,
      render: c => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0 }}>
            {c.name.charAt(0).toUpperCase()}
          </div>
          <button type="button" onClick={() => { setSelectedCustomer(c); setDrawerOpen(true); }}
            style={{ fontWeight: 600, color: 'var(--color-text)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', textAlign: 'left' }}>
            {c.name}
          </button>
        </div>
      ),
    },
    { key: 'email', label: 'Email', sortable: true, render: c => <span style={{ color: 'var(--color-muted)', fontSize: '0.82rem' }}>{c.email}</span> },
    { key: 'orders', label: 'Orders', sortable: true, render: c => `${c.orders || 0} orders` },
    { key: 'totalSpent', label: 'Total Spent', sortable: true, render: c => <span style={{ fontWeight: 700 }}>{formatPrice(c.totalSpent || 0)}</span> },
    { key: 'status', label: 'Status', sortable: true, render: c => <Badge variant={c.status === 'Active' ? 'success' : 'danger'}>{c.status}</Badge> },
    { key: 'joinedDate', label: 'Joined', sortable: true, render: c => <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>{c.joinedDate}</span> },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <AdminPageHeader title="Customers" subtitle="View client history, transactions, and account details." />

      {/* KPI cards */}
      <div className="admin-stats-grid">
        <StatCard title="Total Customers" value={stats.totalCustomers.toLocaleString()} icon={<Users size={19} />} iconBg="rgba(107,114,128,0.1)" iconColor="var(--color-muted)" />
        <StatCard title="New This Month" value={stats.newThisMonth.toLocaleString()} icon={<UserCheck size={19} />} iconBg="rgba(59,130,246,0.12)" iconColor="var(--color-blue)" />
        <StatCard title="Repeat Customers" value={stats.repeatCustomers.toLocaleString()} icon={<RefreshCw size={19} />} iconBg="rgba(245,158,11,0.12)" iconColor="var(--color-warning)" />
        <StatCard title="Active Customers" value={stats.activeCustomers.toLocaleString()} icon={<UserCheck size={19} />} iconBg="rgba(34,197,94,0.12)" iconColor="var(--color-success)" />
      </div>

      <Card>
        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
          <Input placeholder="Search by name, email, phone…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} icon={<Search />} />
          <Select
            value={`${sortBy}-${sortOrder}`}
            onChange={e => { const [f, o] = e.target.value.split('-'); setSortBy(f); setSortOrder(o); }}
            options={[
              { value: 'name-asc',        label: 'Name A→Z' },
              { value: 'name-desc',       label: 'Name Z→A' },
              { value: 'totalSpent-desc', label: 'Spent: High → Low' },
              { value: 'totalSpent-asc',  label: 'Spent: Low → High' },
              { value: 'orders-desc',     label: 'Orders: Most First' },
            ]}
            className=""
          />
        </div>

        {loading ? (
          <TableSkeleton rows={6} />
        ) : filtered.length === 0 ? (
          <EmptyState icon={<Users size={28} />} title="No customers found" description="Try adjusting your search." />
        ) : (
          <Table
            columns={columns}
            data={filtered}
            sortKey={sortBy}
            sortOrder={sortOrder}
            onSort={(k, o) => { setSortBy(k); setSortOrder(o); }}
            actions={c => (
              <Button variant="secondary" size="sm" onClick={() => { setSelectedCustomer(c); setDrawerOpen(true); }}>
                View Profile
              </Button>
            )}
          />
        )}
      </Card>

      {/* Profile Drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={selectedCustomer ? `${selectedCustomer.name}` : 'Customer Profile'}
        size="md"
      >
        {selectedCustomer && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, background: 'var(--color-background)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-card)' }}>
              <div style={{ width: 54, height: 54, borderRadius: '50%', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.3rem', flexShrink: 0, border: '2px solid var(--color-primary)' }}>
                {selectedCustomer.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--color-text)' }}>{selectedCustomer.name}</div>
                <Badge variant={selectedCustomer.status === 'Active' ? 'success' : 'danger'} style={{ marginTop: 4 }}>{selectedCustomer.status} Account</Badge>
              </div>
            </div>

            {/* Contact */}
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Contact</div>
              <div style={{ padding: '12px 14px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-card)', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { icon: <Mail size={14} color="var(--color-primary)" />, text: selectedCustomer.email },
                  selectedCustomer.phone && { icon: <Phone size={14} color="var(--color-primary)" />, text: selectedCustomer.phone },
                  { icon: <Calendar size={14} color="var(--color-primary)" />, text: `Joined: ${selectedCustomer.joinedDate}` },
                ].filter(Boolean).map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.85rem', color: 'var(--color-text)' }}>
                    {item.icon}
                    {item.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Purchase Stats</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ padding: '14px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-card)', background: 'var(--color-primary-light)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)', marginBottom: 4 }}>Total Orders</div>
                  <div style={{ fontWeight: 800, fontSize: '1.3rem', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <ShoppingBag size={16} color="var(--color-primary)" />
                    {selectedCustomer.orders || 0}
                  </div>
                </div>
                <div style={{ padding: '14px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-card)', background: 'rgba(34,197,94,0.06)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)', marginBottom: 4 }}>Total Spent</div>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <DollarSign size={15} />
                    {formatPrice(selectedCustomer.totalSpent || 0)}
                  </div>
                </div>
              </div>
            </div>

            {/* Action */}
            <div style={{ paddingTop: 16, borderTop: '1px solid var(--color-border)' }}>
              <Button variant="primary" className="w-full" onClick={() => showToast(`Opening email portal for ${selectedCustomer.email}…`, 'info')} style={{ width: '100%' }}>
                <Mail size={14} /> Send Email Notice
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default Customers;
