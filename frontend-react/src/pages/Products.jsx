import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
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

const Products = () => {
  const [loading, setLoading] = useState(true);
  const [productsList, setProductsList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentCategory, setCurrentCategory] = useState('all');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const categoryRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
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
        // Only display active products on customer facing side
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

  const filteredProducts = productsList.filter(p => {
    const matchCategory = currentCategory === 'all' || p.category === currentCategory;
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (p.rawSpecs && p.rawSpecs.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchCategory && matchSearch;
  });

  return (
    <>
      <div className="page-header" style={{ paddingBottom: '2rem' }}>
        <FadeUp className="container visible">
          <h1 className="h1">Our Products</h1>
          <p style={{ fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto' }}>Premium enterprise hardware solutions for your business needs.</p>
        </FadeUp>
      </div>

      <div className="container fade-up visible" style={{ marginTop: '-1.5rem', marginBottom: '3rem', position: 'relative', zIndex: 10 }}>
        <div className="unified-search-bar card">
          <div className="search-input-wrapper">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input
              type="text"
              placeholder="Search by model, brand, or specs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="search-divider"></div>
          <div className="custom-category-select" ref={categoryRef}>
            <div 
              className="custom-select-trigger" 
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
              <span>{categories.find(c => c.id === currentCategory)?.label}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`chevron ${isCategoryOpen ? 'open' : ''}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
            
            {isCategoryOpen && (
              <div className="custom-select-dropdown">
                {categories.map(category => (
                  <div 
                    key={category.id}
                    className={`custom-select-option ${currentCategory === category.id ? 'active' : ''}`}
                    onClick={() => {
                      setCurrentCategory(category.id);
                      setIsCategoryOpen(false);
                    }}
                  >
                    {category.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container fade-up visible" style={{ marginBottom: '4rem' }}>

        <div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <p>Loading products catalog...</p>
            </div>
          ) : (
            <div className="product-grid" style={{ marginTop: '0' }}>
              {filteredProducts.length === 0 ? (
                <p>No products found matching your criteria.</p>
              ) : (
                filteredProducts.map(p => (
                  <div key={p.id} className="compact-product-card fade-up visible">
                    {/* Media Header */}
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

                    {/* Card Content */}
                    <div className="cpc-body">
                      <div className="cpc-category">{p.categoryName || p.category || 'Hardware'}</div>
                      <h3 
                        className="cpc-title" 
                        onClick={() => setSelectedProduct(p)}
                        title={p.name}
                      >
                        {p.name}
                      </h3>

                      {/* Price & Stock Row */}
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

                      {/* Description / Spec snippet */}
                      <p className="cpc-desc">
                        {p.description || p.rawSpecs}
                      </p>

                      {/* Action Buttons Footer */}
                      <div className="cpc-actions">
                        <button 
                          type="button" 
                          className="cpc-btn-primary" 
                          onClick={() => setSelectedProduct(p)}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                          View Details
                        </button>

                        <a 
                          href={`https://wa.me/917942625065?text=${encodeURIComponent(`Hi, I would like to place an order for the product: ${p.name}. Please share order and payment details.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cpc-btn-secondary"
                          title="Order on WhatsApp"
                          style={{ gap: '4px', color: '#15803d', borderColor: '#bbf7d0', backgroundColor: '#f0fdf4' }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.333 4.993L2 22l5.233-1.237a9.96 9.96 0 004.779 1.217h.004c5.505 0 9.988-4.478 9.989-9.985 0-2.669-1.038-5.176-2.925-7.062A9.923 9.923 0 0012.012 2zm5.82 14.364c-.244.686-1.42 1.309-1.956 1.391-.502.076-1.144.109-1.841-.115-.427-.137-.978-.315-1.693-.625-2.986-1.293-4.93-4.321-5.08-4.52-.148-.2-1.218-1.621-1.218-3.091 0-1.47.77-2.194 1.042-2.494.272-.3.593-.375.79-.375.198 0 .395.002.567.01.183.008.428-.069.669.51.244.58.837 2.046.91 2.194.074.148.123.324.025.52-.099.196-.148.318-.296.491-.148.173-.312.387-.446.52-.148.148-.303.309-.13.606.173.297.77 1.272 1.652 2.057 1.134 1.01 2.091 1.323 2.388 1.47.297.148.47.123.643-.074.173-.198.742-.865.94-1.162.198-.297.396-.247.668-.148.272.099 1.73.816 2.027.964.297.148.495.222.568.346.074.124.074.717-.17 1.403z"/>
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

      {/* Amazon / Flipkart Product Details Modal */}
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

