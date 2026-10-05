import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
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
  Layers,
} from 'lucide-react';
import { formatPrice, generateSlug } from '../../utils/helpers';
import { validateProduct } from '../../utils/validators';

const DEFAULT_BRANDS = [
  { value: 'Dell', label: 'Dell' },
  { value: 'Lenovo', label: 'Lenovo' },
  { value: 'HP', label: 'HP' },
  { value: 'Apple', label: 'Apple' },
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
  { value: 'monitors', label: 'Monitors' },
  { value: 'components', label: 'Components & SSDs' },
];

const INITIAL_FORM_STATE = {
  name: '',
  slug: '',
  category: 'laptop',
  description: '',
  price: '',
  offerPrice: '',
  warranty: '3 Years',
  pricingTiers: [
    {
      id: 'tier-1',
      name: 'Option 1 (Base Spec)',
      specs: '8GB RAM / 256GB SSD',
      price: '',
      offerPrice: '',
    },
    {
      id: 'tier-2',
      name: 'Option 2 (Upgraded Spec)',
      specs: '16GB RAM / 512GB SSD',
      price: '',
      offerPrice: '',
    },
  ],
  brand: 'Dell',
  SKU: '',
  stock: 10,
  rating: 4.5,
  status: 'Active',
  featured: false,
  features: [''],
<<<<<<< HEAD
  specifications: [{ key: '', value: '' }],
  variantGroups: [],
=======
  specifications: [
    { key: 'Processor', value: '' },
    { key: 'RAM', value: '' },
    { key: 'Storage', value: '' },
    { key: 'Warranty', value: '3 Years' },
  ],
>>>>>>> 5bb09e4a3d3ec739ad7c4a23ad1cd12c551b65b7
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
    const specsList = product.specifications && product.specifications.length
      ? product.specifications
      : [
          { key: 'Processor', value: '' },
          { key: 'RAM', value: '' },
          { key: 'Storage', value: '' },
          { key: 'Warranty', value: product.warranty || '3 Years' },
        ];

    const warrantySpec = specsList.find((s) => s.key && s.key.toLowerCase() === 'warranty');
    const warrantyVal = product.warranty || (warrantySpec ? warrantySpec.value : '3 Years');

    let pricingTiers = Array.isArray(product.pricingTiers) && product.pricingTiers.length > 0
      ? [...product.pricingTiers]
      : [];

    if (pricingTiers.length === 0) {
      pricingTiers = [
        {
          id: 'tier-1',
          name: 'Option 1 (Base Spec)',
          specs: product.specs || '',
          price: product.price || '',
          offerPrice: product.offerPrice || '',
        },
        {
          id: 'tier-2',
          name: 'Option 2 (Upgraded Spec)',
          specs: '',
          price: '',
          offerPrice: '',
        },
      ];
    } else if (pricingTiers.length === 1) {
      pricingTiers.push({
        id: 'tier-2',
        name: 'Option 2 (Upgraded Spec)',
        specs: '',
        price: '',
        offerPrice: '',
      });
    }

    setFormData({
      name: product.name || '',
      slug: product.slug || '',
      category: product.category || 'laptop',
      description: product.description || '',
      price: pricingTiers[0]?.price || product.price || '',
      offerPrice: pricingTiers[0]?.offerPrice || product.offerPrice || '',
      warranty: warrantyVal,
      pricingTiers: pricingTiers,
      brand: product.brand || 'Dell',
      SKU: product.SKU || '',
      stock: product.stock || 0,
      rating: product.rating || 4.5,
      status: product.status || 'Active',
      featured: product.featured || false,
      features: product.features && product.features.length ? product.features : [''],
<<<<<<< HEAD
      specifications: product.specifications && product.specifications.length ? product.specifications : [
        { key: 'Processor', value: '' },
        { key: 'RAM', value: '' },
        { key: 'Storage', value: '' },
      ],
      variantGroups: product.variantGroups || [],
=======
      specifications: specsList,
>>>>>>> 5bb09e4a3d3ec739ad7c4a23ad1cd12c551b65b7
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

  const handlePricingTierChange = (tierIdx, field, value) => {
    setFormData((prev) => {
      const updatedTiers = [...(prev.pricingTiers || [])];
      if (!updatedTiers[tierIdx]) {
        updatedTiers[tierIdx] = { id: `tier-${tierIdx + 1}`, name: '', specs: '', price: '', offerPrice: '' };
      }
      updatedTiers[tierIdx] = { ...updatedTiers[tierIdx], [field]: value };
      
      const updates = { pricingTiers: updatedTiers };
      if (tierIdx === 0 && (field === 'price' || field === 'offerPrice')) {
        updates[field] = value;
      }
      return { ...prev, ...updates };
    });
  };

  const handleWarrantyChange = (val) => {
    setFormData((prev) => {
      const updatedSpecs = [...(prev.specifications || [])];
      const wIdx = updatedSpecs.findIndex((s) => s.key && s.key.toLowerCase() === 'warranty');
      if (wIdx >= 0) {
        updatedSpecs[wIdx] = { ...updatedSpecs[wIdx], value: val };
      } else {
        updatedSpecs.push({ key: 'Warranty', value: val });
      }
      return { ...prev, warranty: val, specifications: updatedSpecs };
    });
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

    const cleanSpecs = (formData.specifications || []).filter((s) => s.key && s.key.trim() && s.value && s.value.trim());
    const cleanFeats = (formData.features || []).filter((f) => f && f.trim());

    // Clean pricing tiers
    const cleanPricingTiers = (formData.pricingTiers || []).map((t, idx) => ({
      id: t.id || `tier-${idx + 1}`,
      name: t.name || (idx === 0 ? 'Option 1 (Base Spec)' : 'Option 2 (Upgraded Spec)'),
      specs: t.specs || '',
      price: t.price !== '' && t.price != null ? parseFloat(t.price) : null,
      offerPrice: t.offerPrice !== '' && t.offerPrice != null ? parseFloat(t.offerPrice) : null,
    }));

    const primaryPrice = cleanPricingTiers[0]?.price != null 
      ? cleanPricingTiers[0].price 
      : (formData.price ? parseFloat(formData.price) : 0);

    const primaryOfferPrice = cleanPricingTiers[0]?.offerPrice != null 
      ? cleanPricingTiers[0].offerPrice 
      : (formData.offerPrice ? parseFloat(formData.offerPrice) : null);

    const submissionData = {
      ...formData,
      warranty: formData.warranty || '3 Years',
      pricingTiers: cleanPricingTiers,
      price: primaryPrice,
      offerPrice: primaryOfferPrice,
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

  const drawerTitle = drawerMode === 'create' ? 'Add New Product' : drawerMode === 'edit' ? `Edit: ${formData.name}` : `Product Details`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Page Header */}
      <AdminPageHeader
        title="Products Catalog"
        subtitle="Manage inventory, brand specifications, multi-spec pricing, and warranties."
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
          <SkeletonTable rows={itemsPerPage} cols={8} />
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
                      <th>Brand & Warranty</th>
                      <th>Category</th>
                      <th style={{ cursor: 'pointer' }} onClick={() => handleSort('price')}>
                        Spec Pricing {sortBy === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th style={{ cursor: 'pointer' }} onClick={() => handleSort('stock')}>
                        Stock {sortBy === 'stock' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedProducts.map((p) => {
                      const hasDualPricing = Array.isArray(p.pricingTiers) && p.pricingTiers.length > 1 && p.pricingTiers[1].price;
                      return (
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
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text)' }}>{p.brand}</span>
                              <span style={{ fontSize: '0.7rem', color: '#0284c7', background: '#f0f9ff', padding: '1px 6px', borderRadius: 4, width: 'fit-content', fontWeight: 600, border: '1px solid #bae6fd' }}>
                                🛡️ {p.warranty || '3 Years'}
                              </span>
                            </div>
                          </td>
                          <td style={{ fontSize: '0.82rem', textTransform: 'capitalize' }}>
                            {categoryOptions.find((c) => c.value === p.category)?.label || p.category}
                          </td>
                          <td>
                            {hasDualPricing ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <div style={{ fontSize: '0.78rem', color: '#1e293b', display: 'flex', alignItems: 'center', gap: 4 }}>
                                  <span style={{ fontWeight: 800, color: '#15803d' }}>{formatPrice(p.pricingTiers[0].price)}</span>
                                  <span style={{ fontSize: '0.68rem', color: '#64748b' }}>({p.pricingTiers[0].name ? p.pricingTiers[0].name.split('(')[0].trim() : 'Opt 1'})</span>
                                </div>
                                <div style={{ fontSize: '0.78rem', color: '#1e293b', display: 'flex', alignItems: 'center', gap: 4 }}>
                                  <span style={{ fontWeight: 800, color: '#2563eb' }}>{formatPrice(p.pricingTiers[1].price)}</span>
                                  <span style={{ fontSize: '0.68rem', color: '#64748b' }}>({p.pricingTiers[1].name ? p.pricingTiers[1].name.split('(')[0].trim() : 'Opt 2'})</span>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <span style={{ fontWeight: 700, color: 'var(--color-text)' }}>{formatPrice(p.price)}</span>
                                {p.offerPrice && (
                                  <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--color-danger)', textDecoration: 'line-through' }}>{formatPrice(p.offerPrice)}</span>
                                )}
                              </div>
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
                      );
                    })}
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
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-text)' }}>{formData.name}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Brand</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)' }}>{formData.brand}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Category</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)', textTransform: 'capitalize' }}>{formData.category}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Warranty</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0284c7' }}>🛡️ {formData.warranty || '3 Years'}</div>
              </div>
            </div>

            {/* Spec Pricing Options in View Drawer */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1e293b', textTransform: 'uppercase', marginBottom: 10 }}>
                💰 Configured Spec Pricing Options
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {(formData.pricingTiers || []).map((tier, idx) => (
                  <div key={idx} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 10 }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: idx === 0 ? '#15803d' : '#2563eb', marginBottom: 2 }}>
                      {tier.name || (idx === 0 ? 'Option 1' : 'Option 2')}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: 6 }}>
                      {tier.specs || 'Standard specifications'}
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#111827' }}>
                      {tier.price ? formatPrice(tier.price) : 'Price on request'}
                      {tier.offerPrice && (
                        <span style={{ fontSize: '0.72rem', color: '#94a3b8', textDecoration: 'line-through', marginLeft: 6 }}>
                          {formatPrice(tier.offerPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
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
          <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            
            {/* Section 1: Basic Information */}
            <div style={{ background: '#ffffff', padding: 18, borderRadius: 'var(--radius-card)', border: '1px solid var(--color-border)' }}>
              <h3 style={{ margin: '0 0 14px', fontSize: '0.92rem', fontWeight: 800, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>📦</span> Basic Information
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <Input
                  label="Product Name"
                  placeholder="e.g. HP 400G6 SSF ProDesk"
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

            {/* Section 2: Warranty Period (Editable) */}
            <div style={{ background: '#ffffff', padding: 18, borderRadius: 'var(--radius-card)', border: '1px solid var(--color-border)' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '0.92rem', fontWeight: 800, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>🛡️</span> Warranty Coverage (Editable)
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--color-muted)', marginTop: -4, marginBottom: 12 }}>
                Specify the warranty duration to display in the product details and assurance badges.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Input
                  label="Warranty Terms / Duration"
                  placeholder="e.g. 3 Years, 2 Years, 1 Year Enterprise Warranty"
                  value={formData.warranty}
                  onChange={(e) => handleWarrantyChange(e.target.value)}
                  required
                />
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-muted)', fontWeight: 600 }}>Quick Presets:</span>
                  {['3 Years', '3 Years Enterprise Warranty', '2 Years', '1 Year', '6 Months', '90 Days'].map((wPeriod) => (
                    <button
                      key={wPeriod}
                      type="button"
                      onClick={() => handleWarrantyChange(wPeriod)}
                      style={{
                        padding: '3px 9px',
                        borderRadius: 99,
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        background: formData.warranty === wPeriod ? '#dcfce7' : '#f1f5f9',
                        color: formData.warranty === wPeriod ? '#15803d' : '#475569',
                        border: formData.warranty === wPeriod ? '1px solid #86efac' : '1px solid #e2e8f0',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {formData.warranty === wPeriod ? '✓ ' : '+ '}{wPeriod}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 3: Dual-Spec Pricing Configurations */}
            <div style={{ background: '#ffffff', padding: 18, borderRadius: 'var(--radius-card)', border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <h3 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>💰</span> Dual-Spec Pricing Configurations
                </h3>
                <span style={{ fontSize: '0.7rem', color: '#15803d', fontWeight: 700, background: '#dcfce7', padding: '2px 8px', borderRadius: 6, border: '1px solid #86efac' }}>
                  2 Spec Tiers
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--color-muted)', marginBottom: 14 }}>
                Set two distinct price options for the same product based on different specification configurations (e.g. 8GB/256GB vs 16GB/512GB).
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                
                {/* Option 1: Base / Standard Spec */}
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#2563eb', color: '#fff', fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>1</span>
                      Option 1 (Base / Standard Configuration)
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#2563eb', fontWeight: 600, background: '#eff6ff', padding: '2px 7px', borderRadius: 4, border: '1px solid #bfdbfe' }}>Default Tier</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: 10, marginBottom: 10 }}>
                    <Input
                      label="Spec Option Label"
                      placeholder="e.g. 8GB RAM / 256GB SSD"
                      value={formData.pricingTiers?.[0]?.name || ''}
                      onChange={(e) => handlePricingTierChange(0, 'name', e.target.value)}
                      required
                    />
                    <Input
                      label="Specification Summary"
                      placeholder="e.g. Core i3, 8GB DDR4 RAM, 256GB SSD, Win 11"
                      value={formData.pricingTiers?.[0]?.specs || ''}
                      onChange={(e) => handlePricingTierChange(0, 'specs', e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <Input
                      label="Selling Price (₹)"
                      type="number"
                      placeholder="e.g. 23500"
                      value={formData.pricingTiers?.[0]?.price ?? ''}
                      onChange={(e) => handlePricingTierChange(0, 'price', e.target.value)}
                      required
                    />
                    <Input
                      label="MRP / Original Strikethrough (₹) (Optional)"
                      type="number"
                      placeholder="e.g. 27730"
                      value={formData.pricingTiers?.[0]?.offerPrice ?? ''}
                      onChange={(e) => handlePricingTierChange(0, 'offerPrice', e.target.value)}
                    />
                  </div>
                </div>

                {/* Option 2: Upgraded / Alternate Spec */}
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#16a34a', color: '#fff', fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>2</span>
                      Option 2 (Upgraded / Alternate Configuration)
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: 600, background: '#f0fdf4', padding: '2px 7px', borderRadius: 4, border: '1px solid #bbf7d0' }}>Alternate Tier</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: 10, marginBottom: 10 }}>
                    <Input
                      label="Spec Option Label"
                      placeholder="e.g. 16GB RAM / 512GB SSD"
                      value={formData.pricingTiers?.[1]?.name || ''}
                      onChange={(e) => handlePricingTierChange(1, 'name', e.target.value)}
                    />
                    <Input
                      label="Specification Summary"
                      placeholder="e.g. Core i3, 16GB DDR4 RAM, 512GB SSD, Win 11"
                      value={formData.pricingTiers?.[1]?.specs || ''}
                      onChange={(e) => handlePricingTierChange(1, 'specs', e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <Input
                      label="Selling Price (₹)"
                      type="number"
                      placeholder="e.g. 28500"
                      value={formData.pricingTiers?.[1]?.price ?? ''}
                      onChange={(e) => handlePricingTierChange(1, 'price', e.target.value)}
                    />
                    <Input
                      label="MRP / Original Strikethrough (₹) (Optional)"
                      type="number"
                      placeholder="e.g. 33000"
                      value={formData.pricingTiers?.[1]?.offerPrice ?? ''}
                      onChange={(e) => handlePricingTierChange(1, 'offerPrice', e.target.value)}
                    />
                  </div>
                </div>

              </div>

              {/* Stock, Status & SKU Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginTop: 14, paddingTop: 14, borderTop: '1px solid #f1f5f9' }}>
                <Input
                  label="Stock Quantity"
                  type="number"
                  placeholder="e.g. 10"
                  value={formData.stock}
                  onChange={(e) => setFormData((prev) => ({ ...prev, stock: e.target.value }))}
                  required
                />
                <Select
                  label="Status"
                  options={[
                    { value: 'Active', label: 'Active (Visible on website)' },
                    { value: 'Draft', label: 'Draft (Hidden from catalog)' },
                  ]}
                  value={formData.status}
                  onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
                />
                <Input
                  label="SKU Identifier"
                  placeholder="e.g. EG-HP-400G6"
                  value={formData.SKU}
                  onChange={(e) => setFormData((prev) => ({ ...prev, SKU: e.target.value }))}
                />
              </div>
            </div>

            {/* Section 4: Image Upload */}
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

            {/* Section 5: Technical Specifications */}
            <div style={{ background: '#ffffff', padding: 18, borderRadius: 'var(--radius-card)', border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>⚙️</span> Technical Specifications Table
                </h3>
                <Button type="button" variant="ghost" size="sm" icon={<Plus size={13} />} onClick={addSpecField}>
                  Add Row
                </Button>
              </div>

              {/* Quick Spec Presets */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)', alignSelf: 'center', fontWeight: 600 }}>Quick Add:</span>
                {['Processor', 'RAM', 'Storage', 'Condition', 'Display', 'Graphics', 'Operating System', 'Form Factor'].map((keyName) => (
                  <button
                    key={keyName}
                    type="button"
                    onClick={() => {
                      if (!formData.specifications.some((s) => s.key && s.key.toLowerCase() === keyName.toLowerCase())) {
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
                    placeholder="Feature (e.g. Processor)"
                    value={spec.key}
                    onChange={(e) => handleSpecChange(idx, 'key', e.target.value)}
                  />
                  <input
                    type="text"
                    className="admin-input"
                    style={{ flex: 2 }}
                    placeholder="Value (e.g. Intel Core i3)"
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

            {/* Section 5: Product Variants */}
            <div style={{ background: '#ffffff', padding: 18, borderRadius: 'var(--radius-card)', border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>🔀</span> Product Variants
                  <span style={{ fontSize: '0.7rem', fontWeight: 500, color: 'var(--color-muted)', marginLeft: 4 }}>(Optional — e.g. RAM, Storage)</span>
                </h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  icon={<Plus size={13} />}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      variantGroups: [
                        ...(prev.variantGroups || []),
                        { label: '', options: [{ value: '', priceOverride: '', specsOverride: '' }] },
                      ],
                    }))
                  }
                >
                  Add Group
                </Button>
              </div>

              {(!formData.variantGroups || formData.variantGroups.length === 0) && (
                <p style={{ fontSize: '0.78rem', color: 'var(--color-muted)', margin: '8px 0 0' }}>
                  No variants added. Add groups like "RAM / Memory" or "Storage" with options, optional price override and spec changes.
                </p>
              )}

              {(formData.variantGroups || []).map((group, gIdx) => (
                <div key={gIdx} style={{ border: '1px solid var(--color-border)', borderRadius: 8, padding: 14, marginBottom: 12 }}>
                  {/* Group Header */}
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
                    <input
                      type="text"
                      className="admin-input"
                      style={{ flex: 1 }}
                      placeholder="Group Label (e.g. RAM / Memory)"
                      value={group.label}
                      onChange={(e) => {
                        const updated = [...formData.variantGroups];
                        updated[gIdx] = { ...updated[gIdx], label: e.target.value };
                        setFormData((prev) => ({ ...prev, variantGroups: updated }));
                      }}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          variantGroups: prev.variantGroups.filter((_, i) => i !== gIdx),
                        }));
                      }}
                      style={{ color: 'var(--color-danger)', flexShrink: 0 }}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>

                  {/* Options */}
                  {(group.options || []).map((opt, oIdx) => (
                    <div key={oIdx} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 2fr auto', gap: 6, marginBottom: 6, alignItems: 'center' }}>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="Option (e.g. 8 GB)"
                        value={opt.value}
                        onChange={(e) => {
                          const updated = [...formData.variantGroups];
                          updated[gIdx].options[oIdx] = { ...updated[gIdx].options[oIdx], value: e.target.value };
                          setFormData((prev) => ({ ...prev, variantGroups: updated }));
                        }}
                      />
                      <input
                        type="number"
                        className="admin-input"
                        placeholder="Price ₹ (optional)"
                        value={opt.priceOverride}
                        onChange={(e) => {
                          const updated = [...formData.variantGroups];
                          updated[gIdx].options[oIdx] = { ...updated[gIdx].options[oIdx], priceOverride: e.target.value };
                          setFormData((prev) => ({ ...prev, variantGroups: updated }));
                        }}
                      />
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="Spec change (e.g. RAM: 8GB DDR4)"
                        value={opt.specsOverride}
                        onChange={(e) => {
                          const updated = [...formData.variantGroups];
                          updated[gIdx].options[oIdx] = { ...updated[gIdx].options[oIdx], specsOverride: e.target.value };
                          setFormData((prev) => ({ ...prev, variantGroups: updated }));
                        }}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const updated = [...formData.variantGroups];
                          updated[gIdx].options = updated[gIdx].options.filter((_, i) => i !== oIdx);
                          setFormData((prev) => ({ ...prev, variantGroups: updated }));
                        }}
                        style={{ color: 'var(--color-danger)' }}
                      >
                        <X size={12} />
                      </Button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...formData.variantGroups];
                      updated[gIdx].options = [...(updated[gIdx].options || []), { value: '', priceOverride: '', specsOverride: '' }];
                      setFormData((prev) => ({ ...prev, variantGroups: updated }));
                    }}
                    style={{
                      marginTop: 4, padding: '4px 10px', borderRadius: 99, fontSize: '0.72rem', fontWeight: 600,
                      background: 'var(--color-primary-light)', color: 'var(--color-primary)',
                      border: '1px solid rgba(37,99,235,0.2)', cursor: 'pointer'
                    }}
                  >
                    + Add Option
                  </button>
                </div>
              ))}
            </div>

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
