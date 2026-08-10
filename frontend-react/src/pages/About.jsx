import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="about-page-wrapper">
      <section className="about-section bg-white">
        <div className="about-container">
          <div className="about-two-col">
            <div className="about-col-img">
              <img
                src="/assets/egreen_board_sign.png"
                alt="Egreen Technology Office Board Sign & GST Registration"
                className="about-img-frame"
              />
            </div>
            <div className="about-col-text">
              <h2 className="about-section-heading">Who We Are</h2>
              <p className="about-paragraph">
                Egreen Technology is a Mumbai-based IT hardware trading and distribution company. We cater to the growing technology requirements of commercial enterprises, educational institutions, government organizations, and hardware resellers.
              </p>
              <p className="about-paragraph">
                We focus on quality assurance, transparent business dealings, competitive wholesale pricing, and dependable post-sales support across all transactions to build long-term relationships with our business partners.
              </p>
              <p className="about-paragraph">
                Under the leadership of <strong>Mr. Vishal Maurya</strong>, Egreen Technology continues to expand its wholesale supply network, offering dependable computing solutions across India.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHAT WE DO (Services & Capabilities - No Product Duplication) */}
      <section className="about-section bg-light">
        <div className="about-container">
          <h2 className="about-section-heading">What We Do</h2>
          <div className="about-grid-3">
            <div className="about-simple-block">
              <h3>Brand New & Refurbished Supply</h3>
              <p>Direct supply of factory-sealed new hardware alongside Grade-A certified refurbished systems backed by testing warranty.</p>
            </div>
            <div className="about-simple-block">
              <h3>Bulk Procurement & Wholesale</h3>
              <p>Complete fulfillment solutions for enterprise office expansion, IT infrastructure overhauls, and reseller stock stocking.</p>
            </div>
            <div className="about-simple-block">
              <h3>Corporate & Institutional Deployment</h3>
              <p>Customized equipment sourcing and deployment tailored for schools, colleges, IT hubs, call centers, and commercial offices.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PRODUCTS WE SUPPLY (Single Definitive Catalog List) */}
      <section className="about-section bg-white">
        <div className="about-container">
          <h2 className="about-section-heading">Products We Supply</h2>
          <div className="about-products-grid-clean">
            <div className="product-category-box">
              <h4>Mini PCs & Thin Clients</h4>
              <p>Dell OptiPlex Micro, Dell Wyse Thin Clients, Lenovo ThinkCentre Tiny, and HP ProDesk mini desktops.</p>
            </div>
            <div className="product-category-box">
              <h4>Commercial Laptops</h4>
              <p>Enterprise series laptops from Dell, HP, Lenovo, and Acer engineered for daily business performance.</p>
            </div>
            <div className="product-category-box">
              <h4>Servers & Networking</h4>
              <p>Rack and tower servers, managed Ethernet switches, routers, and enterprise connectivity hardware.</p>
            </div>
            <div className="product-category-box">
              <h4>Processors & Components</h4>
              <p>Intel Core processors, workstation motherboard components, DDR3/DDR4 RAM modules, and high-speed SSDs.</p>
            </div>
            <div className="product-category-box">
              <h4>Peripherals & Accessories</h4>
              <p>Commercial monitors, power adapters, original power supplies, and workstation input devices.</p>
            </div>
            <div className="product-category-box">
              <h4>Refurbished Workstations</h4>
              <p>Fully inspected, multi-point tested Grade-A refurbished business desktops and laptops with warranty.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE EGREEN */}
      <section className="about-section bg-light">
        <div className="about-container">
          <h2 className="about-section-heading">Why Choose Egreen</h2>
          <div className="about-grid-4">
            <div className="about-why-card">
              <div className="why-icon-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </div>
              <div>
                <h4>Quality Checked</h4>
                <p>Multi-point diagnostic hardware testing prior to packaging.</p>
              </div>
            </div>

            <div className="about-why-card">
              <div className="why-icon-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
              </div>
              <div>
                <h4>Ready Stock</h4>
                <p>Maintained inventory in Mumbai for rapid dispatch across India.</p>
              </div>
            </div>

            <div className="about-why-card">
              <div className="why-icon-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              </div>
              <div>
                <h4>Competitive Rates</h4>
                <p>Direct wholesale pricing with official GST tax invoices.</p>
              </div>
            </div>

            <div className="about-why-card">
              <div className="why-icon-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <div>
                <h4>B2B Support</h4>
                <p>Dedicated assistance for corporate buyers, institutions & resellers.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. OUR FACILITY */}
      <section className="about-section bg-white">
        <div className="about-container">
          <h2 className="about-section-heading">Our Facility</h2>
          <p className="about-section-subtext">
            From inventory management and product testing to secure packaging, we maintain a practical process to ensure reliable hardware supply.
          </p>
          <div className="about-facility-gallery">
            <div className="facility-img-box">
              <img src="/assets/egreen_mini_pcs_stack.png" alt="Massive Ready-to-Ship Inventory Stock" />
              <div className="facility-caption">Inventory Stock</div>
            </div>
            <div className="facility-img-box">
              <img src="/assets/egreen_testing_lab.png" alt="Technical Diagnostic Testing Lab" />
              <div className="facility-caption">Technical Testing Lab</div>
            </div>
            <div className="facility-img-box">
              <img src="/assets/egreen_inventory_boxes.png" alt="Secure Boxed Shipments" />
              <div className="facility-caption">Secure Boxed Packaging</div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. TRUST / COMPANY INFORMATION */}
      <section className="about-section bg-light">
        <div className="about-container">
          <h2 className="about-section-heading">Company Information</h2>
          <div className="about-info-grid">
            <div className="info-card-flat">
              <div className="info-card-title">Registration & Leadership</div>
              <div className="info-line">
                <span className="info-key">Business Name:</span>
                <span className="info-val">Egreen Technology</span>
              </div>
              <div className="info-line">
                <span className="info-key">Business Type:</span>
                <span className="info-val">Wholesaler, Distributor & Trader</span>
              </div>
              <div className="info-line">
                <span className="info-key">Key Leadership:</span>
                <span className="info-val">Mr. Vishal Maurya</span>
              </div>
              <div className="info-line">
                <span className="info-key">GSTIN:</span>
                <span className="info-val font-mono">27BLHPB6169E1Z5</span>
              </div>
            </div>

            <div className="info-card-flat">
              <div className="info-card-title">Location & Distribution</div>
              <div className="info-line">
                <span className="info-key">Location:</span>
                <span className="info-val">Goregaon (East), Mumbai - 400063, MH, India</span>
              </div>
              <div className="info-line">
                <span className="info-key">Supply Area:</span>
                <span className="info-val">Pan-India B2B Distribution</span>
              </div>
              <div className="info-line">
                <span className="info-key">Invoicing:</span>
                <span className="info-val">GST Tax Invoices Provided</span>
              </div>
              <div className="info-line">
                <span className="info-key">Operating Days:</span>
                <span className="info-val">Monday – Saturday</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded CSS */}
      <style>{`
        .about-page-wrapper {
          font-family: 'Inter', Arial, sans-serif;
          color: #0F172A;
          background-color: #FFFFFF;
          line-height: 1.6;
          padding-top: calc(var(--nav-height, 80px) + 20px);
        }

        .about-container {
          max-width: 1140px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .bg-white {
          background-color: #FFFFFF;
        }

        .bg-light {
          background-color: #F8FAFC;
        }

        /* Header Banner */
        .about-header-banner {
          padding: 42px 0 32px;
          background-color: #F8FAFC;
          border-bottom: 1px solid #E2E8F0;
        }

        .about-header-badge {
          font-size: 11px;
          font-weight: 700;
          color: #2563EB;
          background-color: #EFF6FF;
          border: 1px solid rgba(37, 99, 235, 0.18);
          padding: 3px 10px;
          border-radius: 4px;
          letter-spacing: 0.05em;
          display: inline-block;
          margin-bottom: 10px;
          text-transform: uppercase;
        }

        .about-main-title {
          font-size: 32px;
          font-weight: 800;
          color: #0F172A;
          margin: 0 0 6px;
          letter-spacing: -0.02em;
        }

        .about-subtitle {
          font-size: 16px;
          font-weight: 600;
          color: #2563EB;
          margin: 0 0 10px;
        }

        .about-header-desc {
          font-size: 15px;
          color: #475569;
          max-width: 820px;
          margin: 0;
          line-height: 1.6;
        }

        /* Sections */
        .about-section {
          padding: 40px 0;
          border-bottom: 1px solid #E2E8F0;
        }

        .about-section-heading {
          font-size: 24px;
          font-weight: 700;
          color: #0F172A;
          margin: 0 0 20px;
          letter-spacing: -0.01em;
        }

        .about-section-subtext {
          font-size: 15px;
          color: #475569;
          margin: -12px 0 24px;
          max-width: 850px;
        }

        /* Two Column */
        .about-two-col {
          display: grid;
          grid-template-columns: 400px 1fr;
          gap: 36px;
          align-items: center;
        }

        .about-img-frame {
          width: 100%;
          height: auto;
          border-radius: 6px;
          border: 1px solid #E2E8F0;
          object-fit: cover;
          display: block;
        }

        .about-col-text {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .about-paragraph {
          font-size: 15px;
          color: #334155;
          margin: 0;
          line-height: 1.65;
        }

        /* Grid 3 (What We Do) */
        .about-grid-3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .about-simple-block {
          background-color: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 6px;
          padding: 20px;
        }

        .about-simple-block h3 {
          font-size: 16px;
          font-weight: 700;
          color: #0F172A;
          margin: 0 0 8px;
        }

        .about-simple-block p {
          font-size: 14px;
          color: #475569;
          margin: 0;
          line-height: 1.55;
        }

        /* Products Grid Clean (Single Catalog Section) */
        .about-products-grid-clean {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        .product-category-box {
          padding: 18px;
          border: 1px solid #E2E8F0;
          border-radius: 6px;
          background: #FFFFFF;
        }

        .product-category-box h4 {
          font-size: 15px;
          font-weight: 700;
          color: #0F172A;
          margin: 0 0 6px;
        }

        .product-category-box p {
          font-size: 13px;
          color: #475569;
          margin: 0;
          line-height: 1.5;
        }

        /* Grid 4 */
        .about-grid-4 {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
        }

        .about-why-card {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          padding: 16px;
          border: 1px solid #E2E8F0;
          border-radius: 6px;
          background: #FFFFFF;
        }

        .why-icon-box {
          width: 36px;
          height: 36px;
          border-radius: 6px;
          background-color: #EFF6FF;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .about-why-card h4 {
          font-size: 14px;
          font-weight: 700;
          color: #0F172A;
          margin: 0 0 4px;
        }

        .about-why-card p {
          font-size: 13px;
          color: #475569;
          margin: 0;
          line-height: 1.45;
        }

        /* Facility Gallery */
        .about-facility-gallery {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .facility-img-box {
          border: 1px solid #E2E8F0;
          border-radius: 6px;
          overflow: hidden;
          background: #FFFFFF;
        }

        .facility-img-box img {
          width: 100%;
          height: 210px;
          object-fit: cover;
          display: block;
        }

        .facility-caption {
          padding: 10px 14px;
          font-size: 14px;
          font-weight: 600;
          color: #0F172A;
          border-top: 1px solid #E2E8F0;
          background: #FFFFFF;
        }

        /* Info Grid */
        .about-info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .info-card-flat {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 6px;
          padding: 22px;
        }

        .info-card-title {
          font-size: 16px;
          font-weight: 700;
          color: #0F172A;
          margin-bottom: 16px;
          padding-bottom: 10px;
          border-bottom: 1px solid #E2E8F0;
        }

        .info-line {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px dashed #F1F5F9;
          font-size: 14px;
        }

        .info-line:last-child {
          border-bottom: none;
        }

        .info-key {
          color: #64748B;
          font-weight: 500;
        }

        .info-val {
          color: #0F172A;
          font-weight: 600;
          text-align: right;
        }

        .font-mono {
          font-family: monospace;
          font-size: 14px;
          color: #2563EB;
        }

        /* CTA Strip */
        .about-cta-strip {
          background-color: #0F172A;
          color: #FFFFFF;
          padding: 36px 0;
        }

        .cta-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
        }

        .cta-title {
          font-size: 22px;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0 0 4px;
        }

        .cta-subtitle {
          font-size: 14px;
          color: #94A3B8;
          margin: 0;
        }

        .cta-actions {
          display: flex;
          gap: 12px;
          flex-shrink: 0;
        }

        .btn-cta-main {
          padding: 10px 22px;
          background-color: #2563EB;
          color: #FFFFFF;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 600;
          font-size: 14px;
          transition: background-color 0.2s;
        }

        .btn-cta-main:hover {
          background-color: #1D4ED8;
        }

        .btn-cta-sub {
          padding: 10px 22px;
          background-color: transparent;
          color: #FFFFFF;
          border: 1px solid #475569;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 600;
          font-size: 14px;
          transition: border-color 0.2s;
        }

        .btn-cta-sub:hover {
          border-color: #94A3B8;
        }

        /* Responsive Breakpoints */
        @media (max-width: 992px) {
          .about-two-col {
            grid-template-columns: 1fr;
          }
          .about-grid-3, .about-products-grid-clean {
            grid-template-columns: 1fr 1fr;
          }
          .about-grid-4 {
            grid-template-columns: 1fr 1fr;
          }
          .about-facility-gallery {
            grid-template-columns: 1fr 1fr;
          }
          .cta-container {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 640px) {
          .about-main-title {
            font-size: 28px;
          }
          .about-grid-3, .about-products-grid-clean, .about-grid-4, .about-facility-gallery, .about-info-grid {
            grid-template-columns: 1fr;
          }
          .info-line {
            flex-direction: column;
            gap: 2px;
          }
          .info-val {
            text-align: left;
          }
        }
      `}</style>
    </div>
  );
};

export default About;
