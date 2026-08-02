import React, { useState, useEffect } from 'react';
import { categoryService } from '../../services/categoryService';
import { useAdmin } from '../../contexts/AdminContext';
import { Plus, Edit2, Trash2, Layers, Search } from 'lucide-react';
import { CardSkeleton } from '../../components/admin/Skeleton';
import {
  Button, Badge, Modal, Input, Textarea, ConfirmDialog, EmptyState, AdminPageHeader,
} from '../../components/admin/UI';

/* ── Real brand SVG logos ───────────────────────────────────── */
const BRAND_LOGOS = {
  Dell: (
    <svg viewBox="0 0 100 40" width="64" height="26" xmlns="http://www.w3.org/2000/svg" aria-label="Dell">
      <path d="M14.5 4C8.15 4 3 9.15 3 15.5S8.15 27 14.5 27c3.9 0 7.35-1.88 9.5-4.77V26.5h5.5V4.5H24V9.27C21.85 6.38 18.4 4 14.5 4zm0 5.5a6 6 0 110 12 6 6 0 010-12z" fill="#007DB8" transform="scale(1.3) translate(-1,-1)"/>
      <text x="32" y="27" fontFamily="Arial" fontWeight="800" fontSize="22" fill="#007DB8">DELL</text>
    </svg>
  ),
  Lenovo: (
    <svg viewBox="0 0 160 40" width="90" height="28" xmlns="http://www.w3.org/2000/svg" aria-label="Lenovo">
      <rect x="0" y="6" width="28" height="28" rx="4" fill="#E2231A"/>
      <text x="4" y="27" fontFamily="Arial" fontWeight="900" fontSize="20" fill="#fff">L</text>
      <text x="34" y="28" fontFamily="Arial" fontWeight="700" fontSize="20" fill="#1A1A1A">enovo</text>
    </svg>
  ),
  HP: (
    <svg viewBox="0 0 80 40" width="60" height="28" xmlns="http://www.w3.org/2000/svg" aria-label="HP">
      <circle cx="20" cy="20" r="18" fill="#0096D6"/>
      <text x="8" y="26" fontFamily="Arial" fontWeight="900" fontSize="18" fill="#fff">hp</text>
      <text x="42" y="28" fontFamily="Arial" fontWeight="700" fontSize="20" fill="#0096D6">HP</text>
    </svg>
  ),
  Acer: (
    <svg viewBox="0 0 120 40" width="76" height="28" xmlns="http://www.w3.org/2000/svg" aria-label="Acer">
      <polygon points="22,4 4,36 40,36" fill="none" stroke="#83B81A" strokeWidth="4"/>
      <polygon points="22,12 10,32 34,32" fill="#83B81A"/>
      <text x="46" y="28" fontFamily="Arial" fontWeight="700" fontSize="20" fill="#1A1A1A">acer</text>
    </svg>
  ),
  Asus: (
    <svg viewBox="0 0 120 40" width="76" height="28" xmlns="http://www.w3.org/2000/svg" aria-label="Asus">
      <text x="4" y="30" fontFamily="Arial" fontWeight="900" fontSize="26" fill="#00539B">ASUS</text>
    </svg>
  ),
};

const colorFor = (name) => {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  const hue = Math.abs(h) % 360;
  return { bg: `hsl(${hue},80%,94%)`, color: `hsl(${hue},65%,35%)` };
};

/* Renders either the real logo badge or a coloured initial circle */
const BrandLogo = ({ name, logoText }) => {
  const known = BRAND_LOGOS[name];
  if (known) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: 80, height: 48, borderRadius: 12,
        background: '#fff', border: '1px solid var(--color-border)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)', padding: '6px 10px',
        flexShrink: 0,
      }}>
        {known}
      </div>
    );
  }
  const clr = colorFor(name);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      width: 48, height: 48, borderRadius: 14,
      background: clr.bg, color: clr.color,
      fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.02em', flexShrink: 0,
    }}>
      {logoText || name.slice(0, 2).toUpperCase()}
    </div>
  );
};

