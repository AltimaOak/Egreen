import React from 'react';
import FadeUp from '../components/FadeUp';

const About = () => {
  return (
    <>
      <div className="page-header">
        <FadeUp className="container visible">
          <span className="section-category-badge">WHOLESALER & DISTRIBUTOR</span>
          <h1 className="h1">About Egreen Technology</h1>
          <p style={{ fontSize: '1.05rem', maxWidth: '650px', margin: '0.5rem auto 0', color: '#64748b' }}>
            Leading B2B distributor of brand new & refurbished IT hardware across India.
          </p>
        </FadeUp>
      </div>

      {/* Main Profile & Leadership Story */}
      <section className="container" style={{ padding: '2.5rem 0' }}>
        <div className="about-profile-grid">
          <FadeUp className="about-story-card card visible">
            <span className="section-category-badge">COMPANY PROFILE</span>
            <h2 className="about-story-title">Committed to Quality & Crystal Pure Transparency</h2>
            
            <p className="about-story-text">
              We <strong>“Egreen Technology”</strong> are a Wholesaler &amp; Distributor of brand new &amp; Refurbished for Dell Wyse Thin Client, Dell OptiPlex Mini PC, Lenovo Mini ThinkCentre, HP ProDesk, Computer Processor, Lenovo Mini PC etc. We direct all our activities to cater the expectations of customers by providing them with excellent quality products as per their gratification. Moreover, we follow moral business policies and crystal pure transparency in all our transactions to keep healthy relations with the customers.
            </p>

            <div className="about-leadership-box">
              <div className="leadership-avatar">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </div>
              <div>
                <h4 className="leadership-name">Guided by Leadership</h4>
                <p className="leadership-quote">
                  “For our accomplishment story, we are grateful to our <strong>Mr. Vishal Maurya</strong>, whose continual backing and direction have been useful to us for attaining exponential development in the current market.”
                </p>
              </div>
            </div>
          </FadeUp>

          <FadeUp className="about-board-card card visible">
            <div className="board-img-wrapper">
              <img 
                src="/assets/egreen_board_sign.png" 
                alt="Egreen Technology GST Registration & Office Board Sign" 
                className="board-img"
              />
              <div className="board-verified-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                <span>GST Registered Business</span>
              </div>
            </div>
            <div className="board-card-info">
              <div className="info-row">
                <span className="info-label">GSTIN:</span>
                <span className="info-val font-mono">27BLHPB6169E1Z5</span>
              </div>
              <div className="info-row">
                <span className="info-label">Location:</span>
                <span className="info-val">Goregaon (East), Mumbai - 400063</span>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Actual Warehouse & Infrastructure Gallery */}
      <section className="bg-muted" style={{ padding: '2.5rem 0' }}>
        <div className="container">
          <FadeUp className="text-center" style={{ marginBottom: '2rem' }}>
            <span className="section-category-badge">OUR REAL INFRASTRUCTURE</span>
            <h2 className="section-main-title">Inside Egreen Technology</h2>
            <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '0.25rem 0 0' }}>
              Take a look at our actual warehouse stock, testing lab, and inventory operations in Mumbai.
            </p>
          </FadeUp>

          <div className="about-gallery-grid">
            <FadeUp className="gallery-card card visible">
              <div className="gallery-img-wrapper">
                <img src="/assets/egreen_mini_pcs_stack.png" alt="Massive Ready-to-Ship Inventory Stack" className="gallery-img" />
                <div className="gallery-tag">Bulk Stock</div>
              </div>
              <div className="gallery-card-body">
                <h4>Massive Inventory Stock</h4>
                <p>Wall-to-wall stock of HP, Dell &amp; Lenovo Mini PCs ready for instant dispatch.</p>
              </div>
            </FadeUp>

            <FadeUp className="gallery-card card visible">
              <div className="gallery-img-wrapper">
                <img src="/assets/egreen_testing_lab.png" alt="Egreen Quality Inspection Testing Lab" className="gallery-img" />
                <div className="gallery-tag">Quality Assurance</div>
              </div>
              <div className="gallery-card-body">
                <h4>Technical Testing Lab</h4>
                <p>Every workstation unit undergoes multi-point diagnostic testing before packaging.</p>
              </div>
            </FadeUp>

            <FadeUp className="gallery-card card visible">
              <div className="gallery-img-wrapper">
                <img src="/assets/egreen_inventory_boxes.png" alt="Boxed Shipments Ready for Transport" className="gallery-img" />
                <div className="gallery-tag">Safe Packaging</div>
              </div>
              <div className="gallery-card-body">
                <h4>Secure Boxed Shipments</h4>
                <p>Cardboard-protected and cushioned shipping across pan-India business locations.</p>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Core Business Offerings */}
      <section className="container" style={{ padding: '2.5rem 0' }}>
        <FadeUp className="text-center" style={{ marginBottom: '2rem' }}>
          <span className="section-category-badge">PRODUCT SPECIALIZATIONS</span>
          <h2 className="section-main-title">What We Supply &amp; Distribute</h2>
        </FadeUp>

        <div className="about-products-grid">
          {[
            { name: 'Dell Wyse Thin Clients', desc: 'Secure, power-efficient cloud & virtual desktop endpoints.' },
            { name: 'Dell OptiPlex Mini PCs', desc: 'Ultra-compact enterprise mini desktops built for high performance.' },
            { name: 'Lenovo ThinkCentre Tiny', desc: 'Space-saving Mini PCs engineered for tough commercial environments.' },
            { name: 'HP ProDesk Desktops', desc: 'Reliable business computers designed for seamless office operations.' },
            { name: 'Computer Processors', desc: 'Bulk Intel Core processors for workstation upgrades and builds.' },
            { name: 'Refurbished Systems', desc: 'Thoroughly tested Grade-A refurbished computers with warranty.' }
          ].map((item, idx) => (
            <FadeUp key={idx} className="card product-spec-card visible">
              <div className="spec-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <div>
                <h4>{item.name}</h4>
                <p>{item.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>
    </>
  );
};

export default About;
