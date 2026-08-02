import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/productService';
import FadeUp from '../components/FadeUp';

const Products = () => {
  const [loading, setLoading] = useState(true);
  const [productsList, setProductsList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentCategory, setCurrentCategory] = useState('all');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productService.getProducts();
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
                        p.description.toLowerCase().includes(searchTerm.toLowerCase());
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
          <div className="category-select-wrapper">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
            <select 
              value={currentCategory} 
              onChange={(e) => setCurrentCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="mini-pc">Mini PCs</option>
              <option value="thin-client">Thin Clients</option>
              <option value="desktop">Desktops</option>
              <option value="laptop">Laptops</option>
              <option value="processors">Processors</option>
              <option value="components">Components & SSDs</option>
            </select>
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
                  <div key={p.id} className="card product-card fade-up visible">
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="product-card-img" />
                    ) : (
                      <div style={{ height: '200px', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: '#9ca3af' }}>Image pending</span>
                      </div>
                    )}
                    <div className="product-card-body">
                      <div className="product-badges">
                        <span className="badge badge-condition" style={{ textTransform: 'capitalize' }}>
                          {p.specifications?.find(s => s.key.toLowerCase() === 'condition')?.value || 'Refurbished'}
                        </span>
                        <span className="badge badge-stock">
                          {p.stock === 0 ? 'Out of stock' : (p.stock < 5 ? 'Low Stock' : 'In Stock')}
                        </span>
                      </div>
                      <h3>{p.name}</h3>
                      <p style={{ maxHeight: '60px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {p.description}
                      </p>
                      <Link to={`/contact?product=${encodeURIComponent(p.name)}`} className="btn btn-outline">Request Quote</Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Products;