const Categories = () => {
  const { showToast } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [editingId, setEditingId] = useState(null);
  const [catName, setCatName] = useState('');
  const [catSub, setCatSub] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [catToDelete, setCatToDelete] = useState(null);

  const fetch = async () => {
    try {
      setLoading(true);
      setCategories(await categoryService.getCategories());
    } catch { showToast('Failed to load categories.', 'error'); }
    finally  { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const openCreate = () => { setCatName(''); setCatSub(''); setEditingId(null); setModalMode('create'); setModalOpen(true); };
  const openEdit   = c  => { setCatName(c.name); setCatSub(c.subcategories || ''); setEditingId(c.id); setModalMode('edit'); setModalOpen(true); };

  const handleToggle = async (id) => {
    const ok = await categoryService.toggleCategoryStatus(id);
    ok ? (showToast('Status updated', 'success'), fetch()) : showToast('Failed to toggle status.', 'error');
  };

  const confirmDelete = async () => {
    try {
      showToast('Deleting…', 'loading');
      await categoryService.deleteCategory(catToDelete.id);
      showToast('Category deleted', 'success');
      setDeleteOpen(false);
      fetch();
    } catch { showToast('Failed to delete.', 'error'); }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!catName.trim()) return showToast('Category name is required.', 'error');
    showToast(modalMode === 'create' ? 'Creating…' : 'Updating…', 'loading');
    try {
      if (modalMode === 'create') {
        await categoryService.addCategory({ name: catName, subcategories: catSub || 'General', status: 'Active' });
        showToast('Category created', 'success');
      } else {
        await categoryService.updateCategory(editingId, { name: catName, subcategories: catSub || 'General' });
        showToast('Category updated', 'success');
      }
      setModalOpen(false);
      fetch();
    } catch { showToast('Failed to save.', 'error'); }
  };

  const filtered = categories.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.subcategories || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <AdminPageHeader
        title="Brand Categories"
        subtitle="Organize products by brand and sub-components."
        action={<Button variant="primary" icon={<Plus size={15} />} onClick={openCreate}>Add Category</Button>}
      />

      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <Input placeholder="Search categories…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} icon={<Search />} />
        <span style={{ fontSize: '0.78rem', color: 'var(--color-muted)', fontWeight: 500 }}>
          {filtered.length} {filtered.length === 1 ? 'category' : 'categories'}
        </span>
      </div>

      {loading ? (
        <div className="admin-categories-grid"><CardSkeleton count={6} /></div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Layers size={28} />}
          title="No categories found"
          description="Try adjusting your search or add a new brand category."
          action={<Button variant="primary" size="sm" icon={<Plus size={13} />} onClick={openCreate}>Add Category</Button>}
        />
      ) : (
        <div className="admin-categories-grid">
          {filtered.map(cat => {
            return (
              <div key={cat.id} className="admin-category-card">
                {/* Top: logo + actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                  <BrandLogo name={cat.name} logoText={cat.logoText} />
                  <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                    <Button variant="ghost" size="sm" title="Edit" onClick={() => openEdit(cat)}><Edit2 size={13} /></Button>
                    <Button variant="ghost" size="sm" title="Delete" onClick={() => { setCatToDelete(cat); setDeleteOpen(true); }} style={{ color: 'var(--color-danger)' }}><Trash2 size={13} /></Button>
                  </div>
                </div>

                {/* Body */}
                <div className="admin-category-card-body">
                  <h3>{cat.name}</h3>
                  <div className="admin-category-card-count">{cat.count || 0} products listed</div>
                </div>

                {cat.subcategories && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)', padding: '8px 10px', background: 'var(--color-background)', border: '1px solid var(--color-border)', borderRadius: 8, lineHeight: 1.5 }}>
                    <strong style={{ color: 'var(--color-text)', display: 'block', marginBottom: 2, fontSize: '0.72rem' }}>Includes:</strong>
                    {cat.subcategories}
                  </div>
                )}

                {/* Footer */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid var(--color-border)' }}>
                  <Badge variant={cat.status === 'Active' ? 'success' : 'warning'}>{cat.status}</Badge>
                  <label className="admin-toggle-switch">
                    <input type="checkbox" checked={cat.status === 'Active'} onChange={() => handleToggle(cat.id)} />
                    <span className="admin-toggle-slider" />
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalMode === 'create' ? 'Create Category' : `Edit: ${catName}`}
        size="sm"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={handleSubmit}>{modalMode === 'create' ? 'Add Category' : 'Save Changes'}</Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <Input label="Category Name" placeholder="e.g. Asus" value={catName} onChange={e => setCatName(e.target.value)} required />
          <Textarea label="Sub-components (comma-separated)" placeholder="Laptops, Monitors, Keyboards" value={catSub} onChange={e => setCatSub(e.target.value)} rows={3} />
        </form>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={deleteOpen}
        title="Delete Category"
        message={`Permanently delete "${catToDelete?.name}"? This cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </div>
  );
};

export default Categories;
