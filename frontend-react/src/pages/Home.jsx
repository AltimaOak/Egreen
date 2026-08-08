import React from 'react';
import { Link } from 'react-router-dom';
import FadeUp from '../components/FadeUp';

const Home = () => {
  return (
    <>
      <section className="hero-landing">
        {/* SaaS Ambient Glow Backdrop Spots */}
        <div className="hero-ambient-glow hero-glow-right"></div>
        <div className="hero-ambient-glow hero-glow-left"></div>

        <div className="hero-landing-full-bleed">
          <FadeUp className="hero-landing-content visible">
            <div className="hero-badge-pill">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              Trusted by 500+ Businesses Across India
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
            <div className="hero-workspace-composition">
              <div className="hero-image-ambient-aura"></div>
              <img src="/assets/hero_workspace.png" alt="Laptop and Desktop Workstation" className="hero-workspace-img" />
            </div>
          </FadeUp>
        </div>
      </section>

      <div className="container">
        <FadeUp className="hero-features-bar card visible">
          <div className="hero-feature-item">
            <div className="feature-icon-circle icon-circle-blue">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            </div>
            <div className="feature-item-text">
              <h4>Genuine Products</h4>
              <p>100% authentic hardware from trusted brands</p>
            </div>
          </div>

          <div className="hero-feature-item">
            <div className="feature-icon-circle icon-circle-green">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>
            </div>
            <div className="feature-item-text">
              <h4>Expert Support</h4>
              <p>Dedicated technical &amp; after sales support</p>
            </div>
          </div>

          <div className="hero-feature-item">
            <div className="feature-icon-circle icon-circle-purple">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
            </div>
            <div className="feature-item-text">
              <h4>Fast &amp; Safe Delivery</h4>
              <p>Quick and reliable delivery across India</p>
            </div>
          </div>

          <div className="hero-feature-item">
            <div className="feature-icon-circle icon-circle-amber">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
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
                name: 'Lenovo',
                svg: (
                  <svg viewBox="0 0 140 44" className="brand-logo-svg brand-lenovo">
                    <rect width="140" height="44" rx="4" fill="#E2231A" />
                    <text x="70" y="31" fill="#FFFFFF" fontFamily="'Helvetica Neue', Arial, sans-serif" fontSize="26" fontWeight="bold" textAnchor="middle" letterSpacing="0.2px">Lenovo</text>
                  </svg>
                )
              },
              {
                name: 'Acer',
                svg: (
                  <svg viewBox="0 0 130 40" className="brand-logo-svg brand-acer">
                    <text x="65" y="32" fill="#83B81A" fontFamily="'Trebuchet MS', 'Arial Black', sans-serif" fontSize="36" fontWeight="900" fontStyle="italic" textAnchor="middle" letterSpacing="-2px">acer</text>
                  </svg>
                )
              },
              {
                name: 'Intel',
                svg: (
                  <svg viewBox="0 0 120 60" className="brand-logo-svg brand-intel">
                    {/* Intel blue elliptical swoosh */}
                    <ellipse cx="60" cy="30" rx="58" ry="28" fill="none" stroke="#0068B5" strokeWidth="4.5"/>
                    {/* intel wordmark */}
                    <text
                      x="60" y="37"
                      fill="#0068B5"
                      fontFamily="'Arial', Helvetica, sans-serif"
                      fontSize="22"
                      fontWeight="bold"
                      textAnchor="middle"
                      letterSpacing="-0.5"
                    >intel</text>
                    {/* dot on the 'i' — part of the wordmark */}
                    <rect x="17.5" y="19" width="5" height="5" fill="#0068B5" rx="0.5"/>
                  </svg>
                )
              },
              {
                name: 'HP',
                svg: (
                  <svg viewBox="0 0 100 100" className="brand-logo-svg brand-hp">
                    <circle cx="50" cy="50" r="48" fill="#0096D6" />
                    <text
                      x="50" y="66"
                      fill="#FFFFFF"
                      fontFamily="'Arial', Helvetica, sans-serif"
                      fontSize="44"
                      fontWeight="900"
                      fontStyle="italic"
                      textAnchor="middle"
                    >hp</text>
                  </svg>
                )
              },
              {
                name: 'Dell',
                svg: (
                  <svg viewBox="0 0 100 100" className="brand-logo-svg brand-dell">
                    <circle cx="50" cy="50" r="46" fill="none" stroke="#0076CE" strokeWidth="6" />
                    <text
                      x="50" y="61"
                      fill="#0076CE"
                      fontFamily="'Arial Black', Impact, sans-serif"
                      fontSize="26"
                      fontWeight="900"
                      textAnchor="middle"
                      letterSpacing="1.5"
                    >DELL</text>
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
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
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
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
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
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>
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
