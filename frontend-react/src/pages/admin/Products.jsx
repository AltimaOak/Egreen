// Admin Product CRUD Page — Redesigned
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import { imageService } from '../../services/imageService';
import { useAdmin } from '../../contexts/AdminContext';
import {
  Card,
  Button,
  Badge,
  Drawer,
  ConfirmDialog,
  SkeletonTable,
  EmptyState,
  Input,
  Select,
  Textarea,
} from '../../components/admin/UI';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  X,
  Upload,
  ChevronLeft,
  ChevronRight,
  Star,
} from 'lucide-react';
import { formatPrice, generateSlug } from '../../utils/helpers';
import { validateProduct } from '../../utils/validators';

const CATEGORIES = [
  { value: 'mini-pc', label: 'Mini PCs' },
  { value: 'thin-client', label: 'Thin Clients' },
  { value: 'desktop', label: 'Desktops' },
  { value: 'laptop', label: 'Laptops' },
  { value: 'processors', label: 'Processors' },
  { value: 'components', label: 'Components & SSDs' },
  { value: 'other', label: 'Other Accessories' },
];

const BRANDS = ['Dell', 'HP', 'Lenovo', 'Intel', 'Asus', 'Apacer', 'Other'];

const INITIAL_FORM_STATE = {
  name: '',
  slug: '',
  category: 'laptop',
  description: '',
  price: '',
  offerPrice: '',
  brand: 'Dell',
  SKU: '',
  stock: 12,
  rating: 4.5,
  status: 'Active',
  featured: false,
  features: [''],
  specifications: [{ key: '', value: '' }],
  seoTitle: '',
  seoDescription: '',
  image: '',
  gallery: [],
};

