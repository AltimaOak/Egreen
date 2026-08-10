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
                name: 'Dell',
                svg: (
                  <svg viewBox="0 0 140 40" className="brand-logo-svg brand-dell">
                    <text x="5" y="32" fill="#0076ce" fontFamily="Arial, Helvetica, sans-serif" fontSize="34" fontWeight="900" letterSpacing="1px">DELL</text>
                  </svg>
                )
              },
              {
                name: 'HP',
                svg: (
                  <svg viewBox="0 0 80 80" className="brand-logo-svg brand-hp">
                    <circle cx="40" cy="40" r="38" fill="#0096d6"/>
                    <text x="40" y="52" fill="#ffffff" fontFamily="Arial, Helvetica, sans-serif" fontSize="36" fontWeight="900" fontStyle="italic" textAnchor="middle" letterSpacing="-1px">hp</text>
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
