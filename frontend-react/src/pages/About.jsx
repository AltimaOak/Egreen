import React, { useState, useEffect } from 'react';
import FadeUp from '../components/FadeUp';
import { pageService } from '../services/pageService';

const About = () => {
  const [loading, setLoading] = useState(true);
  const [aboutData, setAboutData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await pageService.getAbout();
        setAboutData(data);
      } catch (err) {
        console.error('Error loading about data', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading || !aboutData) {
    return (
      <div style={{ padding: '120px 24px', textAlign: 'center' }}>
        <h2>Loading about details...</h2>
      </div>
    );
  }

  return (
    <>
      <div className="page-header">
        <FadeUp className="container visible">
          <h1 className="h1">{aboutData.heroTitle || 'About Egreen Technology'}</h1>
          <p style={{ fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto' }}>{aboutData.heroSubtitle || 'Leading B2B distributor of brand new & refurbished IT hardware across India.'}</p>
        </FadeUp>
      </div>

      <section className="container" style={{ padding: '3rem 0', maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <FadeUp>
          <h2 className="h2" style={{ marginBottom: '1.5rem' }}>Our Story</h2>
          <p style={{ color: 'var(--text-body)', fontSize: '1.05rem', lineHeight: '1.8', whiteSpace: 'pre-line', marginBottom: '3rem' }}>
            {aboutData.story}
          </p>
        </FadeUp>
      </section>

      <section className="container" style={{ padding: '2rem 0' }}>
        <FadeUp className="mission-vision-grid">
          <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--accent-bg)', color: 'var(--accent)', marginBottom: '1.5rem' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
            </div>
            <h2 className="h2" style={{ marginBottom: '1rem' }}>Our Mission</h2>
            <p style={{ color: 'var(--text-body)' }}>{aboutData.mission}</p>
          </div>
          
          <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--accent-bg)', color: 'var(--accent)', marginBottom: '1.5rem' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h4l3-9 5 18 3-9h5"></path></svg>
            </div>
            <h2 className="h2" style={{ marginBottom: '1rem' }}>Our Vision</h2>
            <p style={{ color: 'var(--text-body)' }}>{aboutData.vision}</p>
          </div>
        </FadeUp>
      </section>

      {/* CEO Message Section */}
      {aboutData.ceoMessage && (
        <section className="container bg-white" style={{ padding: '4rem 0', maxWidth: '800px', margin: '0 auto', textAlign: 'left' }}>
          <FadeUp style={{ borderLeft: '4px solid var(--primary)', paddingLeft: '24px' }}>
            <h3 className="h3" style={{ marginBottom: '1rem', color: 'var(--text-heading)' }}>
              Message from {aboutData.ceoName || 'Proprietor'}
            </h3>
            <p style={{ fontStyle: 'italic', fontSize: '1.1rem', color: 'var(--text-body)', lineHeight: 1.7 }}>
              "{aboutData.ceoMessage}"
            </p>
          </FadeUp>
        </section>
      )}

      {aboutData.facts && aboutData.facts.length > 0 && (
        <section className="bg-muted" style={{ padding: '4rem 0' }}>
          <FadeUp className="container">
            <h2 className="h2 text-center" style={{ textAlign: 'center', marginBottom: '3rem' }}>Company Facts</h2>
            <div className="company-facts">
              {aboutData.facts.map((fact, idx) => (
                <div key={idx} className="card fact-card">
                  <div className="fact-value">{fact.value}</div>
                  <p style={{ color: 'var(--text-heading)', fontWeight: '500' }}>{fact.label}</p>
                </div>
              ))}
            </div>
          </FadeUp>
        </section>
      )}
    </>
  );
};

export default About;
