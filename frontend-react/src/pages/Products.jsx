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
                        (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()));
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

      <div className="container products-layout fade-up visible" style={{ marginTop: '2rem', marginBottom: '4rem' }}>
        <aside className="filter-section">
          <input 
            type="text" 
            className="search-bar" 
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <div className="card" style={{ padding: '24px' }}>
            <h3>Categories</h3>
            <div className="category-list">
              <button className={`category-btn ${currentCategory === 'all' ? 'active' : ''}`} onClick={() => setCurrentCategory('all')}>All Products</button>
              <button className={`category-btn ${currentCategory === 'mini-pc' ? 'active' : ''}`} onClick={() => setCurrentCategory('mini-pc')}>Mini PCs</button>
              <button className={`category-btn ${currentCategory === 'thin-client' ? 'active' : ''}`} onClick={() => setCurrentCategory('thin-client')}>Thin Clients</button>
              <button className={`category-btn ${currentCategory === 'desktop' ? 'active' : ''}`} onClick={() => setCurrentCategory('desktop')}>Desktops</button>
              <button className={`category-btn ${currentCategory === 'laptop' ? 'active' : ''}`} onClick={() => setCurrentCategory('laptop')}>Laptops</button>
              <button className={`category-btn ${currentCategory === 'processors' ? 'active' : ''}`} onClick={() => setCurrentCategory('processors')}>Processors</button>
              <button className={`category-btn ${currentCategory === 'components' ? 'active' : ''}`} onClick={() => setCurrentCategory('components')}>Components & SSDs</button>
            </div>
          </div>
        </aside>

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
