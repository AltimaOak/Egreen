import React from 'react';
import { Link } from 'react-router-dom';
import FadeUp from '../components/FadeUp';
import { ShieldCheck, Award, HeadphonesIcon, Truck, Tags, CheckCircle } from 'lucide-react';

const Home = () => {
  return (
    <>
      <section className="hero container">
        <FadeUp className="hero-content">
          <div className="hero-badge">
            <CheckCircle size={20} />
            Trusted by 500+ Businesses
          </div>
          <h1 className="h1">Reliable New &amp; Refurbished IT Hardware Solutions</h1>
          <p>Enterprise Dell, HP &amp; Lenovo systems with warranty and expert support.</p>
          <div className="hero-btns">
            <Link to="/products" className="btn btn-primary">
              Explore Products <span style={{ marginLeft: '4px' }}>&rsaquo;</span>
            </Link>
            <a href="https://wa.me/917942625065" target="_blank" rel="noreferrer" className="btn btn-outline">
              Request Quote <span style={{ marginLeft: '4px' }}>&rsaquo;</span>
            </a>
          </div>
        </FadeUp>
        <FadeUp className="hero-image-wrapper">
          <img src="/assets/hero_mini_pcs_1785088044717.png" alt="IT Hardware Solutions" style={{ width: '100%', maxWidth: '700px', position: 'relative', zIndex: 2 }} />
        </FadeUp>
      </section>

      <div className="container">
        <FadeUp className="hero-features-bar">
          <div className="hero-feature">
            <ShieldCheck size={24} className="hero-feature-icon" />
            <div className="hero-feature-content">
              <h4>Genuine Products</h4>
              <p>100% Genuine Dell, HP &amp; Lenovo Hardware</p>
            </div>
          </div>
          <div className="hero-feature">
            <Award size={24} className="hero-feature-icon" />
            <div className="hero-feature-content">
              <h4>Warranty Assurance</h4>
              <p>Minimum 6 Months Warranty on All Products</p>
            </div>
          </div>
          <div className="hero-feature">
            <HeadphonesIcon size={24} className="hero-feature-icon" />
            <div className="hero-feature-content">
              <h4>Expert Support</h4>
              <p>Dedicated Technical Support Before &amp; After Purchase</p>
            </div>
          </div>
          <div className="hero-feature">
            <Truck size={24} className="hero-feature-icon" />
            <div className="hero-feature-content">
              <h4>Pan India Delivery</h4>
              <p>Safe &amp; Fast Delivery Across India</p>
            </div>
          </div>
          <div className="hero-feature">
            <Tags size={24} className="hero-feature-icon" />
            <div className="hero-feature-content">
              <h4>Best Prices</h4>
              <p>Competitive Pricing for Every Business</p>
            </div>
          </div>
        </FadeUp>
      </div>

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
