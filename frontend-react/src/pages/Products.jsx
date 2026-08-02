import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { products } from '../data/products';
import FadeUp from '../components/FadeUp';

const categories = [
  { id: 'all', label: 'All Products' },
  { id: 'mini-pc', label: 'Mini PCs' },
  { id: 'thin-client', label: 'Thin Clients' },
  { id: 'desktop', label: 'Desktops' },
  { id: 'laptop', label: 'Laptops' },
  { id: 'processors', label: 'Processors' },
  { id: 'components', label: 'Components' },
];

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentCategory, setCurrentCategory] = useState('all');
  const [wishlist, setWishlist] = useState({});

  const toggleWishlist = (id) => {
    setWishlist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredProducts = products.filter(p => {
    const matchCategory = currentCategory === 'all' || p.category === currentCategory;
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        p.specs.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  const getCategoryCount = (catId) => {
    if (catId === 'all') return products.length;
    return products.filter(p => p.category === catId).length;
  };

  return (
    <>
      <div className="products-hero-banner">
        <div className="container">
          <FadeUp className="products-hero-inner visible">
            <h1 className="products-hero-title">
              Hardware Solutions <span className="gradient-text">Built for Performance</span>
            </h1>
            <p className="products-hero-desc">
              Explore certified enterprise thin clients, mini PCs, workstations, and high-density components.
            </p>
          </FadeUp>
        </div>
      </div>

      <div className="container products-layout fade-up visible">
        <div className="products-controls-top">
          <div className="search-container top-search">
            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input 
              type="text" 
              className="search-bar-with-icon" 
              placeholder="Search products by model, brand, or specs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="clear-search-btn" onClick={() => setSearchTerm('')} aria-label="Clear search">
                ✕
              </button>
            )}
          </div>
          
          <div className="category-pills">
            {categories.map(cat => {
              const count = getCategoryCount(cat.id);
              return (
                <button 
                  key={cat.id}
                  className={`category-pill ${currentCategory === cat.id ? 'active' : ''}`} 
                  onClick={() => setCurrentCategory(cat.id)}
                >
                  <span>{cat.label}</span>
                  <span className="pill-count">{count}</span>
                </button>
              );
            })}
          </div>

          <div className="results-summary-bar">
            <span className="results-count">
              Showing <strong>{filteredProducts.length}</strong> of <strong>{products.length}</strong> products
            </span>
          </div>
        </div>

        <div className="product-grid">
          {filteredProducts.length === 0 ? (
            <div className="no-products-box card">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
              <h3>No products found</h3>
              <p>Try adjusting your search criteria or switching categories.</p>
              <button className="btn btn-outline" onClick={() => { setSearchTerm(''); setCurrentCategory('all'); }}>
                Reset Filters
              </button>
            </div>
          ) : (
            filteredProducts.map(p => (
              <div key={p.id} className="card product-card fade-up visible">
                <div className="product-card-img-wrapper">
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="product-card-img" />
                  ) : (
                    <div className="product-card-img-placeholder">
                      <span>Image pending</span>
                    </div>
                  )}
                  <button 
                    className={`wishlist-btn ${wishlist[p.id] ? 'active' : ''}`} 
                    onClick={() => toggleWishlist(p.id)}
                    aria-label="Add to wishlist"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill={wishlist[p.id] ? "#ef4444" : "none"} stroke={wishlist[p.id] ? "#ef4444" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                  </button>
                </div>
                <div className="product-card-body">
                  <div className="product-badges">
                    <span className={`badge badge-condition ${p.condition === 'New' ? 'badge-new' : ''}`}>
                      {p.condition}
                    </span>
                    <span className={`badge badge-stock ${p.stock === 'Low Stock' ? 'badge-low-stock' : ''}`}>
                      <span className={`status-dot ${p.stock === 'In Stock' ? 'dot-green' : 'dot-amber'}`}></span>
                      {p.stock}
                    </span>
                  </div>
                  <h3>{p.name}</h3>
                  <p className="product-specs">{p.specs}</p>
                  <Link to={`/contact?product=${encodeURIComponent(p.name)}`} className="btn quote-btn">
                    Request Quote
                    <svg className="arrow-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="container">
        <div className="features-banner card">
          <div className="feature-banner-item">
            <div className="feature-banner-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            </div>
            <div className="feature-banner-text">
              <h4>Quality Assured</h4>
              <p>Tested & certified for reliable performance</p>
            </div>
          </div>
          <div className="feature-banner-item">
            <div className="feature-banner-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
            </div>
            <div className="feature-banner-text">
              <h4>Fast Shipping</h4>
              <p>Quick and secure delivery nationwide</p>
            </div>
          </div>
          <div className="feature-banner-item">
            <div className="feature-banner-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
            </div>
            <div className="feature-banner-text">
              <h4>Warranty Support</h4>
              <p>Reliable warranty on all products</p>
            </div>
          </div>
          <div className="feature-banner-item">
            <div className="feature-banner-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>
            </div>
            <div className="feature-banner-text">
              <h4>Expert Support</h4>
              <p>Dedicated support whenever you need it</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Products;
