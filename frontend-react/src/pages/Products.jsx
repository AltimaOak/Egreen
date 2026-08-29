import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchCatalogProducts } from '../services/catalogService';
import FadeUp from '../components/FadeUp';
import ProductDetailsModal from '../components/ProductDetailsModal';

const categories = [
  { id: 'all', label: 'All Categories' },
  { id: 'mini-pc', label: 'Mini PCs' },
  { id: 'thin-client', label: 'Thin Clients' },
  { id: 'desktop', label: 'Desktops' },
  { id: 'laptop', label: 'Laptops' },
  { id: 'processors', label: 'Processors' },
  { id: 'components', label: 'Components & SSDs' }
];

const STANDARD_BRANDS = ['Dell', 'HP', 'Lenovo', 'Apple', 'Intel', 'Acer', 'Asus'];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [productsList, setProductsList] = useState([]);
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || searchParams.get('search') || '');
  const [currentCategory, setCurrentCategory] = useState(searchParams.get('category') || 'all');
  const [currentBrand, setCurrentBrand] = useState(searchParams.get('brand') || 'all');
  
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isBrandOpen, setIsBrandOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const categoryRef = useRef(null);
  const brandRef = useRef(null);

  useEffect(() => {
    const brandParam = searchParams.get('brand');
    const categoryParam = searchParams.get('category');
    const qParam = searchParams.get('q') || searchParams.get('search');

    if (brandParam && brandParam !== currentBrand) {
      setCurrentBrand(brandParam);
    }
    if (categoryParam && categoryParam !== currentCategory) {
      setCurrentCategory(categoryParam);
    }
    if (qParam != null && qParam !== searchTerm) {
      setSearchTerm(qParam);
    }
  }, [searchParams]);

  const updateUrlParams = (newCategory, newBrand, newSearch) => {
    const params = new URLSearchParams();
    if (newCategory && newCategory !== 'all') params.set('category', newCategory);
    if (newBrand && newBrand !== 'all') params.set('brand', newBrand);
    if (newSearch && newSearch.trim()) params.set('q', newSearch.trim());
    setSearchParams(params, { replace: true });
  };

  const handleCategoryChange = (catId) => {
    setCurrentCategory(catId);
    setIsCategoryOpen(false);
    updateUrlParams(catId, currentBrand, searchTerm);
  };

  const handleBrandChange = (brandName) => {
    setCurrentBrand(brandName);
    setIsBrandOpen(false);
    updateUrlParams(currentCategory, brandName, searchTerm);
  };

  const handleSearchChange = (val) => {
    setSearchTerm(val);
    updateUrlParams(currentCategory, currentBrand, val);
  };

  const clearAllFilters = () => {
    setCurrentCategory('all');
    setCurrentBrand('all');
    setSearchTerm('');
    setSearchParams({}, { replace: true });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
      if (brandRef.current && !brandRef.current.contains(event.target)) {
        setIsBrandOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchCatalogProducts();
        const active = data.filter(p => p.status === 'Active');
        setProductsList(active);
      } catch (err) {
        console.error('Error fetching products list', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const { brandCounts, availableBrands } = useMemo(() => {
    const counts = {};
    productsList.forEach(p => {
      if (p.brand) {
        counts[p.brand] = (counts[p.brand] || 0) + 1;
      }
    });

    const presentBrands = Object.keys(counts);
    const ordered = [
      ...STANDARD_BRANDS.filter(b => presentBrands.some(pb => pb.toLowerCase() === b.toLowerCase())),
      ...presentBrands.filter(pb => !STANDARD_BRANDS.some(sb => sb.toLowerCase() === pb.toLowerCase()))
    ];

    return { brandCounts: counts, availableBrands: ordered };
  }, [productsList]);

  const filteredProducts = useMemo(() => {
    return productsList.filter(p => {
      const matchCategory = currentCategory === 'all' || 
        (p.category && p.category.toLowerCase() === currentCategory.toLowerCase());

      const matchBrand = currentBrand === 'all' || 
        (p.brand && p.brand.toLowerCase() === currentBrand.toLowerCase());

      const query = searchTerm.trim().toLowerCase();
      const matchSearch = !query || 
        (p.name && p.name.toLowerCase().includes(query)) ||
        (p.description && p.description.toLowerCase().includes(query)) ||
        (p.brand && p.brand.toLowerCase().includes(query)) ||
        (p.rawSpecs && p.rawSpecs.toLowerCase().includes(query)) ||
        (p.sku && p.sku.toLowerCase().includes(query));

      return matchCategory && matchBrand && matchSearch;
    });
  }, [productsList, currentCategory, currentBrand, searchTerm]);

  const hasActiveFilters = currentCategory !== 'all' || currentBrand !== 'all' || Boolean(searchTerm.trim());

  return (
    <>
      <div className="page-header" style={{ padding: 'calc(var(--nav-height) + 1.75rem) 0 1.25rem' }}>
        <FadeUp className="container visible">
          <h1 className="h1" style={{ marginBottom: '0.35rem' }}>Our Products</h1>
          <p style={{ fontSize: '1rem', maxWidth: '600px', margin: '0 auto', color: '#64748b' }}>
            Premium enterprise hardware solutions for your business needs.
          </p>
        </FadeUp>
      </div>

      <div className="container fade-up visible" style={{ marginTop: '-1.25rem', marginBottom: '1.75rem', position: 'relative', zIndex: 10 }}>
        
        <div className="unified-search-bar card">
          
          <div className="search-input-wrapper">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search by model, brand, or specs..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => handleSearchChange('')}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4 }}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>          <div className="search-divider"></div>

          {/* Filter Selectors Group */}
          <div className="search-filters-group">
            {/* Category Dropdown */}
            <div className="custom-category-select" ref={categoryRef}>
              <div 
                className="custom-select-trigger" 
                onClick={() => {
                  setIsCategoryOpen(!isCategoryOpen);
                  setIsBrandOpen(false);
                }}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                </svg>
                <span className="select-trigger-label">{categories.find(c => c.id.toLowerCase() === currentCategory.toLowerCase())?.label || 'All Categories'}</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`chevron ${isCategoryOpen ? 'open' : ''}`}>
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
              
              {isCategoryOpen && (
                <div className="custom-select-dropdown">
                  {categories.map(category => (
                    <div 
                      key={category.id}
                      className={`custom-select-option ${currentCategory.toLowerCase() === category.id.toLowerCase() ? 'active' : ''}`}
                      onClick={() => handleCategoryChange(category.id)}
                    >
                      {category.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="search-divider search-divider-inner"></div>

            {/* Brand Dropdown */}
            <div className="custom-category-select" ref={brandRef}>
              <div 
                className="custom-select-trigger" 
                onClick={() => {
                  setIsBrandOpen(!isBrandOpen);
                  setIsCategoryOpen(false);
                }}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                <span className="select-trigger-label">{currentBrand === 'all' ? 'All Brands' : currentBrand}</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`chevron ${isBrandOpen ? 'open' : ''}`}>
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
              
              {isBrandOpen && (
                <div className="custom-select-dropdown">
                  <div 
                    className={`custom-select-option ${currentBrand === 'all' ? 'active' : ''}`}
                    onClick={() => handleBrandChange('all')}
                  >
                    All Brands ({productsList.length})
                  </div>
                  {availableBrands.map(brandName => (
                    <div 
                      key={brandName}
                      className={`custom-select-option ${currentBrand.toLowerCase() === brandName.toLowerCase() ? 'active' : ''}`}
                      onClick={() => handleBrandChange(brandName)}
                    >
                      {brandName} ({brandCounts[brandName] || 0})
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      <div className="container fade-up visible" style={{ marginBottom: '3.5rem' }}>

        {hasActiveFilters && (
          <div className="products-filter-summary">
            <div className="products-count-text">
              Showing <span className="products-count-highlight">{filteredProducts.length}</span> {filteredProducts.length === 1 ? 'product' : 'products'}
            </div>
            <div className="active-filter-chips">
              {currentBrand !== 'all' && (
                <div className="filter-chip">
                  <span>Brand: {currentBrand}</span>
                  <button type="button" className="filter-chip-remove" onClick={() => handleBrandChange('all')}>✕</button>
                </div>
              )}
              {currentCategory !== 'all' && (
                <div className="filter-chip">
                  <span>Category: {categories.find(c => c.id.toLowerCase() === currentCategory.toLowerCase())?.label || currentCategory}</span>
                  <button type="button" className="filter-chip-remove" onClick={() => handleCategoryChange('all')}>✕</button>
                </div>
              )}
              {searchTerm.trim() && (
                <div className="filter-chip">
                  <span>Search: "{searchTerm}"</span>
                  <button type="button" className="filter-chip-remove" onClick={() => handleSearchChange('')}>✕</button>
                </div>
              )}
              <button type="button" className="clear-all-filters-btn" onClick={clearAllFilters}>
                Reset All Filters
              </button>
            </div>
          </div>
        )}

        <div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ display: 'inline-block', width: 36, height: 36, border: '3px solid #e2e8f0', borderTopColor: 'var(--primary, #0284c7)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginBottom: 12 }}></div>
              <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Loading hardware catalog...</p>
            </div>
          ) : (
            <div className="product-grid" style={{ marginTop: '0' }}>
              {filteredProducts.length === 0 ? (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🔍</div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>No products found</h3>
                  <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: 460, margin: '0 auto 16px' }}>
                    We couldn't find any products matching your current brand, category, or search filters.
                  </p>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={clearAllFilters}
                    style={{ padding: '8px 18px', fontSize: '0.875rem' }}
                  >
                    View All Products
                  </button>
                </div>
              ) : (
                filteredProducts.map(p => (
                  <div key={p.id} className="compact-product-card fade-up visible">
                    <div 
                      className="cpc-media-box" 
                      onClick={() => setSelectedProduct(p)} 
                      title="Click to view full details"
                    >
                      {p.image ? (
                        <img src={p.image} alt={p.name} className="cpc-img" />
                      ) : (
                        <div className="cpc-no-img">
                          <span>Image Pending</span>
                        </div>
                      )}
                      <div className="cpc-top-badges">
                        <span className="cpc-badge-brand">{p.brand || 'Enterprise'}</span>
                        <span className="cpc-badge-condition">{p.condition || 'Refurbished'}</span>
                      </div>
                    </div>

                    <div className="cpc-body">
                      <div className="cpc-category">{p.categoryName || p.category || 'Hardware'}</div>
                      <h3 
                        className="cpc-title" 
                        onClick={() => setSelectedProduct(p)}
                        title={p.name}
                      >
                        {p.name}
                      </h3>

                      <div className="cpc-price-stock-row">
                        <div className="cpc-price">
                          {p.price ? (
                            <span>₹{Number(p.price).toLocaleString('en-IN')}</span>
                          ) : (
                            <span className="cpc-quote-tag">Price on Request</span>
                          )}
                        </div>
                        <div className={`cpc-stock-pill ${p.stock > 0 ? 'in' : 'out'}`}>
                          {p.stock > 0 ? '● In Stock' : '○ Out of stock'}
                        </div>
                      </div>

                      <p className="cpc-desc">
                        {p.description || p.rawSpecs}
                      </p>

                      <div className="cpc-actions">
                        <button 
                          type="button" 
                          className="cpc-btn-primary" 
                          onClick={() => setSelectedProduct(p)}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                          View Details
                        </button>

                        <a 
                          href={`https://wa.me/919867760106?text=${encodeURIComponent(`Hi, I would like to place an order for the product: ${p.name}. Please share order and payment details.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cpc-btn-secondary"
                          title="Order on WhatsApp"
                          style={{ gap: '4px', color: '#15803d', borderColor: '#bbf7d0', backgroundColor: '#f0fdf4' }}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.333 4.993L2 22l5.233-1.237a9.96 9.96 0 004.779 1.217h.004c5.505 0 9.988-4.478 9.989-9.985 0-2.669-1.038-5.176-2.925-7.062A9.923 9.923 0 0012.012 2zm5.82 14.364c-.244.686-1.42 1.309-1.956 1.391-.502.076-1.144.109-1.841-.115-.427-.137-.978-.315-1.693-.625-2.986-1.293-4.93-4.321-5.08-4.52-.148-.2-1.218-1.621-1.218-3.091 0-1.47.77-2.194 1.042-2.494.272-.3.593-.375.79-.375.198 0 .395.002.567.01.183.008.428-.069.669.51.244.58.837 2.046.91 2.194.074.148.123.324.025.52-.099.196-.148.318-.296.491-.148.173-.312.387-.446.52-.148.148-.303.309-.13.606.173.297.77 1.272 1.652 2.057 1.134 1.01 2.091 1.323 2.388 1.47.297.148.495.222.568.346.074.124.074.717-.17 1.403z"/>
                          </svg>
                          Order
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {selectedProduct && (
        <ProductDetailsModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </>
  );
};

export default Products;
