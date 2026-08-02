// Categories Management Dashboard Component
import React, { useState, useEffect } from 'react';
import { categoryService } from '../../services/categoryService';
import { useAdmin } from '../../contexts/AdminContext';
import { Plus, Edit2, Trash2, X, FolderTree } from 'lucide-react';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { CardSkeleton } from '../../components/admin/Skeleton';

const Categories = () => {
  const { showToast } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  
  // Create Modal state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatSub, setNewCatSub] = useState('');

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (e) {
      showToast('Failed to load categories.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleStatusToggle = async (id) => {
    showToast('Toggling category status...', 'loading');
    const success = await categoryService.toggleCategoryStatus(id);
    if (success) {
      showToast('Changes Published Successfully', 'success');
      fetchCategories();
    } else {
      showToast('Failed to toggle status.', 'error');
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (newCatName.trim() === '') {
      showToast('Category name is required.', 'error');
      return;
    }

    showToast('Saving Changes...', 'loading');
    try {
      await categoryService.addCategory({
        name: newCatName,
        subcategories: newCatSub || 'General accessories',
        status: 'Active'
      });
      showToast('Changes Published Successfully', 'success');
      setAddModalOpen(false);
      setNewCatName('');
      setNewCatSub('');
      fetchCategories();
    } catch (err) {
      showToast('Failed to create category.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="admin-categories-grid">
        {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
      </div>
    );
  }

  const logoColors = {
    Dell: { bg: '#EFF6FF', color: '#1D4ED8' },
    Lenovo: { bg: '#FEF2F2', color: '#EF4444' },
    HP: { bg: '#ECFDF5', color: '#10B981' },
    Acer: { bg: '#FFFBEB', color: '#D97706' }
  };

  return (
    <div style={{ textAlign: 'left' }}>
      
      {/* Categories Toolbar */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Brand Categories</h1>
          <p className="admin-page-subtitle">Organize your products with categories and brands.</p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={() => setAddModalOpen(true)}>
          <Plus size={16} /> Add Category
        </button>
      </div>

      {/* Categories Cards Grid Layout */}
      <div className="admin-categories-grid">
        {categories.map(cat => {
          const colors = logoColors[cat.name] || { bg: '#F1F5F9', color: '#475569' };
          return (
            <div key={cat.id} className="admin-category-card">
              
              {/* Row controls */}
              <div className="flex justify-between items-start" style={{ marginBottom: '8px' }}>
                {/* Round Brand Icon Circle */}
                <div 
                  className="admin-category-logo-circle"
                  style={{ backgroundColor: colors.bg, color: colors.color, border: 'none', marginBottom: 0 }}
                >
                  {cat.logoText}
                </div>

                <div className="flex gap-2">
                  <button className="admin-btn admin-btn-secondary admin-btn-sm" style={{ padding: '6px' }} title="Edit">
                    <Edit2 size={12} />
                  </button>
                  <button className="admin-btn admin-btn-secondary admin-btn-sm text-danger" style={{ padding: '6px', color: '#EF4444' }} title="Delete">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>

              {/* Title & Stats */}
              <div className="admin-category-card-body">
                <h3>{cat.name}</h3>
                <div className="admin-category-card-count">{cat.count} Products listed</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-body)', minHeight: '38px', marginBottom: '16px' }}>
                  <strong>Includes:</strong> {cat.subcategories}
                </div>
              </div>

              {/* Footer Active Status Toggle switch */}
              <div style={{ marginTop: 'auto', borderTop: '1px solid var(--admin-border)', paddingTop: '14px', display: 'flex', justifyBetween: 'space-between', alignItems: 'center' }} className="justify-between">
                <span className={`admin-badge ${cat.status === 'Active' ? 'admin-badge-success' : 'admin-badge-warning'}`}>
                  {cat.status}
                </span>

                <label className="admin-toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={cat.status === 'Active'} 
                    onChange={() => handleStatusToggle(cat.id)}
                  />
                  <span className="admin-toggle-slider"></span>
                </label>
              </div>

            </div>
          );
        })}
      </div>

      {/* CREATE CATEGORY MODAL DIALOG */}
      {addModalOpen && (
        <div className="admin-modal-overlay">
          <form onSubmit={handleCreateCategory} className="admin-modal" style={{ maxWidth: '420px' }}>
            <div className="admin-modal-header">
              <span className="admin-modal-title">Create New Category</span>
              <button type="button" className="admin-modal-close" onClick={() => setAddModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="admin-modal-body">
              <div className="admin-form-group">
                <label className="admin-form-label">Brand / Category Name</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  placeholder="e.g. Asus" 
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  required
                />
              </div>

              <div className="admin-form-group" style={{ marginBottom: 0 }}>
                <label className="admin-form-label">Sub-components (Comma separated)</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  placeholder="e.g. Laptops, Chromebooks" 
                  value={newCatSub}
                  onChange={(e) => setNewCatSub(e.target.value)}
                />
              </div>
            </div>
            <div className="admin-modal-footer">
              <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setAddModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="admin-btn admin-btn-primary">
                Add Category
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default Categories;
