import React from 'react';
import { Link } from 'react-router-dom';
import FadeUp from '../components/FadeUp';

const Home = () => {
  return (
    <>
      <section className="hero-landing">
        <div className="container hero-landing-container">
          <FadeUp className="hero-landing-content visible">
            <div className="hero-badge-pill">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              Trusted by 500+ Businesses
            </div>
            <h1 className="hero-landing-title">
              Reliable New &amp; Refurbished <br/>
              <span className="text-primary">IT Hardware Solutions</span>
            </h1>
            <p className="hero-landing-desc">
              Enterprise-grade IT hardware from leading brands.<br/>
              Built for performance, backed by trust.
            </p>
            <div className="hero-landing-btns">
              <Link to="/products" className="btn btn-primary hero-btn">
                Explore Products 
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </Link>
              <a href="https://wa.me/917942625065" target="_blank" rel="noreferrer" className="btn btn-outline hero-btn">
                Request Quote 
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </a>
            </div>
          </FadeUp>

          <FadeUp className="hero-landing-image-wrapper visible">
            <div className="hero-arch-frame">
              <img src="/assets/office_modern_1785088069141.png" alt="Office Hardware Workspace" className="hero-arch-img" />
            </div>
          </FadeUp>
        </div>
      </section>

      <div className="container">
        <FadeUp className="hero-features-bar card visible">
          <div className="hero-feature-item">
            <div className="feature-icon-circle">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            </div>
            <div className="feature-item-text">
              <h4>Genuine Products</h4>
              <p>100% authentic hardware from trusted brands</p>
            </div>
          </div>

          <div className="hero-feature-item">
            <div className="feature-icon-circle">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>
            </div>
            <div className="feature-item-text">
              <h4>Expert Support</h4>
              <p>Dedicated technical &amp; after sales support</p>
            </div>
          </div>

          <div className="hero-feature-item">
            <div className="feature-icon-circle">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
            </div>
            <div className="feature-item-text">
              <h4>Fast &amp; Safe Delivery</h4>
              <p>Quick and reliable delivery across India</p>
            </div>
          </div>

          <div className="hero-feature-item">
            <div className="feature-icon-circle">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path></svg>
            </div>
            <div className="feature-item-text">
              <h4>Best Prices</h4>
              <p>Competitive pricing for maximum value</p>
            </div>
          </div>
        </FadeUp>
      </div>

      <section className="trusted-brands-section">
        <div className="container">
          <FadeUp className="trusted-brands-header visible">
            <h3 className="trusted-brands-title">Trusted Brands</h3>
            <p className="trusted-brands-subtitle">Quality hardware from the world's leading technology brands.</p>
          </FadeUp>
        </div>

        <div className="marquee-wrapper">
          <div className="marquee-fade-left"></div>
          <div className="marquee-fade-right"></div>
          <div className="marquee-track">
            {[...Array(4)].flatMap(() => [
              {
                name: 'Dell',
                svg: (
                  <svg viewBox="0 0 170 50" className="brand-logo-svg brand-dell" fill="#0076ce">
                    <path d="M 10 5 H 32 C 46 5 54 15 54 25 C 54 35 46 45 32 45 H 10 Z M 22 14 V 36 H 31 C 38 36 42 32 42 25 C 42 18 38 14 31 14 Z"/>
                    <g transform="translate(68, 25) rotate(-45)">
                      <path d="M -13 -13 H 13 V -5 H -4 V -1 H 9 V 5 H -4 V 9 H 13 V 17 H -13 Z"/>
                    </g>
                    <path d="M 100 5 H 112 V 36 H 130 V 45 H 100 Z"/>
                    <path d="M 136 5 H 148 V 36 H 166 V 45 H 136 Z"/>
                  </svg>
                )
              },
              {
                name: 'HP',
                svg: (
                  <svg viewBox="0 0 100 100" className="brand-logo-svg brand-hp">
                    <circle cx="50" cy="50" r="48" fill="#0096d6"/>
                    <g fill="#ffffff" transform="skewX(-16) translate(6, 0)">
                      <rect x="28" y="12" width="8.5" height="76" />
                      <path d="M 36.5 45 C 41 40 48 40 52 44 C 55 47 55 52 55 58 V 76 H 46.5 V 58 C 46.5 53 45 50 42 50 C 38.5 50 36.5 53 36.5 58 V 76 H 28 V 45 Z" />
                      <rect x="58" y="32" width="8.5" height="56" />
                      <path d="M 66.5 36 C 75 36 81 42 81 52 C 81 62 75 68 66.5 68 H 58 V 36 Z M 66.5 60 C 70.5 60 72.5 56.5 72.5 52 C 72.5 47.5 70.5 44 66.5 44 V 60 Z" />
                    </g>
                  </svg>
                )
              },
              {
                name: 'Acer',
                svg: (
                  <svg viewBox="0 0 140 40" className="brand-logo-svg brand-acer">
                    <text x="0" y="33" fill="#74a613" fontFamily="Arial, Helvetica, sans-serif" fontSize="38" fontWeight="900" fontStyle="italic" letterSpacing="-2px">acer</text>
                  </svg>
                )
              },
              {
                name: 'Lenovo',
                svg: (
                  <svg viewBox="0 0 160 50" className="brand-logo-svg brand-lenovo">
                    <rect x="0" y="0" width="160" height="50" rx="3" fill="#e2231a" />
                    <text x="10" y="34" fill="#ffffff" fontFamily="Arial, Helvetica, sans-serif" fontSize="28" fontWeight="bold" letterSpacing="0.5px">Lenovo</text>
                    <text x="140" y="24" fill="#ffffff" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold">TM</text>
                  </svg>
                )
              },
             {
  name: 'Intel',
  svg: (
    <svg viewBox="0 0 160 50">
      <rect width="160" height="50" rx="3" fill="#0068B5" />
      <text x="45" y="34" fill="white" fontSize="28" fontWeight="bold">
        intel
      </text>
    </svg>
  )
}
            ]).map((brand, idx) => (
              <div key={idx} className="brand-card" title={brand.name}>
                {brand.svg}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding container">
        <FadeUp className="categories-header-row visible">
          <div>
            <span className="section-category-badge">BROWSE BY CATEGORY</span>
            <h2 className="section-main-title">Featured Categories</h2>
          </div>
          <Link to="/products" className="btn btn-outline category-view-all">
            View All Products
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </Link>
        </FadeUp>

        <div className="home-category-grid">
          <FadeUp className="card category-card visible">
            <div className="category-card-img-wrapper">
              <img src="/assets/dell_wyse_1785088101397.png" alt="Dell Wyse Thin Clients" className="category-card-img" />
              <div className="category-card-icon-badge">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
              </div>
            </div>
            <div className="category-card-body">
              <h3>Dell Wyse Thin Clients</h3>
              <p>Secure, manageable and efficient solutions for virtual desktop environments.</p>
              <Link to="/products" className="category-card-link">
                View Details
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </Link>
            </div>
          </FadeUp>

          <FadeUp className="card category-card visible">
            <div className="category-card-img-wrapper">
              <img src="/assets/dell_optiplex_1785088113196.png" alt="Dell OptiPlex Mini PCs" className="category-card-img" />
              <div className="category-card-icon-badge">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
              </div>
            </div>
            <div className="category-card-body">
              <h3>Dell OptiPlex Mini PCs</h3>
              <p>Ultra-compact business desktops with versatile mounting options.</p>
              <Link to="/products" className="category-card-link">
                View Details
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </Link>
            </div>
          </FadeUp>

          <FadeUp className="card category-card visible">
            <div className="category-card-img-wrapper">
              <img src="/assets/lenovo_tiny_1785088129692.png" alt="Lenovo ThinkCentre PCs" className="category-card-img" />
              <div className="category-card-icon-badge">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>
              </div>
            </div>
            <div className="category-card-body">
              <h3>Lenovo ThinkCentre PCs</h3>
              <p>Space-saving desktops designed for diverse business productivity.</p>
              <Link to="/products" className="category-card-link">
                View Details
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      <section className="why-choose-section">
        <div className="container">
          <FadeUp className="why-choose-container visible">
            <div className="why-choose-header text-center">
              <span className="section-category-badge">WHY CHOOSE US</span>
              <h2 className="why-choose-title">
                Why Choose <span className="text-primary">Egreen Technology?</span>
              </h2>
              <p className="why-choose-desc">
                We supply reliable, enterprise-grade IT hardware to businesses with full quality assurance and dedicated technical support.
              </p>
            </div>

            <div className="why-choose-grid-3col">
              {[
                { 
                  title: 'Genuine Products', 
                  desc: '100% authentic Dell, HP & Lenovo workstations, mini PCs, and thin clients.',
                  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                },
                { 
                  title: 'Wholesale Pricing', 
                  desc: 'Direct B2B pricing with transparent rates and volume purchase discounts.',
                  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                },
                { 
                  title: 'Warranty Protected', 
                  desc: 'Minimum 6 months warranty coverage on every product shipped.',
                  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
                },
                { 
                  title: 'Pan-India Delivery', 
                  desc: 'Fast, secure, and fully tracked delivery nationwide to your office.',
                  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                },
                { 
                  title: 'Expert Tech Support', 
                  desc: 'Dedicated technical team ready to assist before and after your purchase.',
                  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>
                },
                { 
                  title: 'Transparent Business', 
                  desc: 'No hidden fees, accurate grading, and straightforward customer service.',
                  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                }
              ].map((item, i) => (
                <div key={i} className="why-choose-card-clean">
                  <div className="why-choose-icon-badge">
                    {item.icon}
                  </div>
                  <h4 className="why-choose-card-title">{item.title}</h4>
                  <p className="why-choose-card-desc">{item.desc}</p>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  );
};

export default Home;
