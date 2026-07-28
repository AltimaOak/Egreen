import React from 'react';
import FadeUp from '../components/FadeUp';

const About = () => {
  return (
    <>
      <div className="page-header">
        <FadeUp className="container visible">
          <h1 className="h1">About Egreen Technology</h1>
          <p style={{ fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto' }}>Your trusted partner in enterprise IT hardware solutions since inception.</p>
        </FadeUp>
      </div>

      <section className="container" style={{ padding: '2rem 0' }}>
        <FadeUp style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--accent-bg)', color: 'var(--accent)', marginBottom: '1.5rem' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
            </div>
            <h2 className="h2" style={{ marginBottom: '1rem' }}>Our Mission</h2>
            <p style={{ color: 'var(--text)' }}>To provide businesses with reliable, cost-effective, and high-performance IT hardware solutions that drive operational efficiency and sustainable growth. We believe in bridging the gap between premium enterprise technology and accessible pricing.</p>
          </div>
          
          <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--accent-bg)', color: 'var(--accent)', marginBottom: '1.5rem' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h4l3-9 5 18 3-9h5"></path></svg>
            </div>
            <h2 className="h2" style={{ marginBottom: '1rem' }}>Our Vision</h2>
            <p style={{ color: 'var(--text)' }}>To become India's most trusted and preferred wholesaler of new and refurbished IT infrastructure, setting the industry standard for quality, transparency, and customer satisfaction.</p>
          </div>
        </FadeUp>
      </section>

      <section className="bg-muted" style={{ padding: '2rem 0' }}>
        <FadeUp className="container">
          <h2 className="h2 text-center" style={{ textAlign: 'center', marginBottom: '3rem' }}>Company Facts</h2>
          <div className="company-facts">
            <div className="card fact-card">
              <div className="fact-value">Mumbai</div>
              <p style={{ color: 'var(--text-heading)', fontWeight: '500' }}>Headquarters</p>
            </div>
            <div className="card fact-card">
              <div className="fact-value">Wholesale</div>
              <p style={{ color: 'var(--text-heading)', fontWeight: '500' }}>Business Type</p>
            </div>
            <div className="card fact-card">
              <div className="fact-value">Available</div>
              <p style={{ color: 'var(--text-heading)', fontWeight: '500' }}>GST Registered</p>
            </div>
            <div className="card fact-card">
              <div className="fact-value">1000+</div>
              <p style={{ color: 'var(--text-heading)', fontWeight: '500' }}>Clients Served</p>
            </div>
          </div>
        </FadeUp>
      </section>

      <FadeUp className="container" style={{ padding: '2rem 0' }}>
        <h2 className="h2 text-center" style={{ textAlign: 'center', marginBottom: '3rem' }}>Company Album</h2>
        <div style={{ textAlign: 'center' }}>
          <img src="/assets/company_album.png" alt="Company Album" style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }} />
        </div>
      </FadeUp>
    </>
  );
};

export default About;
