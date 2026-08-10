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
  { value: 'mini-pc', label: 'Mini PCs' },
  { value: 'thin-client', label: 'Thin Clients' },
  { value: 'desktop', label: 'Desktops' },
  { value: 'laptop', label: 'Laptops' },
  { value: 'processors', label: 'Processors' },
  { value: 'components', label: 'Components & SSDs' },
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
        setCategoryOptions(cats.map((c) => ({ value: c.slug, label: c.name })));
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
      specifications: product.specifications && product.specifications.length ? product.specifications : [
        { key: 'Processor', value: '' },
        { key: 'RAM', value: '' },
        { key: 'Storage', value: '' },
      ],
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
    if (Array.isArray(errors) && errors.length > 0) {
      showToast(errors[0], 'error');
      return;
    }

    try {
      showToast(drawerMode === 'create' ? 'Creating Product...' : 'Saving Changes...', 'loading');
      let result;
      if (drawerMode === 'create') {
        result = await productService.createProduct(submissionData);
        showToast('Product Created Successfully', 'success');
      } else {
        result = await productService.updateProduct(currentId, submissionData);
        showToast('Product Updated Successfully', 'success');
      }

      if (result) {
        setProducts((prev) => {
          if (drawerMode === 'create') {
            return [result, ...prev];
          }
          return prev.map((p) => (p.id === currentId ? result : p));
        });
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
              <Button variant="secondary" size="md" onClick={closeDrawer}>
                Cancel
              </Button>
              <Button variant="primary" size="md" onClick={handleFormSubmit} style={{ paddingLeft: 24, paddingRight: 24 }}>
                <Check size={16} style={{ marginRight: 6 }} />
                {drawerMode === 'create' ? 'Save Product' : 'Save Changes'}
              </Button>
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
          /* Simple, User-Friendly Single-Page Form */
          <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            {/* Section 1: Basic Information */}
            <div style={{ background: '#ffffff', padding: 18, borderRadius: 'var(--radius-card)', border: '1px solid var(--color-border)' }}>
              <h3 style={{ margin: '0 0 14px', fontSize: '0.92rem', fontWeight: 800, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>📦</span> Basic Information
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <Input
                  label="Product Name"
                  placeholder="e.g. Dell OptiPlex 7090 Micro i5 11th Gen"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  required
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <Select
                    label="Brand"
                    options={brandOptions}
                    value={formData.brand}
                    onChange={(e) => setFormData((prev) => ({ ...prev, brand: e.target.value }))}
                    required
                  />
                  <Select
                    label="Category"
                    options={categoryOptions}
                    value={formData.category}
                    onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                    required
                  />
                </div>
                <Textarea
                  label="Product Description"
                  placeholder="Enter a brief summary of the product features, condition, and specs..."
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  required
                  rows={3}
                />
              </div>
            </div>

            {/* Section 2: Pricing & Stock */}
            <div style={{ background: '#ffffff', padding: 18, borderRadius: 'var(--radius-card)', border: '1px solid var(--color-border)' }}>
              <h3 style={{ margin: '0 0 14px', fontSize: '0.92rem', fontWeight: 800, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>💰</span> Pricing & Inventory
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <Input
                  label="Price (₹)"
                  type="number"
                  placeholder="e.g. 28500"
                  value={formData.price}
                  onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                  required
                />
                <Input
                  label="Offer Price (₹) (Optional)"
                  type="number"
                  placeholder="e.g. 24999"
                  value={formData.offerPrice}
                  onChange={(e) => setFormData((prev) => ({ ...prev, offerPrice: e.target.value }))}
                />
                <Input
                  label="Stock Quantity"
                  type="number"
                  placeholder="e.g. 10"
                  value={formData.stock}
                  onChange={(e) => setFormData((prev) => ({ ...prev, stock: e.target.value }))}
                  required
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
                <Select
                  label="Status"
                  options={[
                    { value: 'Active', label: 'Active (Visible to customers on website)' },
                    { value: 'Draft', label: 'Draft (Hidden from catalog)' },
                  ]}
                  value={formData.status}
                  onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
                />
                <Input
                  label="SKU Identifier (Auto-generated if blank)"
                  placeholder="e.g. EG-DELL-8921"
                  value={formData.SKU}
                  onChange={(e) => setFormData((prev) => ({ ...prev, SKU: e.target.value }))}
                />
              </div>
            </div>

            {/* Section 3: Image Upload */}
            <div style={{ background: '#ffffff', padding: 18, borderRadius: 'var(--radius-card)', border: '1px solid var(--color-border)' }}>
              <h3 style={{ margin: '0 0 14px', fontSize: '0.92rem', fontWeight: 800, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>🖼️</span> Product Photo
              </h3>
              {formData.image ? (
                <div style={{ position: 'relative', width: '100%', maxWidth: 300, height: 180, borderRadius: 'var(--radius-card)', overflow: 'hidden', border: '1px solid var(--color-border)', background: '#fff' }}>
                  <img src={formData.image} alt="Product Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
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
                    title="Remove Photo"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label className="admin-image-upload-zone" style={{ padding: '24px 16px' }}>
                  <Upload size={28} color="var(--color-muted)" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)', marginTop: 8 }}>Click to Select or Drag Image File</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-muted)' }}>PNG, JPG, WebP image up to 5MB</span>
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

            {/* Section 4: Specifications */}
            <div style={{ background: '#ffffff', padding: 18, borderRadius: 'var(--radius-card)', border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>⚙️</span> Technical Specifications
                </h3>
                <Button type="button" variant="ghost" size="sm" icon={<Plus size={13} />} onClick={addSpecField}>
                  Add Row
                </Button>
              </div>

              {/* Quick Spec Presets */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)', alignSelf: 'center', fontWeight: 600 }}>Quick Add:</span>
                {['Processor', 'RAM', 'Storage', 'Condition', 'Display', 'Graphics'].map((keyName) => (
                  <button
                    key={keyName}
                    type="button"
                    onClick={() => {
                      if (!formData.specifications.some((s) => s.key.toLowerCase() === keyName.toLowerCase())) {
                        setFormData((prev) => ({
                          ...prev,
                          specifications: [...prev.specifications, { key: keyName, value: '' }],
                        }));
                      }
                    }}
                    style={{
                      padding: '3px 9px', borderRadius: 99, fontSize: '0.72rem', fontWeight: 600,
                      background: 'var(--color-primary-light)', color: 'var(--color-primary)', border: '1px solid rgba(37,99,235,0.2)', cursor: 'pointer'
                    }}
                  >
                    + {keyName}
                  </button>
                ))}
              </div>

              {formData.specifications.map((spec, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <input
                    type="text"
                    className="admin-input"
                    style={{ flex: 1 }}
                    placeholder="Feature (e.g. RAM)"
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
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeSpecField(idx)} style={{ color: 'var(--color-danger)' }}>
                      <Trash2 size={14} />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Always visible Save button at the bottom of the form */}
            <div style={{ paddingTop: 8, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <Button type="button" variant="secondary" size="md" onClick={closeDrawer}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md" style={{ paddingLeft: 24, paddingRight: 24 }}>
                <Check size={16} style={{ marginRight: 6 }} />
                {drawerMode === 'create' ? 'Save Product' : 'Save Changes'}
              </Button>
            </div>

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
