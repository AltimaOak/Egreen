// Redesigned Admin Product CRUD Page - Shopify & Stripe Styled
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService } from '../../services/productService';
import { imageService } from '../../services/imageService';
import { useAdmin } from '../../contexts/AdminContext';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Eye, 
  X, 
  Upload, 
  ArrowUpDown,
  Filter,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Check
} from 'lucide-react';
import { formatPrice, generateSlug } from '../../utils/helpers';
import { validateProduct } from '../../utils/validators';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { TableSkeleton } from '../../components/admin/Skeleton';

const CATEGORIES = [
  { value: 'mini-pc', label: 'Mini PCs' },
  { value: 'thin-client', label: 'Thin Clients' },
  { value: 'desktop', label: 'Desktops' },
  { value: 'laptop', label: 'Laptops' },
  { value: 'processors', label: 'Processors' },
  { value: 'components', label: 'Components & SSDs' },
  { value: 'other', label: 'Other Accessories' }
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
  gallery: []
};

const Products = () => {
  const { showToast } = useAdmin();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Table view controls
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrandFilter, setSelectedBrandFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // CRUD overlay state
  const [viewState, setViewState] = useState('list'); // list, create, edit, details
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [imageUploading, setImageUploading] = useState(false);
  const [wizardStep, setWizardStep] = useState(0); // 0: Basic Info, 1: Specs, 2: Media, 3: Pricing, 4: Publish

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

  // Listen for navigation shortcuts (e.g. from topnav button)
  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'add') {
      handleCreateClick();
    }
    const query = searchParams.get('q');
    if (query) {
      setSearchTerm(query);
    }
  }, [searchParams]);

  // Sync SKU and SEO details automatically
  useEffect(() => {
    if (viewState === 'create' && formData.name) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(prev.name),
        SKU: prev.SKU || `EG-${prev.brand.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
        seoTitle: `${prev.name} - Egreen Technology`,
        seoDescription: `Buy ${prev.name} online at wholesale rates. 100% genuine guaranteed.`
      }));
    }
  }, [formData.name, formData.brand, viewState]);

  // Filters & calculations
  const brandCounts = {
    all: products.length,
    Dell: products.filter(p => p.brand === 'Dell').length,
    Lenovo: products.filter(p => p.brand === 'Lenovo').length,
    HP: products.filter(p => p.brand === 'HP').length,
    Acer: products.filter(p => p.brand === 'Acer' || p.brand === 'Asus').length || 22
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.SKU.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchTerm.toLowerCase());
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

  // Image Upload base64 helper
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setImageUploading(true);
    showToast('Uploading image...', 'loading');
    
    try {
      const base64 = await imageService.uploadImage(file);
      setFormData(prev => ({ ...prev, image: base64 }));
      showToast('Image uploaded successfully', 'success');
    } catch (err) {
      showToast(err.message || 'Image upload failed', 'error');
    } finally {
      setImageUploading(false);
    }
  };

  // Specs array helpers
  const handleSpecChange = (index, field, value) => {
    const updatedSpecs = [...formData.specifications];
    updatedSpecs[index][field] = value;
    setFormData(prev => ({ ...prev, specifications: updatedSpecs }));
  };

  const addSpecField = () => {
    setFormData(prev => ({
      ...prev,
      specifications: [...prev.specifications, { key: '', value: '' }]
    }));
  };

  const removeSpecField = (index) => {
    const updatedSpecs = formData.specifications.filter((_, idx) => idx !== index);
    setFormData(prev => ({ ...prev, specifications: updatedSpecs }));
  };

  // Features array helpers
  const handleFeatureChange = (index, value) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures[index] = value;
    setFormData(prev => ({ ...prev, features: updatedFeatures }));
  };

  const addFeatureField = () => {
    setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
  };

  const removeFeatureField = (index) => {
    const updatedFeatures = formData.features.filter((_, idx) => idx !== index);
    setFormData(prev => ({ ...prev, features: updatedFeatures }));
  };

  const handleCreateClick = () => {
    setFormData(INITIAL_FORM_STATE);
    setWizardStep(0);
    setViewState('create');
  };

  const handleEditClick = (product) => {
    setFormData({
      ...INITIAL_FORM_STATE,
      ...product,
      features: product.features && product.features.length > 0 ? product.features : [''],
      specifications: product.specifications && product.specifications.length > 0 ? product.specifications : [{ key: '', value: '' }]
    });
    setCurrentId(product.id);
    setWizardStep(0);
    setViewState('edit');
  };

  const handleViewClick = (product) => {
    setFormData(product);
    setViewState('details');
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
    
    // Filter out blank specs/features
    const cleanedSpecs = formData.specifications.filter(s => s.key.trim() !== '' && s.value.trim() !== '');
    const cleanedFeatures = formData.features.filter(f => f.trim() !== '');

    const finalData = {
      ...formData,
      price: parseFloat(formData.price),
      offerPrice: formData.offerPrice ? parseFloat(formData.offerPrice) : null,
      stock: parseInt(formData.stock),
      specifications: cleanedSpecs.length > 0 ? cleanedSpecs : [{ key: 'Specs', value: formData.description }],
      features: cleanedFeatures.length > 0 ? cleanedFeatures : ['Tested Quality']
    };

    const errors = validateProduct(finalData);
    if (errors.length > 0) {
      showToast(errors[0], 'error');
      return;
    }

    showToast('Saving Changes...', 'loading');
    try {
      if (viewState === 'create') {
        await productService.createProduct(finalData);
      } else {
        await productService.updateProduct(currentId, finalData);
      }
      
      showToast('Changes Published Successfully', 'success');
      setViewState('list');
      fetchProducts();
    } catch (e) {
      showToast('Failed to save product details.', 'error');
    }
  };

  // Steps headers details
  const wizardStepsLabels = [
    { title: 'Basic Info', num: 1 },
    { title: 'Specifications', num: 2 },
    { title: 'Media', num: 3 },
    { title: 'Pricing', num: 4 },
    { title: 'Publish', num: 5 }
  ];

  return (
    <div style={{ textAlign: 'left' }}>
      
      {/* 1. PRODUCT LISTING TABLE VIEW */}
      {viewState === 'list' && (
        <div>
          {/* Top Brand Filter Chips */}
          <div className="admin-filter-chips">
            {['all', 'Dell', 'Lenovo', 'HP', 'Acer'].map(brand => (
              <button 
                key={brand}
                className={`admin-filter-chip ${selectedBrandFilter === brand ? 'active' : ''}`}
                onClick={() => { setSelectedBrandFilter(brand); setCurrentPage(1); }}
              >
                {brand === 'all' ? 'All' : brand} ({brandCounts[brand] || 0})
              </button>
            ))}
          </div>

          <div className="admin-card">
            {/* Search and Sort toolbar */}
            <div className="flex justify-between items-center mb-4" style={{ flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-body)' }} />
                <input 
                  type="text" 
                  className="admin-input" 
                  style={{ paddingLeft: '36px' }}
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                />
              </div>

              <div className="flex gap-2">
                <select 
                  className="admin-select"
                  style={{ width: '140px' }}
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('-');
                    setSortBy(field);
                    setSortOrder(order);
                  }}
                >
                  <option value="name-asc">Sort: Name (A-Z)</option>
                  <option value="name-desc">Sort: Name (Z-A)</option>
                  <option value="price-asc">Sort: Price (Low-High)</option>
                  <option value="price-desc">Sort: Price (High-Low)</option>
                  <option value="stock-asc">Sort: Stock (Low-High)</option>
                  <option value="stock-desc">Sort: Stock (High-Low)</option>
                </select>

                <button className="admin-btn admin-btn-primary" onClick={handleCreateClick}>
                  <Plus size={16} /> Add Product
                </button>
              </div>
            </div>

            {loading ? (
              <TableSkeleton rows={itemsPerPage} />
            ) : filteredProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0', border: '1px dashed var(--admin-border)', borderRadius: '10px' }}>
                <p style={{ color: 'var(--admin-text-body)' }}>No products found matching the criteria.</p>
              </div>
            ) : (
              <div>
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th style={{ width: '40px' }}>
                          <input type="checkbox" className="admin-checkbox" style={{ margin: 0 }} />
                        </th>
                        <th>Product Details</th>
                        <th>Brand</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedProducts.map(p => (
                        <tr key={p.id}>
                          <td>
                            <input type="checkbox" className="admin-checkbox" style={{ margin: 0 }} />
                          </td>
                          <td>
                            <div className="flex items-center gap-2">
                              {p.image ? (
                                <img src={p.image} alt={p.name} className="admin-table-img" />
                              ) : (
                                <div className="admin-table-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--admin-bg)', color: 'var(--admin-text-body)', fontSize: '0.7rem' }}>
                                  No Image
                                </div>
                              )}
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <strong style={{ color: 'var(--admin-text-heading)', fontSize: '0.9rem' }}>{p.name}</strong>
                                <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-body)' }}>SKU: {p.SKU}</span>
                              </div>
                            </div>
                          </td>
                          <td>{p.brand}</td>
                          <td>
                            <span style={{ textTransform: 'capitalize' }}>
                              {CATEGORIES.find(c => c.value === p.category)?.label || p.category}
                            </span>
                          </td>
                          <td>
                            <span style={{ fontWeight: 600, color: 'var(--admin-text-heading)' }}>
                              {formatPrice(p.price)}
                            </span>
                            {p.offerPrice && (
                              <span style={{ display: 'block', textDecoration: 'line-through', fontSize: '0.75rem', color: '#EF4444' }}>
                                {formatPrice(p.offerPrice)}
                              </span>
                            )}
                          </td>
                          <td>
                            <span style={{ fontWeight: 500, color: p.stock === 0 ? '#EF4444' : (p.stock < 5 ? '#F59E0B' : 'var(--admin-text-heading)') }}>
                              {p.stock === 0 ? 'Out of stock' : `${p.stock} units`}
                            </span>
                          </td>
                          <td>
                            <span className={`admin-badge ${p.status === 'Active' ? 'admin-badge-success' : 'admin-badge-warning'}`}>
                              {p.status}
                            </span>
                            {p.featured && (
                              <span className="admin-badge admin-badge-info" style={{ marginLeft: '4px' }}>
                                Featured
                              </span>
                            )}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '8px' }}>
                              <button className="admin-btn admin-btn-secondary admin-btn-sm" style={{ padding: '4px 8px' }} title="View details" onClick={() => handleViewClick(p)}>
                                <Eye size={13} />
                              </button>
                              <button className="admin-btn admin-btn-secondary admin-btn-sm" style={{ padding: '4px 8px' }} title="Edit details" onClick={() => handleEditClick(p)}>
                                <Edit2 size={13} />
                              </button>
                              <button className="admin-btn admin-btn-secondary admin-btn-sm text-danger" style={{ padding: '4px 8px', color: '#EF4444' }} title="Delete" onClick={() => handleDeleteClick(p)}>
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-between items-center mt-4">
                    <span style={{ fontSize: '0.82rem', color: 'var(--admin-text-body)' }}>
                      Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} items
                    </span>
                    <div className="flex gap-2">
                      <button 
                        className="admin-btn admin-btn-secondary admin-btn-sm"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      >
                        <ChevronLeft size={16} />
                      </button>
                      {Array.from({ length: totalPages }).map((_, idx) => (
                        <button 
                          key={idx}
                          className={`admin-btn admin-btn-secondary admin-btn-sm ${currentPage === idx + 1 ? 'admin-btn-primary' : ''}`}
                          style={{ minWidth: '32px', padding: '6px' }}
                          onClick={() => setCurrentPage(idx + 1)}
                        >
                          {idx + 1}
                        </button>
                      ))}
                      <button 
                        className="admin-btn admin-btn-secondary admin-btn-sm"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. REDESIGNED WIZARD FORM: ADD & EDIT PRODUCT */}
      {(viewState === 'create' || viewState === 'edit') && (
        <div className="admin-card">
          {/* Header toolbar */}
          <div className="flex justify-between items-center mb-4" style={{ borderBottom: '1px solid var(--admin-border)', paddingBottom: '16px' }}>
            <h3 className="admin-modal-title">
              {viewState === 'create' ? 'Add New Product' : `Edit Product: ${formData.name}`}
            </h3>
            <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setViewState('list')}>
              <X size={16} /> Discard
            </button>
          </div>

          {/* Form Wizard Headers */}
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

          {/* Form Content layout split with Live Preview Card */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px', alignItems: 'start' }} className="grid-cols-2">
            
            {/* Left: Active Wizard Step Input fields */}
            <div>
              {/* STEP 0: Basic Info */}
              {wizardStep === 0 && (
                <div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Product Name</label>
                    <input 
                      type="text" 
                      className="admin-input" 
                      placeholder="e.g. Dell Inspiron 15 3530"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="grid-cols-2">
                    <div className="admin-form-group">
                      <label className="admin-form-label">Product Brand</label>
                      <select 
                        className="admin-select"
                        value={formData.brand}
                        onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                      >
                        {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-form-label">Category</label>
                      <select 
                        className="admin-select"
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      >
                        {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label className="admin-form-label">Short Description</label>
                    <textarea 
                      className="admin-textarea"
                      placeholder="Powerful and reliable laptop for work and entertainment..."
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      required
                    ></textarea>
                  </div>
                </div>
              )}

              {/* STEP 1: Specifications */}
              {wizardStep === 1 && (
                <div>
                  <div className="grid-cols-2">
                    <div className="admin-form-group">
                      <label className="admin-form-label">SKU Identifier</label>
                      <input 
                        type="text" 
                        className="admin-input"
                        value={formData.SKU}
                        onChange={(e) => setFormData(prev => ({ ...prev, SKU: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-form-label">Stock quantity</label>
                      <input 
                        type="number" 
                        className="admin-input"
                        value={formData.stock}
                        onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  {/* Specifications fields */}
                  <div className="admin-form-group">
                    <div className="flex justify-between items-center mb-2">
                      <label className="admin-form-label" style={{ marginBottom: 0 }}>Technical Specs</label>
                      <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={addSpecField}>
                        + Add Spec
                      </button>
                    </div>
                    {formData.specifications.map((spec, idx) => (
                      <div key={idx} className="flex gap-2" style={{ marginBottom: '8px' }}>
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
                          <button type="button" className="admin-btn admin-btn-secondary" style={{ padding: '8px', color: '#EF4444' }} onClick={() => removeSpecField(idx)}>
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Highlights list */}
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <div className="flex justify-between items-center mb-2">
                      <label className="admin-form-label" style={{ marginBottom: 0 }}>Highlights / Features</label>
                      <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={addFeatureField}>
                        + Add Highlight
                      </button>
                    </div>
                    {formData.features.map((feat, idx) => (
                      <div key={idx} className="flex gap-2" style={{ marginBottom: '8px' }}>
                        <input 
                          type="text" 
                          className="admin-input" 
                          placeholder="e.g. 15.6 FHD 120Hz display" 
                          value={feat}
                          onChange={(e) => handleFeatureChange(idx, e.target.value)}
                        />
                        {formData.features.length > 1 && (
                          <button type="button" className="admin-btn admin-btn-secondary" style={{ padding: '8px', color: '#EF4444' }} onClick={() => removeFeatureField(idx)}>
                            <Trash2 size={15} />
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
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label className="admin-form-label">Upload Product Image</label>
                    {formData.image ? (
                      <div style={{ position: 'relative', width: '100%', maxWidth: '360px', aspectRatio: '1.4', overflow: 'hidden', borderRadius: '10px', border: '1px solid var(--admin-border)' }}>
                        <img src={formData.image} alt="Upload Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button 
                          type="button" 
                          className="admin-image-delete-btn"
                          style={{ width: '28px', height: '28px', top: '10px', right: '10px' }}
                          onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                        >
                          <X size={15} />
                        </button>
                      </div>
                    ) : (
                      <div className="admin-image-upload-zone" style={{ padding: '40px 20px' }}>
                        <Upload size={28} color="var(--admin-text-body)" style={{ marginBottom: '8px' }} />
                        <span style={{ fontSize: '0.85rem', color: 'var(--admin-text-body)' }}>Select file from local system</span>
                        <input 
                          type="file" 
                          id="image-file-uploader" 
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={handleImageChange}
                          disabled={imageUploading}
                        />
                        <label htmlFor="image-file-uploader" className="admin-btn admin-btn-secondary admin-btn-sm" style={{ cursor: 'pointer', marginTop: '12px' }}>
                          Choose File
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 3: Pricing */}
              {wizardStep === 3 && (
                <div>
                  <div className="grid-cols-2">
                    <div className="admin-form-group">
                      <label className="admin-form-label">Regular Wholesaler Price (INR)</label>
                      <input 
                        type="number" 
                        className="admin-input" 
                        placeholder="e.g. 56990"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-form-label">Special Offer Price (INR)</label>
                      <input 
                        type="number" 
                        className="admin-input" 
                        placeholder="e.g. 52990"
                        value={formData.offerPrice}
                        onChange={(e) => setFormData(prev => ({ ...prev, offerPrice: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="admin-checkbox-group" style={{ marginBottom: 0 }}>
                    <input 
                      type="checkbox" 
                      id="featured" 
                      className="admin-checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                    />
                    <label htmlFor="featured" className="admin-form-label" style={{ marginBottom: 0, cursor: 'pointer' }}>
                      Highlight on Homepage slider
                    </label>
                  </div>
                </div>
              )}

              {/* STEP 4: Publish */}
              {wizardStep === 4 && (
                <div>
                  <div className="grid-cols-2">
                    <div className="admin-form-group">
                      <label className="admin-form-label">Publishing Status</label>
                      <select 
                        className="admin-select"
                        value={formData.status}
                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                      >
                        <option value="Active">Active (Live on website)</option>
                        <option value="Draft">Draft (Invisible)</option>
                        <option value="Archived">Archived (Deprioritized)</option>
                      </select>
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-form-label">Rating score</label>
                      <input 
                        type="number" 
                        step="0.1" 
                        className="admin-input"
                        value={formData.rating}
                        onChange={(e) => setFormData(prev => ({ ...prev, rating: e.target.value }))}
                      />
                    </div>
                  </div>

                  {/* SEO settings */}
                  <div className="admin-form-group">
                    <label className="admin-form-label">SEO Title</label>
                    <input 
                      type="text" 
                      className="admin-input" 
                      value={formData.seoTitle}
                      onChange={(e) => setFormData(prev => ({ ...prev, seoTitle: e.target.value }))}
                    />
                  </div>

                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label className="admin-form-label">SEO Meta Description</label>
                    <textarea 
                      className="admin-textarea"
                      style={{ minHeight: '60px' }}
                      value={formData.seoDescription}
                      onChange={(e) => setFormData(prev => ({ ...prev, seoDescription: e.target.value }))}
                    ></textarea>
                  </div>
                </div>
              )}

              {/* Navigation controls */}
              <div style={{ borderTop: '1px solid var(--admin-border)', marginTop: '24px', paddingTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                {wizardStep > 0 && (
                  <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setWizardStep(prev => prev - 1)}>
                    Back
                  </button>
                )}
                
                {wizardStep < 4 ? (
                  <button type="button" className="admin-btn admin-btn-primary" onClick={() => setWizardStep(prev => prev + 1)}>
                    Next
                  </button>
                ) : (
                  <button type="button" className="admin-btn admin-btn-primary" onClick={handleFormSubmit}>
                    Publish Product
                  </button>
                )}
              </div>
            </div>

            {/* Right: Live Preview Product Card */}
            <div className="admin-product-preview-column" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span className="admin-form-label" style={{ alignSelf: 'flex-start', marginBottom: '8px' }}>Product Card Preview</span>
              
              <div className="admin-product-preview-card">
                <div className="admin-product-preview-img-wrapper">
                  {formData.image ? (
                    <img src={formData.image} alt={formData.name || 'Preview'} />
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>Image Preview Area</span>
                  )}
                </div>
                <div className="admin-product-preview-body">
                  <div className="admin-product-preview-brand">{formData.brand || 'Brand'}</div>
                  <h4 className="admin-product-preview-title">{formData.name || 'Product Title Details'}</h4>
                  
                  <div style={{ display: 'flex', gap: '4px', color: '#F59E0B', fontSize: '0.75rem', margin: '4px 0 8px' }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                    <span style={{ color: '#6B7280', marginLeft: '4px' }}>({formData.rating || '4.5'})</span>
                  </div>

                  <div className="admin-product-preview-price-group">
                    <span className="admin-product-preview-price">
                      {formatPrice(formData.offerPrice || formData.price || 0)}
                    </span>
                    {formData.offerPrice && (
                      <span className="admin-product-preview-old-price">
                        {formatPrice(formData.price || 0)}
                      </span>
                    )}
                  </div>
                  
                  {formData.offerPrice && (
                    <span className="admin-badge admin-badge-danger" style={{ fontSize: '0.65rem', marginTop: '6px' }}>
                      Special Offer
                    </span>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 3. PRODUCT DETAILS READ-ONLY VIEW */}
      {viewState === 'details' && (
        <div className="admin-card">
          <div className="flex justify-between items-center mb-4" style={{ borderBottom: '1px solid var(--admin-border)', paddingBottom: '16px' }}>
            <h3 className="admin-modal-title">Product Details: {formData.name}</h3>
            <div className="flex gap-2">
              <button className="admin-btn admin-btn-primary admin-btn-sm" onClick={() => handleEditClick(formData)}>
                Edit Product
              </button>
              <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => setViewState('list')}>
                Close
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }} className="grid-cols-2">
            <div>
              {formData.image ? (
                <img src={formData.image} alt={formData.name} style={{ width: '100%', borderRadius: '10px', border: '1px solid var(--admin-border)', objectFit: 'contain' }} />
              ) : (
                <div style={{ width: '100%', height: '240px', backgroundColor: 'var(--admin-bg)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--admin-text-body)' }}>
                  No Image
                </div>
              )}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h4 style={{ color: 'var(--admin-text-heading)', fontSize: '1.25rem', marginBottom: '4px' }}>{formData.name}</h4>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--admin-text-heading)' }}>{formatPrice(formData.price)}</span>
                  {formData.offerPrice && <span style={{ textDecoration: 'line-through', color: '#EF4444' }}>{formatPrice(formData.offerPrice)}</span>}
                  <span style={{ fontSize: '0.82rem', color: 'var(--admin-text-body)', marginLeft: '12px' }}>({formData.stock} units available)</span>
                </div>
              </div>

              <div>
                <h5 style={{ fontWeight: 600, color: 'var(--admin-text-heading)', marginBottom: '4px' }}>Description</h5>
                <p style={{ color: 'var(--admin-text-body)', fontSize: '0.9rem' }}>{formData.description}</p>
              </div>

              {formData.specifications && formData.specifications.length > 0 && formData.specifications[0].key !== '' && (
                <div>
                  <h5 style={{ fontWeight: 600, color: 'var(--admin-text-heading)', marginBottom: '8px' }}>Specifications</h5>
                  <div className="admin-table-container">
                    <table className="admin-table">
                      <tbody>
                        {formData.specifications.map((spec, i) => (
                          <tr key={i}>
                            <td style={{ fontWeight: 600, width: '150px' }}>{spec.key}</td>
                            <td>{spec.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
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
