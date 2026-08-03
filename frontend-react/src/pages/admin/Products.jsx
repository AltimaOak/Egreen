// Admin Product CRUD Page — Redesigned & User-Friendly
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
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
  AdminPageHeader,
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
  Check,
} from 'lucide-react';
import { formatPrice, generateSlug } from '../../utils/helpers';
import { validateProduct } from '../../utils/validators';

const DEFAULT_BRANDS = [
  { value: 'Dell', label: 'Dell' },
  { value: 'Lenovo', label: 'Lenovo' },
  { value: 'HP', label: 'HP' },
  { value: 'Acer', label: 'Acer' },
  { value: 'Asus', label: 'Asus' },
  { value: 'Intel', label: 'Intel' },
  { value: 'Other', label: 'Other' },
];

const DEFAULT_CATEGORIES = [
  { value: 'laptop', label: 'Laptops' },
  { value: 'desktop', label: 'Desktops' },
  { value: 'monitor', label: 'Monitors' },
  { value: 'components', label: 'Components' },
  { value: 'accessories', label: 'Accessories' },
];

const INITIAL_FORM_STATE = {
  name: '',
  slug: '',
  category: 'laptop',
  description: '',
  price: '',
  offerPrice: '',
  brand: 'Dell',
  SKU: '',
  stock: 10,
  rating: 4.5,
  status: 'Active',
  featured: false,
  features: [''],
  specifications: [{ key: '', value: '' }],
  seoTitle: '',
  seoDescription: '',
  image: '',
  imagePublicId: '',
  gallery: [],
};

