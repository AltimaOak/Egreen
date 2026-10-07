import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import { useAdmin } from '../../contexts/AdminContext';
import {
  Card,
  Button,
  Badge,
  Input,
  ConfirmDialog,
  SkeletonTable,
  EmptyState,
  AdminPageHeader,
} from '../../components/admin/UI';
import {
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  ArrowLeft,
  Layers,
  Save,
  RotateCcw,
} from 'lucide-react';
import { formatPrice } from '../../utils/helpers';

const INITIAL_VARIANT_FORM = {
  ram: '',
  storage: '',
  price: '',
  offerPrice: '',
  stock: 10,
  sku: '',
  isDefault: false,
};

const ProductVariants = () => {
  const { id } = useParams();
  const productId = parseInt(id, 10);
  const { showToast } = useAdmin();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [formState, setFormState] = useState(INITIAL_VARIANT_FORM);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editFormState, setEditFormState] = useState({});
  const [editError, setEditError] = useState('');

  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prod, vars] = await Promise.all([
        productService.getProduct(productId),
        productService.getVariants(productId),
      ]);
      setProduct(prod);
      setVariants(vars || []);
    } catch (err) {
      console.error('Error loading variants:', err);
      showToast?.('Failed to load product variants', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchData();
    }
  }, [productId]);

  const handleAddSubmit = async (e) => {
    e?.preventDefault();
    setFormError('');

    if (!formState.ram && !formState.storage) {
      setFormError('Please provide at least a RAM or Storage specification.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        ram: formState.ram?.trim() || null,
        storage: formState.storage?.trim() || null,
        price: formState.price !== '' ? Number(formState.price) : null,
        offerPrice: formState.offerPrice !== '' ? Number(formState.offerPrice) : null,
        stock: formState.stock !== '' ? Number(formState.stock) : 0,
        sku: formState.sku?.trim() || null,
        isDefault: !!formState.isDefault,
      };

      await productService.createVariant(productId, payload);
      showToast?.('Product variant created successfully', 'success');
      setFormState(INITIAL_VARIANT_FORM);
      setIsAdding(false);
      await fetchData();
    } catch (err) {
      console.error('Create variant error:', err);
      setFormError(err.message || 'Failed to create variant.');
      showToast?.('Failed to create variant', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const startEditing = (variant) => {
    setEditingId(variant.id);
    setEditFormState({
      ram: variant.ram || '',
      storage: variant.storage || '',
      price: variant.price != null ? variant.price : '',
      offerPrice: variant.offerPrice != null ? variant.offerPrice : '',
      stock: variant.stock != null ? variant.stock : 0,
      sku: variant.sku || '',
      isDefault: !!variant.isDefault,
    });
    setEditError('');
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditFormState({});
    setEditError('');
  };

  const handleEditSubmit = async (variantId) => {
    setEditError('');

    if (!editFormState.ram && !editFormState.storage) {
      setEditError('Please provide at least RAM or Storage.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        ram: editFormState.ram?.trim() || null,
        storage: editFormState.storage?.trim() || null,
        price: editFormState.price !== '' ? Number(editFormState.price) : null,
        offerPrice: editFormState.offerPrice !== '' ? Number(editFormState.offerPrice) : null,
        stock: editFormState.stock !== '' ? Number(editFormState.stock) : 0,
        sku: editFormState.sku?.trim() || null,
        isDefault: !!editFormState.isDefault,
      };

      await productService.updateVariant(productId, variantId, payload);
      showToast?.('Product variant updated successfully', 'success');
      setEditingId(null);
      await fetchData();
    } catch (err) {
      console.error('Update variant error:', err);
      setEditError(err.message || 'Failed to update variant.');
      showToast?.('Failed to update variant', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;
    try {
      await productService.deleteVariant(productId, deleteConfirm.id);
      showToast?.('Variant deleted successfully', 'success');
      setDeleteConfirm(null);
      await fetchData();
    } catch (err) {
      console.error('Delete variant error:', err);
      showToast?.('Failed to delete variant', 'error');
    }
  };

  return (
    <div className="admin-page">
      <AdminPageHeader
        title={product ? `Variants: ${product.name}` : `Product Variants (#${productId})`}
        subtitle={product ? `Category: ${product.category} • SKU: ${product.SKU || 'N/A'}` : 'Configure hardware options'}
        action={
          <div style={{ display: 'flex', gap: 8 }}>
            <Link to="/admin/products">
              <Button variant="secondary" size="sm">
                <ArrowLeft size={14} style={{ marginRight: 6 }} /> Back to Products
              </Button>
            </Link>
            {!isAdding && (
              <Button variant="primary" size="sm" onClick={() => setIsAdding(true)}>
                <Plus size={14} style={{ marginRight: 6 }} /> Add Variant
              </Button>
            )}
          </div>
        }
      />

      {/* Add Variant Form */}
      {isAdding && (
        <Card title="Add New Variant" style={{ marginBottom: 20 }}>
          <form onSubmit={handleAddSubmit}>
            {formError && (
              <div style={{ color: 'var(--color-danger, #ef4444)', fontSize: '0.8rem', marginBottom: 12, fontWeight: 500 }}>
                {formError}
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 16 }}>
              <Input
                id="variant_ram"
                name="variant_ram"
                label="RAM (e.g. 8GB, 16GB)"
                value={formState.ram}
                onChange={(e) => setFormState({ ...formState, ram: e.target.value })}
                placeholder="8GB"
              />
              <Input
                id="variant_storage"
                name="variant_storage"
                label="Storage (e.g. 256GB SSD)"
                value={formState.storage}
                onChange={(e) => setFormState({ ...formState, storage: e.target.value })}
                placeholder="256GB SSD"
              />
              <Input
                id="variant_price"
                name="variant_price"
                label="Price (₹)"
                type="number"
                value={formState.price}
                onChange={(e) => setFormState({ ...formState, price: e.target.value })}
                placeholder="15000"
                min="0"
              />
              <Input
                id="variant_offer_price"
                name="variant_offer_price"
                label="Offer Price (₹)"
                type="number"
                value={formState.offerPrice}
                onChange={(e) => setFormState({ ...formState, offerPrice: e.target.value })}
                placeholder="14000"
                min="0"
              />
              <Input
                id="variant_stock"
                name="variant_stock"
                label="Stock"
                type="number"
                value={formState.stock}
                onChange={(e) => setFormState({ ...formState, stock: e.target.value })}
                placeholder="10"
                min="0"
              />
              <Input
                id="variant_sku"
                name="variant_sku"
                label="SKU"
                value={formState.sku}
                onChange={(e) => setFormState({ ...formState, sku: e.target.value })}
                placeholder="Optional SKU"
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: 14 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600, color: 'var(--color-text)' }}>
                <input
                  type="checkbox"
                  id="variant_is_default"
                  name="is_default"
                  checked={formState.isDefault}
                  onChange={(e) => setFormState({ ...formState, isDefault: e.target.checked })}
                  style={{ width: 16, height: 16, cursor: 'pointer' }}
                />
                Set as Default Variant
              </label>

              <div style={{ display: 'flex', gap: 8 }}>
                <Button variant="secondary" size="sm" type="button" onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" disabled={submitting}>
                  <Save size={14} style={{ marginRight: 6 }} /> {submitting ? 'Saving...' : 'Save Variant'}
                </Button>
              </div>
            </div>
          </form>
        </Card>
      )}

      {/* Variants List Table */}
      <Card>
        {loading ? (
          <SkeletonTable rows={4} cols={8} />
        ) : variants.length === 0 ? (
          <EmptyState
            icon={<Layers size={40} color="var(--color-primary)" />}
            title="No Variants Configured"
            description="This product currently uses single default specs. Add variants to allow customers to choose different RAM & Storage configurations."
            action={
              !isAdding && (
                <Button variant="primary" size="sm" onClick={() => setIsAdding(true)}>
                  <Plus size={14} style={{ marginRight: 6 }} /> Add First Variant
                </Button>
              )
            }
          />
        ) : (
          <div className="admin-table-container">
            {editError && (
              <div style={{ color: 'var(--color-danger, #ef4444)', fontSize: '0.8rem', padding: '8px 12px', background: '#FEF2F2', borderBottom: '1px solid #FEE2E2', fontWeight: 500 }}>
                {editError}
              </div>
            )}
            <table className="admin-table">
              <thead>
                <tr>
                  <th>RAM</th>
                  <th>Storage</th>
                  <th>Price</th>
                  <th>Offer Price</th>
                  <th>Stock</th>
                  <th>SKU</th>
                  <th>Default</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {variants.map((v) => {
                  const isEditing = editingId === v.id;
                  return (
                    <tr key={v.id}>
                      {isEditing ? (
                        <>
                          <td>
                            <input
                              type="text"
                              className="admin-input"
                              value={editFormState.ram}
                              onChange={(e) => setEditFormState({ ...editFormState, ram: e.target.value })}
                              placeholder="RAM"
                              style={{ padding: '4px 8px', fontSize: '0.82rem', height: 32 }}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className="admin-input"
                              value={editFormState.storage}
                              onChange={(e) => setEditFormState({ ...editFormState, storage: e.target.value })}
                              placeholder="Storage"
                              style={{ padding: '4px 8px', fontSize: '0.82rem', height: 32 }}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="admin-input"
                              value={editFormState.price}
                              onChange={(e) => setEditFormState({ ...editFormState, price: e.target.value })}
                              placeholder="Price"
                              style={{ padding: '4px 8px', fontSize: '0.82rem', height: 32, width: 100 }}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="admin-input"
                              value={editFormState.offerPrice}
                              onChange={(e) => setEditFormState({ ...editFormState, offerPrice: e.target.value })}
                              placeholder="Offer"
                              style={{ padding: '4px 8px', fontSize: '0.82rem', height: 32, width: 100 }}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="admin-input"
                              value={editFormState.stock}
                              onChange={(e) => setEditFormState({ ...editFormState, stock: e.target.value })}
                              placeholder="Stock"
                              style={{ padding: '4px 8px', fontSize: '0.82rem', height: 32, width: 70 }}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className="admin-input"
                              value={editFormState.sku}
                              onChange={(e) => setEditFormState({ ...editFormState, sku: e.target.value })}
                              placeholder="SKU"
                              style={{ padding: '4px 8px', fontSize: '0.82rem', height: 32, width: 100 }}
                            />
                          </td>
                          <td>
                            <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                              <input
                                type="checkbox"
                                checked={editFormState.isDefault}
                                onChange={(e) => setEditFormState({ ...editFormState, isDefault: e.target.checked })}
                                style={{ width: 16, height: 16 }}
                              />
                            </label>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
                              <Button
                                variant="primary"
                                size="sm"
                                title="Save changes"
                                onClick={() => handleEditSubmit(v.id)}
                                disabled={submitting}
                              >
                                <Check size={13} />
                              </Button>
                              <Button
                                variant="secondary"
                                size="sm"
                                title="Cancel"
                                onClick={cancelEditing}
                              >
                                <X size={13} />
                              </Button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td style={{ fontWeight: 600, color: 'var(--color-text)' }}>
                            {v.ram || <span style={{ color: 'var(--color-muted)' }}>—</span>}
                          </td>
                          <td style={{ fontWeight: 600, color: 'var(--color-text)' }}>
                            {v.storage || <span style={{ color: 'var(--color-muted)' }}>—</span>}
                          </td>
                          <td>
                            <span style={{ fontWeight: 700, color: 'var(--color-text)' }}>
                              {v.price != null ? formatPrice(Number(v.price)) : '—'}
                            </span>
                          </td>
                          <td>
                            {v.offerPrice != null ? (
                              <span style={{ fontWeight: 600, color: 'var(--color-danger, #ef4444)' }}>
                                {formatPrice(Number(v.offerPrice))}
                              </span>
                            ) : (
                              <span style={{ color: 'var(--color-muted)' }}>—</span>
                            )}
                          </td>
                          <td>
                            <span
                              style={{
                                fontWeight: 600,
                                color:
                                  v.stock === 0
                                    ? 'var(--color-danger)'
                                    : v.stock < 5
                                    ? 'var(--color-warning)'
                                    : 'var(--color-text)',
                              }}
                            >
                              {v.stock === 0 ? 'Out of stock' : `${v.stock} units`}
                            </span>
                          </td>
                          <td>
                            <span style={{ fontSize: '0.78rem', color: 'var(--color-muted)' }}>
                              {v.sku || '—'}
                            </span>
                          </td>
                          <td>
                            {v.isDefault ? (
                              <Badge variant="success">Default</Badge>
                            ) : (
                              <span style={{ color: 'var(--color-muted)', fontSize: '0.78rem' }}>No</span>
                            )}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
                              <Button
                                variant="ghost"
                                size="sm"
                                title="Edit Variant"
                                onClick={() => startEditing(v)}
                              >
                                <Edit2 size={13} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                title="Delete Variant"
                                style={{ color: 'var(--color-danger)' }}
                                onClick={() => setDeleteConfirm(v)}
                              >
                                <Trash2 size={13} />
                              </Button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <ConfirmDialog
          isOpen={true}
          title="Delete Variant"
          message={`Are you sure you want to delete the variant "${deleteConfirm.ram || ''} ${deleteConfirm.storage || ''}"? This action cannot be undone.`}
          confirmText="Delete Variant"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  );
};

export default ProductVariants;
