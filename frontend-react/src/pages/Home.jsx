import React from 'react';
import { Link } from 'react-router-dom';
import FadeUp from '../components/FadeUp';

const Home = () => {
  return (
    <>
      <section className="hero container" style={{ display: 'block', textAlign: 'center', maxWidth: '900px', margin: '0 auto', paddingTop: 'calc(var(--nav-height) + 6rem)' }}>
        <FadeUp className="hero-content visible">
          <h1 className="h1">Reliable New & Refurbished IT Hardware Solutions</h1>
          <p>Egreen Technology supplies premium Dell, HP and Lenovo business systems, thin clients and computer components with competitive pricing and dependable customer support.</p>
          <div className="hero-btns" style={{ justifyContent: 'center', marginTop: '2rem' }}>
            <Link to="/products" className="btn btn-primary">Explore Products</Link>
            <a href="https://wa.me/917942625065" target="_blank" rel="noreferrer" className="btn btn-outline">Request Quote</a>
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
            <div className="card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </div>
              <h3>Genuine Products</h3>
              <p>100% authentic hardware sourced from trusted manufacturers.</p>
            </div>
            <div className="card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9 12l2 2 4-4"></path></svg>
              </div>
              <h3>Quality Tested</h3>
              <p>Every refurbished unit undergoes rigorous testing before shipment.</p>
            </div>
            <div className="card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              </div>
              <h3>Wholesale Pricing</h3>
              <p>Competitive rates that improve your bottom line.</p>
            </div>
            <div className="card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
              </div>
              <h3>Bulk Orders</h3>
              <p>Capacity to fulfill massive IT requirements efficiently.</p>
            </div>
            <div className="card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
              </div>
              <h3>Fast Delivery</h3>
              <p>Optimized logistics for quick dispatch and arrival.</p>
            </div>
            <div className="card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              </div>
              <h3>Customer Support</h3>
              <p>Dedicated assistance for all your technical inquiries.</p>
            </div>
          </FadeUp>
        </div>
      </section>

      <FadeUp className="section-padding container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div>
            <h2 className="h2" style={{ marginBottom: '0' }}>Featured Categories</h2>
          </div>
          <Link to="/products" className="btn btn-outline">View All Products</Link>
        </div>
        
        <div className="product-grid">
          <div className="card product-card">
            <img src="/assets/dell_wyse_1785088101397.png" alt="Dell Wyse Thin Client" className="product-card-img" />
            <div className="product-card-body">
              <h3>Dell Wyse Thin Client</h3>
              <p>Secure, manageable and reliable endpoints for virtual desktop environments.</p>
              <Link to="/products" className="btn btn-outline" style={{ width: '100%', textAlign: 'center' }}>View Details</Link>
            </div>
          </div>
          <div className="card product-card">
            <img src="/assets/dell_optiplex_1785088113196.png" alt="Dell OptiPlex Mini PC" className="product-card-img" />
            <div className="product-card-body">
              <h3>Dell OptiPlex Mini PC</h3>
              <p>Ultra-compact business desktops with versatile mounting options.</p>
              <Link to="/products" className="btn btn-outline" style={{ width: '100%', textAlign: 'center' }}>View Details</Link>
            </div>
          </div>
          <div className="card product-card">
            <img src="/assets/lenovo_tiny_1785088129692.png" alt="Lenovo ThinkCentre Mini PC" className="product-card-img" />
            <div className="product-card-body">
              <h3>Lenovo ThinkCentre Mini PC</h3>
              <p>Space-saving desktops designed for extreme productivity.</p>
              <Link to="/products" className="btn btn-outline" style={{ width: '100%', textAlign: 'center' }}>View Details</Link>
            </div>
          </div>
        </div>
      </FadeUp>

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
          <a href="https://wa.me/917942625065" target="_blank" rel="noreferrer" className="btn btn-primary">Get a Free Quote</a>
        </section>
      </FadeUp>
    </>
  );
};

export default Home;
