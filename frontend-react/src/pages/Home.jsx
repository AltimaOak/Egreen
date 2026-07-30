import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FadeUp from '../components/FadeUp';
import { pageService } from '../services/pageService';
import { productService } from '../services/productService';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [homepageData, setHomepageData] = useState(null);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const pageData = await pageService.getHomepage();
        const productsList = await productService.getProducts();
        
        setHomepageData(pageData);
        // Get active products flagged as featured
        const featured = productsList.filter(p => p.featured && p.status === 'Active').slice(0, 3);
        setFeaturedProducts(featured);
      } catch (err) {
        console.error('Error loading homepage data', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading || !homepageData) {
    return (
      <div style={{ padding: '120px 24px', textAlign: 'center' }}>
        <h2>Loading website content...</h2>
      </div>
    );
  }

  // Helper to check and render button links
  const renderLinkBtn = (text, path, primary = true) => {
    if (!text) return null;
    const className = primary ? 'btn btn-primary' : 'btn btn-outline';
    
    if (path.startsWith('http')) {
      return (
        <a href={path} target="_blank" rel="noreferrer" className={className}>
          {text}
        </a>
      );
    }
    return (
      <Link to={path} className={className}>
        {text}
      </Link>
    );
  };

  return (
    <>
      <section className="hero container" style={{ display: 'block', textAlign: 'center', maxWidth: '900px', margin: '0 auto', paddingTop: 'calc(var(--nav-height) + 6rem)' }}>
        <FadeUp className="hero-content visible">
          <h1 className="h1">{homepageData.heroTitle}</h1>
          <p>{homepageData.heroSubtitle}</p>
          <div className="hero-btns" style={{ justifyContent: 'center', marginTop: '2rem', gap: '12px', display: 'flex' }}>
            {renderLinkBtn(homepageData.heroBtnText, homepageData.heroBtnLink, true)}
            {renderLinkBtn(homepageData.ctaBtnText, homepageData.ctaBtnLink, false)}
          </div>
        </FadeUp>
      </section>

      <FadeUp className="trusted-by">
        <div className="container">
          <h3 className="h3" style={{ fontSize: '1.125rem', color: 'var(--text-body)' }}>Trusted By Businesses</h3>
          <div className="trusted-logos">
            <svg width="120" height="40" viewBox="0 0 120 40"><text x="0" y="30" fontFamily="Arial" fontSize="24" fontWeight="bold">Enterprise</text></svg>
            <svg width="120" height="40" viewBox="0 0 120 40"><text x="0" y="30" fontFamily="Arial" fontSize="24" fontWeight="bold">TechCorp</text></svg>
            <svg width="120" height="40" viewBox="0 0 120 40"><text x="0" y="30" fontFamily="Arial" fontSize="24" fontWeight="bold">GlobalSys</text></svg>
            <svg width="120" height="40" viewBox="0 0 120 40"><text x="0" y="30" fontFamily="Arial" fontSize="24" fontWeight="bold">DataNet</text></svg>
          </div>
        </div>
      </FadeUp>

      <section className="section-padding bg-muted">
        <div className="container">
          <FadeUp className="text-center" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
            <h2 className="h2">Features Section</h2>
            <p>We pride ourselves on providing the highest quality products and services.</p>
          </FadeUp>
          <FadeUp className="features-grid">
            {homepageData.offers.map((offer, idx) => (
              <div key={idx} className="card">
                <div className="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9 12l2 2 4-4"></path>
                  </svg>
                </div>
                <h3>{offer.title}</h3>
                <p>{offer.desc}</p>
              </div>
            ))}
          </FadeUp>
        </div>
      </section>

      {featuredProducts.length > 0 && (
        <FadeUp className="section-padding container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div>
              <h2 className="h2" style={{ marginBottom: '0' }}>Featured Hardware</h2>
            </div>
            <Link to="/products" className="btn btn-outline">View All Products</Link>
          </div>
          
          <div className="product-grid">
            {featuredProducts.map((p) => (
              <div key={p.id} className="card product-card">
                {p.image ? (
                  <img src={p.image} alt={p.name} className="product-card-img" />
                ) : (
                  <div style={{ height: '200px', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: '#9ca3af' }}>Image pending</span>
                  </div>
                )}
                <div className="product-card-body">
                  <h3>{p.name}</h3>
                  <p>{p.description}</p>
                  <Link to="/products" className="btn btn-outline" style={{ width: '100%', textAlign: 'center' }}>View Details</Link>
                </div>
              </div>
            ))}
          </div>
        </FadeUp>
      )}

      <section className="section-padding bg-muted">
        <FadeUp className="container split-section">
          <img src="/assets/warehouse_professional_1785088056986.png" alt="Warehouse" className="split-image" />
          <div>
            <h2 className="h2">Why Choose Us</h2>
            <p>We are dedicated to providing the best value in enterprise hardware.</p>
            <div className="reason-list">
              {['Quality Products', 'Competitive Prices', 'Industry Experience', 'Transparent Business', 'Reliable Delivery', 'Long-term Customer Relationships'].map((reason, index) => (
                <div key={index} className="reason-item">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  {reason}
                </div>
              ))}
            </div>
          </div>
        </FadeUp>
      </section>

      <FadeUp className="container">
        <section className="cta-section">
          <h2 className="h2">Need Reliable IT Hardware?</h2>
          <a href={`https://wa.me/${homepageData.ctaBtnLink ? homepageData.ctaBtnLink.replace(/[+\-\s]/g, '').replace('https://wa.me/', '') : '917942625065'}`} target="_blank" rel="noreferrer" className="btn btn-primary">Get a Free Quote</a>
        </section>
      </FadeUp>
    </>
  );
};

export default Home;