const Products = () => {
  const [categoryOptions, setCategoryOptions] = useState(DEFAULT_CATEGORIES);
  const [brandOptions, setBrandOptions] = useState(DEFAULT_BRANDS);
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

  // Drawer state
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
    } catch {
      showToast('Failed to load products list.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoriesAndBrands = async () => {
    try {
      const cats = await categoryService.getCategories();
      if (cats && cats.length > 0) {
        setCategoryOptions(cats.map((c) => ({ value: c.name.toLowerCase(), label: c.name })));
      }
      const prods = await productService.getProducts();
      const brandSet = {};
      prods.forEach((p) => { if (p.brand) brandSet[p.brand] = true; });

      const mergedBrands = [...DEFAULT_BRANDS];
      Object.keys(brandSet).forEach((b) => {
        if (!mergedBrands.some((mb) => mb.value.toLowerCase() === b.toLowerCase())) {
          mergedBrands.push({ value: b, label: b });
        }
      });
      setBrandOptions(mergedBrands);
    } catch {
      // Use defaults if failed
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategoriesAndBrands();
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
        SKU: prev.SKU || `EG-${(prev.brand || 'GEN').substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
        seoTitle: `${prev.name} - Egreen Technology`,
        seoDescription: `Buy ${prev.name} online at wholesale rates. 100% genuine guaranteed.`,
      }));
    }
  }, [formData.name, formData.brand, drawerMode]);

  // Brand filter counts
  const brandCounts = { all: products.length };
  products.forEach((p) => {
    if (p.brand) {
      brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1;
    }
  });

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.SKU || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = selectedBrandFilter === 'all' || (p.brand && p.brand.toLowerCase() === selectedBrandFilter.toLowerCase());
    return matchesSearch && matchesBrand;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let valA = a[sortBy] || '';
    let valB = b[sortBy] || '';

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
    currentPage * itemsPerPage
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
      name: product.name || '',
      slug: product.slug || '',
      category: product.category || 'laptop',
      description: product.description || '',
      price: product.price || '',
      offerPrice: product.offerPrice || '',
      brand: product.brand || 'Dell',
      SKU: product.SKU || '',
      stock: product.stock || 0,
      rating: product.rating || 4.5,
      status: product.status || 'Active',
      featured: product.featured || false,
      features: product.features && product.features.length ? product.features : [''],
      specifications: product.specifications && product.specifications.length ? product.specifications : [{ key: '', value: '' }],
      seoTitle: product.seoTitle || '',
      seoDescription: product.seoDescription || '',
      image: product.image || '',
      imagePublicId: product.imagePublicId || '',
      gallery: product.gallery || [],
    });
    setWizardStep(0);
    setDrawerMode('edit');
    setCurrentId(product.id);
    setDrawerOpen(true);
  };

  const openViewDrawer = (product) => {
    setFormData(product);
    setDrawerMode('view');
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      showToast('Deleting Product...', 'loading');
      if (productToDelete.imagePublicId) {
        imageService.deleteImage(productToDelete.imagePublicId);
      }
      await productService.deleteProduct(productToDelete.id);
      showToast('Product Deleted Successfully', 'success');
      fetchProducts();
      setDeleteModalOpen(false);
    } catch {
      showToast('Failed to delete product.', 'error');
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setImageUploading(true);
      showToast('Uploading image...', 'loading');
      const { url, publicId } = await imageService.uploadImage(file);
      setFormData((prev) => ({ ...prev, image: url, imagePublicId: publicId }));
      showToast('Image uploaded successfully', 'success');
    } catch {
      showToast('Image upload failed.', 'error');
    } finally {
      setImageUploading(false);
    }
  };

  const addSpecField = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { key: '', value: '' }],
    }));
  };

  const removeSpecField = (idx) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== idx),
    }));
  };

  const handleSpecChange = (idx, field, value) => {
    setFormData((prev) => {
      const list = [...prev.specifications];
      list[idx][field] = value;
      return { ...prev, specifications: list };
    });
  };

  const addFeatureField = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, ''],
    }));
  };

  const removeFeatureField = (idx) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== idx),
    }));
  };

  const handleFeatureChange = (idx, value) => {
    setFormData((prev) => {
      const list = [...prev.features];
      list[idx] = value;
      return { ...prev, features: list };
    });
  };

  const handleFormSubmit = async (e) => {
    if (e) e.preventDefault();

    const cleanSpecs = formData.specifications.filter((s) => s.key.trim() && s.value.trim());
    const cleanFeats = formData.features.filter((f) => f.trim());

    const submissionData = {
      ...formData,
      price: parseFloat(formData.price || 0),
      offerPrice: formData.offerPrice ? parseFloat(formData.offerPrice) : null,
      stock: parseInt(formData.stock || 0),
      rating: parseFloat(formData.rating || 4.5),
      specifications: cleanSpecs,
      features: cleanFeats,
    };

    const errors = validateProduct(submissionData);
    if (Object.keys(errors).length > 0) {
      const firstErr = Object.values(errors)[0];
      showToast(firstErr, 'error');
      return;
    }

    try {
      showToast(drawerMode === 'create' ? 'Creating Product...' : 'Saving Changes...', 'loading');
      if (drawerMode === 'create') {
        await productService.createProduct(submissionData);
        showToast('Product Created Successfully', 'success');
      } else {
        await productService.updateProduct(currentId, submissionData);
        showToast('Product Updated Successfully', 'success');
      }
      fetchProducts();
      setDrawerOpen(false);
    } catch {
      showToast('Failed to save product configurations.', 'error');
    }
  };

  const wizardStepsLabels = [
    { num: 1, title: 'Basic Info' },
    { num: 2, title: 'Specs & Stock' },
    { num: 3, title: 'Media' },
    { num: 4, title: 'Pricing' },
    { num: 5, title: 'Publishing' },
  ];

  const drawerTitle = drawerMode === 'create' ? 'Add New Product' : drawerMode === 'edit' ? `Edit: ${formData.name}` : `Product Details`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Page Header */}
      <AdminPageHeader
        title="Products Catalog"
        subtitle="Manage inventory, brand specifications, pricing, and product status."
        action={
          <Button variant="primary" size="md" icon={<Plus size={16} />} onClick={openCreateDrawer}>
            Add Product
          </Button>
        }
      />

      {/* Brand Filters Tabs Row */}
      {Object.keys(brandCounts).length > 1 && (
        <div className="admin-tabs">
          {Object.keys(brandCounts).map((brand) => (
            <button
              key={brand}
              onClick={() => {
                setSelectedBrandFilter(brand);
                setCurrentPage(1);
              }}
              className={`admin-tab-btn${selectedBrandFilter.toLowerCase() === brand.toLowerCase() ? ' active' : ''}`}
            >
              {brand === 'all' ? 'All Brands' : brand}
              <span
                style={{
                  marginLeft: 6,
                  padding: '1px 7px',
                  borderRadius: 99,
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  background: selectedBrandFilter.toLowerCase() === brand.toLowerCase() ? 'var(--color-primary)' : 'rgba(107,114,128,0.12)',
                  color: selectedBrandFilter.toLowerCase() === brand.toLowerCase() ? '#fff' : 'var(--color-muted)',
                }}
              >
                {brandCounts[brand]}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Products Table Card */}
      <Card>
        {/* Search controls */}
        <div style={{ display: 'flex', gap: 16, justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
          <div style={{ minWidth: 260, flex: 1, maxWidth: 400 }}>
            <Input
              placeholder="Search by name, SKU, or brand..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              icon={<Search size={16} />}
            />
          </div>

          <div style={{ width: 180 }}>
            <Select
              options={[
                { value: 'name', label: 'Sort by Name' },
                { value: 'price', label: 'Sort by Price' },
                { value: 'stock', label: 'Sort by Inventory' },
              ]}
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {loading ? (
          <SkeletonTable rows={itemsPerPage} cols={7} />
        ) : (
          <>
            {paginatedProducts.length === 0 ? (
              <EmptyState
                title="No products found"
                description={searchTerm ? `No products matching "${searchTerm}".` : 'Start building your inventory catalog by adding your first product.'}
                action={
                  <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={openCreateDrawer}>
                    Add Product
                  </Button>
                }
              />
            ) : (
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}>
                        <input type="checkbox" className="admin-checkbox" style={{ margin: 0 }} />
                      </th>
                      <th style={{ cursor: 'pointer' }} onClick={() => handleSort('name')}>
                        Product {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th>Brand</th>
                      <th>Category</th>
                      <th style={{ cursor: 'pointer' }} onClick={() => handleSort('price')}>
                        Price {sortBy === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th style={{ cursor: 'pointer' }} onClick={() => handleSort('stock')}>
                        Stock {sortBy === 'stock' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedProducts.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <input type="checkbox" className="admin-checkbox" style={{ margin: 0 }} />
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            {p.image ? (
                              <img src={p.image} alt={p.name} className="admin-table-img" />
                            ) : (
                              <div className="admin-table-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-background)', color: 'var(--color-muted)', fontSize: '0.68rem', fontWeight: 600 }}>
                                No Image
                              </div>
                            )}
                            <div>
                              <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text)', marginBottom: 2 }}>{p.name}</strong>
                              <span style={{ fontSize: '0.72rem', color: 'var(--color-muted)' }}>SKU: {p.SKU || '-'}</span>
                            </div>
                          </div>
                        </td>
                        <td style={{ fontSize: '0.82rem', fontWeight: 600 }}>{p.brand}</td>
                        <td style={{ fontSize: '0.82rem', textTransform: 'capitalize' }}>
                          {categoryOptions.find((c) => c.value === p.category)?.label || p.category}
                        </td>
                        <td>
                          <span style={{ fontWeight: 700, color: 'var(--color-text)' }}>{formatPrice(p.price)}</span>
                          {p.offerPrice && (
                            <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--color-danger)', textDecoration: 'line-through' }}>{formatPrice(p.offerPrice)}</span>
                          )}
                        </td>
                        <td>
                          <span style={{ fontWeight: 600, color: p.stock === 0 ? 'var(--color-danger)' : p.stock < 5 ? 'var(--color-warning)' : 'var(--color-text)' }}>
                            {p.stock === 0 ? 'Out of stock' : `${p.stock} units`}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                            <Badge variant={p.status === 'Active' ? 'success' : 'warning'}>{p.status}</Badge>
                            {p.featured && <Badge variant="primary">Featured</Badge>}
                          </div>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
                            <Button variant="ghost" size="sm" title="View details" onClick={() => openViewDrawer(p)}>
                              <Eye size={13} />
                            </Button>
                            <Button variant="ghost" size="sm" title="Edit details" onClick={() => openEditDrawer(p)}>
                              <Edit2 size={13} />
                            </Button>
                            <Button variant="ghost" size="sm" title="Delete" style={{ color: 'var(--color-danger)' }} onClick={() => handleDeleteClick(p)}>
                              <Trash2 size={13} />
                            </Button>
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, fontSize: '0.78rem', color: 'var(--color-muted)' }}>
                <span>
                  Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length}
                </span>
                <div style={{ display: 'flex', gap: 4 }}>
                  <Button variant="secondary" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}>
                    <ChevronLeft size={14} />
                  </Button>
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <Button
                      key={idx}
                      variant={currentPage === idx + 1 ? 'primary' : 'secondary'}
                      size="sm"
                      style={{ minWidth: '32px', padding: '0 8px' }}
                      onClick={() => setCurrentPage(idx + 1)}
                    >
                      {idx + 1}
                    </Button>
                  ))}
                  <Button variant="secondary" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}>
                    <ChevronRight size={14} />
                  </Button>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <Button variant="secondary" size="sm" onClick={closeDrawer}>
                Discard
              </Button>
              <div style={{ display: 'flex', gap: 8 }}>
                {wizardStep > 0 && (
                  <Button variant="secondary" size="sm" onClick={() => setWizardStep((s) => s - 1)}>
                    Back
                  </Button>
                )}
                {wizardStep < wizardStepsLabels.length - 1 ? (
                  <Button variant="primary" size="sm" onClick={() => setWizardStep((s) => s + 1)}>
                    Next Step →
                  </Button>
                ) : (
                  <Button variant="primary" size="sm" onClick={handleFormSubmit}>
                    {drawerMode === 'create' ? 'Create Product' : 'Save Changes'}
                  </Button>
                )}
              </div>
            </div>
          )
        }
      >
        {drawerMode === 'view' ? (
          /* Read-only details view */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {formData.image && (
              <div style={{ width: '100%', height: 200, borderRadius: 'var(--radius-card)', overflow: 'hidden', border: '1px solid var(--color-border)', marginBottom: 8 }}>
                <img src={formData.image} alt={formData.name} style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#fff' }} />
              </div>
            )}
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Product Name</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-text)' }}>{formData.name}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Brand</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)' }}>{formData.brand}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Category</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)', textTransform: 'capitalize' }}>{formData.category}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Price</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-primary)' }}>{formatPrice(formData.price)}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Stock</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)' }}>{formData.stock} units</div>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Description</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-muted)', lineHeight: 1.6 }}>{formData.description}</div>
            </div>
            <div style={{ display: 'flex', gap: 8, paddingTop: 16, borderTop: '1px solid var(--color-border)' }}>
              <Button variant="primary" size="sm" onClick={() => openEditDrawer(formData)}>
                Edit Product
              </Button>
              <Button variant="secondary" size="sm" onClick={closeDrawer}>
                Close
              </Button>
            </div>
          </div>
        ) : (
          /* Edit/Create Form with Wizard Steps */
          <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Step Wizard Navigation Header */}
            <div className="admin-form-wizard-headers">
              {wizardStepsLabels.map((step, idx) => {
                const isCompleted = idx < wizardStep;
                const isCurrent = idx === wizardStep;
                return (
                  <button
                    key={idx}
                    type="button"
                    className={`admin-form-wizard-header${isCurrent ? ' active' : ''}`}
                    onClick={() => setWizardStep(idx)}
                  >
                    <span className="admin-form-wizard-header-num" style={isCompleted ? { background: 'var(--color-success)', color: '#fff' } : undefined}>
                      {isCompleted ? <Check size={11} /> : step.num}
                    </span>
                    <span>{step.title}</span>
                  </button>
                );
              })}
            </div>

            {/* STEP 0: Basic Info */}
            {wizardStep === 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 20 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <Input
                    label="Product Name *"
                    placeholder="e.g. Dell Inspiron 15 3530"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    required
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <Select
                      label="Product Brand *"
                      options={brandOptions}
                      value={formData.brand}
                      onChange={(e) => setFormData((prev) => ({ ...prev, brand: e.target.value }))}
                      required
                    />
                    <Select
                      label="Category *"
                      options={categoryOptions}
                      value={formData.category}
                      onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                      required
                    />
                  </div>
                  <Textarea
                    label="Short Description *"
                    placeholder="Powerful and reliable laptop for work and entertainment..."
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    required
                    rows={4}
                  />
                </div>

                {/* Right side helper card */}
                <div style={{ padding: 16, borderRadius: 'var(--radius-card)', background: 'var(--color-primary-light)', border: '1px solid rgba(37,99,235,0.2)', height: 'fit-content' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-primary-hover)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
                    Basic Info Tips
                  </div>
                  <ul style={{ fontSize: '0.78rem', color: 'var(--color-muted)', paddingLeft: 16, margin: 0, display: 'flex', flexDirection: 'column', gap: 8, lineHeight: 1.5 }}>
                    <li>Keep product name descriptive with brand and model number.</li>
                    <li>Ensure category and brand are correct for catalog filtering.</li>
                    <li>Write a concise description highlighting condition and key specs.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* STEP 1: Specifications & Stock */}
            {wizardStep === 1 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 20 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <Input
                      label="SKU Identifier *"
                      value={formData.SKU}
                      onChange={(e) => setFormData((prev) => ({ ...prev, SKU: e.target.value }))}
                      required
                    />
                    <Input
                      label="Stock Quantity *"
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData((prev) => ({ ...prev, stock: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text)' }}>Technical Specifications</label>
                      <Button variant="ghost" size="sm" icon={<Plus size={12} />} onClick={addSpecField}>
                        Add Spec
                      </Button>
                    </div>
                    {formData.specifications.map((spec, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                        <input
                          type="text"
                          className="admin-input"
                          style={{ flex: 1 }}
                          placeholder="Key (e.g. RAM)"
                          value={spec.key}
                          onChange={(e) => handleSpecChange(idx, 'key', e.target.value)}
                        />
                        <input
                          type="text"
                          className="admin-input"
                          style={{ flex: 2 }}
                          placeholder="Value (e.g. 16GB DDR4)"
                          value={spec.value}
                          onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                        />
                        {formData.specifications.length > 1 && (
                          <Button variant="ghost" size="sm" onClick={() => removeSpecField(idx)} style={{ color: 'var(--color-danger)' }}>
                            <Trash2 size={14} />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text)' }}>Key Highlights / Features</label>
                      <Button variant="ghost" size="sm" icon={<Plus size={12} />} onClick={addFeatureField}>
                        Add Highlight
                      </Button>
                    </div>
                    {formData.features.map((feat, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                        <input
                          type="text"
                          className="admin-input"
                          placeholder="e.g. 15.6 FHD 120Hz display"
                          value={feat}
                          onChange={(e) => handleFeatureChange(idx, e.target.value)}
                        />
                        {formData.features.length > 1 && (
                          <Button variant="ghost" size="sm" onClick={() => removeFeatureField(idx)} style={{ color: 'var(--color-danger)' }}>
                            <Trash2 size={14} />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right side helper card */}
                <div style={{ padding: 16, borderRadius: 'var(--radius-card)', background: 'var(--color-primary-light)', border: '1px solid rgba(37,99,235,0.2)', height: 'fit-content' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-primary-hover)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
                    Specs Guidelines
                  </div>
                  <ul style={{ fontSize: '0.78rem', color: 'var(--color-muted)', paddingLeft: 16, margin: 0, display: 'flex', flexDirection: 'column', gap: 8, lineHeight: 1.5 }}>
                    <li>SKUs are auto-generated but can be custom edited.</li>
                    <li>Low stock values (&lt; 5) show warning indicators.</li>
                    <li>Add technical specs like Processor, RAM, and Storage for buyer clarity.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* STEP 2: Media */}
            {wizardStep === 2 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 20 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text)' }}>Product Showcase Image</label>
                  {formData.image ? (
                    <div style={{ position: 'relative', width: '100%', maxWidth: 360, height: 220, borderRadius: 'var(--radius-card)', overflow: 'hidden', border: '1px solid var(--color-border)', background: '#fff' }}>
                      <img src={formData.image} alt="Upload Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      <button
                        type="button"
                        onClick={() => {
                          if (formData.imagePublicId) {
                            imageService.deleteImage(formData.imagePublicId);
                          }
                          setFormData((prev) => ({ ...prev, image: '', imagePublicId: '' }));
                        }}
                        style={{
                          position: 'absolute', top: 8, right: 8, background: 'rgba(239,68,68,0.9)', color: '#fff', border: 'none', borderRadius: '50%', width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                        }}
                        title="Remove Image"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <label className="admin-image-upload-zone">
                      <Upload size={32} color="var(--color-muted)" />
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)', marginTop: 8 }}>Click or Drag image here to upload</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-muted)' }}>PNG, JPG, WebP up to 5MB</span>
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

                {/* Right side helper card */}
                <div style={{ padding: 16, borderRadius: 'var(--radius-card)', background: 'var(--color-primary-light)', border: '1px solid rgba(37,99,235,0.2)', height: 'fit-content' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-primary-hover)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
                    Image Tips
                  </div>
                  <ul style={{ fontSize: '0.78rem', color: 'var(--color-muted)', paddingLeft: 16, margin: 0, display: 'flex', flexDirection: 'column', gap: 8, lineHeight: 1.5 }}>
                    <li>Use high-resolution photos on white or neutral backgrounds.</li>
                    <li>Proper images significantly boost buyer trust.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* STEP 3: Pricing */}
            {wizardStep === 3 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 20 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <Input
                      label="Regular Price (₹) *"
                      type="number"
                      placeholder="e.g. 45000"
                      value={formData.price}
                      onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                      required
                    />
                    <Input
                      label="Offer Price (₹)"
                      type="number"
                      placeholder="e.g. 39999"
                      value={formData.offerPrice}
                      onChange={(e) => setFormData((prev) => ({ ...prev, offerPrice: e.target.value }))}
                    />
                  </div>

                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '12px 14px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-input)', background: 'var(--color-background)' }}>
                    <input
                      type="checkbox"
                      className="admin-checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData((prev) => ({ ...prev, featured: e.target.checked }))}
                    />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)' }}>
                      Feature this product on Homepage Banners
                    </span>
                  </label>
                </div>

                {/* Right side helper card */}
                <div style={{ padding: 16, borderRadius: 'var(--radius-card)', background: 'var(--color-primary-light)', border: '1px solid rgba(37,99,235,0.2)', height: 'fit-content' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-primary-hover)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
                    Pricing Structure
                  </div>
                  <ul style={{ fontSize: '0.78rem', color: 'var(--color-muted)', paddingLeft: 16, margin: 0, display: 'flex', flexDirection: 'column', gap: 8, lineHeight: 1.5 }}>
                    <li>Regular price is shown as the standard list price.</li>
                    <li>If Offer Price is set, it displays with a strike-through discount badge.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* STEP 4: Publishing */}
            {wizardStep === 4 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 20 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <Select
                    label="Product Status"
                    options={[
                      { value: 'Active', label: 'Active (Visible on website)' },
                      { value: 'Draft', label: 'Draft (Hidden from catalog)' },
                      { value: 'Archived', label: 'Archived (Out of stock/Discontinued)' },
                    ]}
                    value={formData.status}
                    onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
                  />
                  <Input
                    label="Customer Rating (0 to 5)"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData((prev) => ({ ...prev, rating: e.target.value }))}
                  />
                  <Input
                    label="SEO Search Title"
                    value={formData.seoTitle}
                    onChange={(e) => setFormData((prev) => ({ ...prev, seoTitle: e.target.value }))}
                  />
                  <Textarea
                    label="SEO Meta Description"
                    value={formData.seoDescription}
                    onChange={(e) => setFormData((prev) => ({ ...prev, seoDescription: e.target.value }))}
                    rows={3}
                  />
                </div>

                {/* Right side helper card */}
                <div style={{ padding: 16, borderRadius: 'var(--radius-card)', background: 'var(--color-primary-light)', border: '1px solid rgba(37,99,235,0.2)', height: 'fit-content' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-primary-hover)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
                    Publishing Checklist
                  </div>
                  <ul style={{ fontSize: '0.78rem', color: 'var(--color-muted)', paddingLeft: 16, margin: 0, display: 'flex', flexDirection: 'column', gap: 8, lineHeight: 1.5 }}>
                    <li><strong>Active:</strong> Product appears immediately in search & catalog.</li>
                    <li><strong>Draft:</strong> Saves configuration without publishing live.</li>
                  </ul>
                </div>
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