const Products = () => {
  const { showToast } = useAdmin();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Table controls
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrandFilter, setSelectedBrandFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Drawer state (replaces viewState list/create/edit/details)
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState('create'); // create | edit | view
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [imageUploading, setImageUploading] = useState(false);
  const [wizardStep, setWizardStep] = useState(0);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getProducts();
      setProducts(data);
    } catch (e) {
      showToast('Failed to load products list.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Listen for ?action=add and ?q= search params
  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'add') {
      openCreateDrawer();
    }
    const query = searchParams.get('q');
    if (query) {
      setSearchTerm(query);
    }
  }, [searchParams]);

  // Auto-generate slug, SKU, SEO fields
  useEffect(() => {
    if (drawerMode === 'create' && formData.name) {
      setFormData((prev) => ({
        ...prev,
        slug: generateSlug(prev.name),
        SKU: prev.SKU || `EG-${prev.brand.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
        seoTitle: `${prev.name} - Egreen Technology`,
        seoDescription: `Buy ${prev.name} online at wholesale rates. 100% genuine guaranteed.`,
      }));
    }
  }, [formData.name, formData.brand, drawerMode]);

  // Brand filter counts
  const brandCounts = {
    all: products.length,
    Dell: products.filter((p) => p.brand === 'Dell').length,
    Lenovo: products.filter((p) => p.brand === 'Lenovo').length,
    HP: products.filter((p) => p.brand === 'HP').length,
    Acer: products.filter((p) => p.brand === 'Acer' || p.brand === 'Asus').length,
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.SKU || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = selectedBrandFilter === 'all' || p.brand.toLowerCase() === selectedBrandFilter.toLowerCase();
    return matchesSearch && matchesBrand;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];

    if (sortBy === 'price') {
      valA = parseFloat(valA || 0);
      valB = parseFloat(valB || 0);
    } else if (sortBy === 'stock') {
      valA = parseInt(valA || 0);
      valB = parseInt(valB || 0);
    } else {
      valA = valA.toString().toLowerCase();
      valB = valB.toString().toLowerCase();
    }

    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const openCreateDrawer = () => {
    setFormData(INITIAL_FORM_STATE);
    setWizardStep(0);
    setDrawerMode('create');
    setDrawerOpen(true);
    setCurrentId(null);
  };

  const openEditDrawer = (product) => {
    setFormData({
      ...INITIAL_FORM_STATE,
      ...product,
      features: product.features && product.features.length > 0 ? product.features : [''],
      specifications: product.specifications && product.specifications.length > 0 ? product.specifications : [{ key: '', value: '' }],
    });
    setCurrentId(product.id);
    setWizardStep(0);
    setDrawerMode('edit');
    setDrawerOpen(true);
  };

  const openViewDrawer = (product) => {
    setFormData(product);
    setDrawerMode('view');
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setWizardStep(0);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageUploading(true);
    showToast('Uploading image...', 'loading');

    try {
      const base64 = await imageService.uploadImage(file);
      setFormData((prev) => ({ ...prev, image: base64 }));
      showToast('Image uploaded successfully', 'success');
    } catch (err) {
      showToast(err.message || 'Image upload failed', 'error');
    } finally {
      setImageUploading(false);
    }
  };

  const handleSpecChange = (index, field, value) => {
    const updatedSpecs = [...formData.specifications];
    updatedSpecs[index][field] = value;
    setFormData((prev) => ({ ...prev, specifications: updatedSpecs }));
  };

  const addSpecField = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { key: '', value: '' }],
    }));
  };

  const removeSpecField = (index) => {
    const updatedSpecs = formData.specifications.filter((_, idx) => idx !== index);
    setFormData((prev) => ({ ...prev, specifications: updatedSpecs }));
  };

  const handleFeatureChange = (index, value) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures[index] = value;
    setFormData((prev) => ({ ...prev, features: updatedFeatures }));
  };

  const addFeatureField = () => {
    setFormData((prev) => ({ ...prev, features: [...prev.features, ''] }));
  };

  const removeFeatureField = (index) => {
    const updatedFeatures = formData.features.filter((_, idx) => idx !== index);
    setFormData((prev) => ({ ...prev, features: updatedFeatures }));
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    setDeleteModalOpen(false);
    showToast('Deleting product...', 'loading');
    try {
      await productService.deleteProduct(productToDelete.id);
      showToast('Changes Published Successfully', 'success');
      fetchProducts();
    } catch (e) {
      showToast('Failed to delete product', 'error');
    }
  };

  const handleFormSubmit = async (e) => {
    if (e) e.preventDefault();

    const cleanedSpecs = formData.specifications.filter((s) => s.key.trim() !== '' && s.value.trim() !== '');
    const cleanedFeatures = formData.features.filter((f) => f.trim() !== '');

    const finalData = {
      ...formData,
      price: parseFloat(formData.price),
      offerPrice: formData.offerPrice ? parseFloat(formData.offerPrice) : null,
      stock: parseInt(formData.stock),
      specifications: cleanedSpecs.length > 0 ? cleanedSpecs : [{ key: 'Specs', value: formData.description }],
      features: cleanedFeatures.length > 0 ? cleanedFeatures : ['Tested Quality'],
    };

    const errors = validateProduct(finalData);
    if (errors.length > 0) {
      showToast(errors[0], 'error');
      return;
    }

    showToast('Saving Changes...', 'loading');
    try {
      if (drawerMode === 'create') {
        await productService.createProduct(finalData);
      } else {
        await productService.updateProduct(currentId, finalData);
      }
      showToast('Changes Published Successfully', 'success');
      setDrawerOpen(false);
      fetchProducts();
    } catch (e) {
      showToast('Failed to save product details.', 'error');
    }
  };

  const wizardStepsLabels = [
    { title: 'Basic Info', num: 1 },
    { title: 'Specifications', num: 2 },
    { title: 'Media', num: 3 },
    { title: 'Pricing', num: 4 },
    { title: 'Publish', num: 5 },
  ];

  const sortOptions = [
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
    { value: 'price-asc', label: 'Price (Low-High)' },
    { value: 'price-desc', label: 'Price (High-Low)' },
    { value: 'stock-asc', label: 'Stock (Low-High)' },
    { value: 'stock-desc', label: 'Stock (High-Low)' },
  ];

  const drawerTitle = drawerMode === 'create' ? 'Add New Product' : drawerMode === 'edit' ? `Edit: ${formData.name}` : `Product: ${formData.name}`;

  return (
    <div>
      {/* Page header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Products</h1>
          <p className="admin-page-subtitle">Manage product catalog, pricing, and inventory.</p>
        </div>
        <Button variant="primary" size="md" icon={<Plus size={16} />} onClick={openCreateDrawer}>
          Add Product
        </Button>
      </div>

      {/* Brand filter chips */}
      <div className="admin-filter-chips">
        {['all', 'Dell', 'Lenovo', 'HP', 'Acer'].map((brand) => (
          <button
            key={brand}
            className={`admin-filter-chip ${selectedBrandFilter === brand ? 'active' : ''}`}
            onClick={() => {
              setSelectedBrandFilter(brand);
              setCurrentPage(1);
            }}
          >
            {brand === 'all' ? 'All' : brand} ({brandCounts[brand] || 0})
          </button>
        ))}
      </div>

      <Card noShadow>
        {/* Search + Sort toolbar */}
        <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
          <div className="relative w-full max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              className="admin-input"
              style={{ paddingLeft: '36px' }}
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <Select
            options={sortOptions}
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field);
              setSortOrder(order);
            }}
          />
        </div>

        {loading ? (
          <SkeletonTable rows={itemsPerPage} cols={7} />
        ) : (
          <>
            {paginatedProducts.length === 0 ? (
              <EmptyState
                title="No products found"
                description="No products match your current filters."
                action={<Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={openCreateDrawer}>Add Product</Button>}
              />
            ) : (
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}>
                        <input type="checkbox" className="admin-checkbox" style={{ margin: 0 }} />
                      </th>
                      <th>Product</th>
                      <th>Brand</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Status</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedProducts.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <input type="checkbox" className="admin-checkbox" style={{ margin: 0 }} />
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            {p.image ? (
                              <img src={p.image} alt={p.name} className="admin-table-img" />
                            ) : (
                              <div className="admin-table-img flex items-center justify-center bg-muted/10 text-muted text-xs">
                                No Image
                              </div>
                            )}
                            <div>
                              <strong className="text-sm text-text">{p.name}</strong>
                              <span className="block text-xs text-muted">SKU: {p.SKU || '-'}</span>
                            </div>
                          </div>
                        </td>
                        <td className="text-sm">{p.brand}</td>
                        <td className="text-sm capitalize">
                          {CATEGORIES.find((c) => c.value === p.category)?.label || p.category}
                        </td>
                        <td>
                          <span className="font-medium text-text">{formatPrice(p.price)}</span>
                          {p.offerPrice && (
                            <span className="block text-xs text-danger line-through">{formatPrice(p.offerPrice)}</span>
                          )}
                        </td>
                        <td>
                          <span className={p.stock === 0 ? 'text-danger' : (p.stock < 5 ? 'text-warning' : 'text-text')}>
                            {p.stock === 0 ? 'Out of stock' : `${p.stock} units`}
                          </span>
                        </td>
                        <td>
                          <Badge variant={p.status === 'Active' ? 'success' : 'warning'}>{p.status}</Badge>
                          {p.featured && <Badge variant="primary" className="ml-1">Featured</Badge>}
                        </td>
                        <td className="text-right">
                          <div className="flex justify-end gap-1">
                            <button
                              className="admin-btn admin-btn-secondary admin-btn-sm"
                              style={{ padding: '4px 8px' }}
                              title="View details"
                              onClick={() => openViewDrawer(p)}
                            >
                              <Eye size={13} />
                            </button>
                            <button
                              className="admin-btn admin-btn-secondary admin-btn-sm"
                              style={{ padding: '4px 8px' }}
                              title="Edit details"
                              onClick={() => openEditDrawer(p)}
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              className="admin-btn admin-btn-secondary admin-btn-sm"
                              style={{ padding: '4px 8px', color: 'var(--color-danger)' }}
                              title="Delete"
                              onClick={() => handleDeleteClick(p)}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 text-xs text-muted">
                <span>
                  Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length}
                </span>
                <div className="flex gap-1">
                  <button
                    className="admin-btn admin-btn-secondary admin-btn-sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  >
                    <ChevronLeft size={14} />
                  </button>
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <button
                      key={idx}
                      className={`admin-btn admin-btn-secondary admin-btn-sm ${currentPage === idx + 1 ? 'admin-btn-primary' : ''}`}
                      style={{ minWidth: '32px' }}
                      onClick={() => setCurrentPage(idx + 1)}
                    >
                      {idx + 1}
                    </button>
                  ))}
                  <button
                    className="admin-btn admin-btn-secondary admin-btn-sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Product Edit/Create Drawer */}
      <Drawer
        open={drawerOpen}
        onClose={closeDrawer}
        title={drawerTitle}
        side="right"
        size="2xl"
        footer={
          drawerMode !== 'view' && (
            <div className="flex justify-end gap-2">
              <Button variant="secondary" size="sm" onClick={closeDrawer}>Discard</Button>
              {wizardStep < wizardStepsLabels.length - 1 ? (
                <Button size="sm" onClick={() => setWizardStep((s) => s + 1)}>Next</Button>
              ) : (
                <Button variant="primary" size="sm" onClick={handleFormSubmit}>
                  {drawerMode === 'create' ? 'Create Product' : 'Save Changes'}
                </Button>
              )}
            </div>
          )
        }
      >
        {drawerMode === 'view' ? (
          /* Read-only details view */
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-medium text-muted mb-1">Product Name</h4>
              <p className="text-sm text-text">{formData.name}</p>
            </div>
            <div>
              <h4 className="text-xs font-medium text-muted mb-1">Description</h4>
              <p className="text-sm text-muted">{formData.description}</p>
            </div>
            <div>
              <h4 className="text-xs font-medium text-muted mb-1">Price</h4>
              <p className="text-sm text-text">{formatPrice(formData.price)}</p>
            </div>
            <div>
              <h4 className="text-xs font-medium text-muted mb-1">SKU</h4>
              <p className="text-sm text-text">{formData.SKU}</p>
            </div>
            <div>
              <h4 className="text-xs font-medium text-muted mb-1">Stock</h4>
              <p className="text-sm text-text">{formData.stock} units</p>
            </div>
            <div>
              <h4 className="text-xs font-medium text-muted mb-1">Status</h4>
              <Badge variant={formData.status === 'Active' ? 'success' : 'warning'}>{formData.status}</Badge>
            </div>
            {formData.specifications && (
              <div>
                <h4 className="text-xs font-medium text-muted mb-2">Specifications</h4>
                <table className="admin-table">
                  <tbody>
                    {formData.specifications.map((spec, i) => (
                      <tr key={i}>
                        <td className="font-medium text-text">{spec.key}</td>
                        <td>{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="flex gap-2 pt-4 border-t border-border">
              <Button variant="primary" size="sm" onClick={() => openEditDrawer(formData)}>
                Edit Product
              </Button>
              <Button variant="secondary" size="sm" onClick={closeDrawer}>
                Close
              </Button>
            </div>
          </div>
        ) : (
          /* Edit/Create form with wizard steps */
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {/* Wizard step navigation */}
            <div className="admin-form-wizard-headers">
              {wizardStepsLabels.map((step, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`admin-form-wizard-header ${wizardStep === idx ? 'active' : ''}`}
                  onClick={() => setWizardStep(idx)}
                >
                  <div className="admin-form-wizard-header-num">{step.num}</div>
                  {step.title}
                </button>
              ))}
            </div>

            {/* STEP 0: Basic Info */}
            {wizardStep === 0 && (
              <div className="space-y-4">
                <Input
                  label="Product Name"
                  placeholder="e.g. Dell Inspiron 15 3530"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Product Brand"
                    options={BRANDS.map((b) => ({ value: b, label: b }))}
                    value={formData.brand}
                    onChange={(e) => setFormData((prev) => ({ ...prev, brand: e.target.value }))}
                    required
                  />
                  <Select
                    label="Category"
                    options={CATEGORIES.map((c) => ({ value: c.value, label: c.label }))}
                    value={formData.category}
                    onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                    required
                  />
                </div>
                <Textarea
                  label="Short Description"
                  placeholder="Powerful and reliable laptop for work and entertainment..."
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  required
                  minHeight="80px"
                />
              </div>
            )}

            {/* STEP 1: Specifications */}
            {wizardStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="SKU Identifier"
                    value={formData.SKU}
                    onChange={(e) => setFormData((prev) => ({ ...prev, SKU: e.target.value }))}
                    required
                  />
                  <Input
                    label="Stock quantity"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData((prev) => ({ ...prev, stock: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-medium text-text">Technical Specs</label>
                    <Button variant="ghost" size="sm" icon={<Plus size={12} />} onClick={addSpecField}>
                      + Add Spec
                    </Button>
                  </div>
                  {formData.specifications.map((spec, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        className="admin-input"
                        style={{ flex: 1 }}
                        placeholder="RAM"
                        value={spec.key}
                        onChange={(e) => handleSpecChange(idx, 'key', e.target.value)}
                      />
                      <input
                        type="text"
                        className="admin-input"
                        style={{ flex: 2 }}
                        placeholder="16GB DDR4"
                        value={spec.value}
                        onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                      />
                      {formData.specifications.length > 1 && (
                        <button
                          type="button"
                          className="admin-btn admin-btn-secondary"
                          style={{ padding: '8px', color: 'var(--color-danger)' }}
                          onClick={() => removeSpecField(idx)}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-medium text-text">Highlights / Features</label>
                    <Button variant="ghost" size="sm" icon={<Plus size={12} />} onClick={addFeatureField}>
                      + Add Highlight
                    </Button>
                  </div>
                  {formData.features.map((feat, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="e.g. 15.6 FHD 120Hz display"
                        value={feat}
                        onChange={(e) => handleFeatureChange(idx, e.target.value)}
                      />
                      {formData.features.length > 1 && (
                        <button
                          type="button"
                          className="admin-btn admin-btn-secondary"
                          style={{ padding: '8px', color: 'var(--color-danger)' }}
                          onClick={() => removeFeatureField(idx)}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: Media */}
            {wizardStep === 2 && (
              <div>
                <label className="text-xs font-medium text-text mb-2 block">Upload Product Image</label>
                {formData.image ? (
                  <div className="relative w-full max-w-sm aspect-[1.4] overflow-hidden rounded-[var(--radius-card)] border border-border">
                    <img src={formData.image} alt="Upload Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      className="admin-image-delete-btn"
                      onClick={() => setFormData((prev) => ({ ...prev, image: '' }))}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label className="admin-image-upload-zone">
                    <Upload size={28} color="var(--color-muted)" />
                    <span className="text-sm text-muted">Select file from local system</span>
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      disabled={imageUploading}
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>
            )}

            {/* STEP 3: Pricing */}
            {wizardStep === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Regular Wholesaler Price (INR)"
                    type="number"
                    placeholder="e.g. 56990"
                    value={formData.price}
                    onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                    required
                  />
                  <Input
                    label="Special Offer Price (INR)"
                    type="number"
                    placeholder="e.g. 52990"
                    value={formData.offerPrice}
                    onChange={(e) => setFormData((prev) => ({ ...prev, offerPrice: e.target.value }))}
                  />
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="featured-check"
                    className="admin-checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData((prev) => ({ ...prev, featured: e.target.checked }))}
                  />
                  <label htmlFor="featured-check" className="text-sm text-text cursor-pointer">
                    Highlight on Homepage slider
                  </label>
                </div>
              </div>
            )}

            {/* STEP 4: Publish */}
            {wizardStep === 4 && (
              <div className="space-y-4">
                <Select
                  label="Publishing Status"
                  options={[
                    { value: 'Active', label: 'Active (Live on website)' },
                    { value: 'Draft', label: 'Draft (Invisible)' },
                    { value: 'Archived', label: 'Archived (Deprioritized)' },
                  ]}
                  value={formData.status}
                  onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
                />
                <Input
                  label="Rating score"
                  type="number"
                  step="0.1"
                  value={formData.rating}
                  onChange={(e) => setFormData((prev) => ({ ...prev, rating: e.target.value }))}
                />
                <Input
                  label="SEO Title"
                  value={formData.seoTitle}
                  onChange={(e) => setFormData((prev) => ({ ...prev, seoTitle: e.target.value }))}
                />
                <Textarea
                  label="SEO Meta Description"
                  value={formData.seoDescription}
                  onChange={(e) => setFormData((prev) => ({ ...prev, seoDescription: e.target.value }))}
                  minHeight="60px"
                />
              </div>
            )}
          </form>
        )}
      </Drawer>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteModalOpen}
        title="Confirm Deletion"
        message={`Are you sure you want to permanently delete "${productToDelete?.name}"?`}
        confirmText="Delete Product"
        cancelText="Cancel"
        type="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
};

export default Products;
