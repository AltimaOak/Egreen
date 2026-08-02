// Unified Pages Editor and Visual Layout Directory
import React, { useState } from 'react';
import HomepageEditor from './HomepageEditor';
import AboutEditor from './AboutEditor';
import ContactEditor from './ContactEditor';
import { Edit3, ArrowLeft, Layers, ShieldAlert, FileText, ChevronRight } from 'lucide-react';

const Pages = () => {
  const [selectedPage, setSelectedPage] = useState('home'); // home, about, contact, terms, privacy
  const [isEditing, setIsEditing] = useState(false);

  const pageItems = [
    { key: 'home', label: 'Home Page', desc: 'Hero sliders, call to action grids', lastUpdated: 'May 24, 2024' },
    { key: 'about', label: 'About Us', desc: 'Story, timelines, and fact sections', lastUpdated: 'May 26, 2024' },
    { key: 'contact', label: 'Contact Us', desc: 'Map parameters, addresses, working hours', lastUpdated: 'May 30, 2024' },
    { key: 'terms', label: 'Terms & Conditions', desc: 'Standard business terms & B2B GST compliance', lastUpdated: 'Jan 12, 2024' },
    { key: 'privacy', label: 'Privacy Policy', desc: 'Privacy details and cookies specifications', lastUpdated: 'Jan 12, 2024' }
  ];

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleBackToList = () => {
    setIsEditing(false);
  };

  const renderActiveEditor = () => {
    switch (selectedPage) {
      case 'home':
        return <HomepageEditor />;
      case 'about':
        return <AboutEditor />;
      case 'contact':
        return <ContactEditor />;
      case 'terms':
      case 'privacy':
      default:
        return (
          <div className="admin-card">
            <h4 style={{ fontWeight: 600, color: 'var(--admin-text-heading)', marginBottom: '16px' }}>
              Edit Legal Content: {pageItems.find(p => p.key === selectedPage)?.label}
            </h4>
            <div className="admin-form-group">
              <label className="admin-form-label">Full Page Markdown Text</label>
              <textarea 
                className="admin-textarea"
                style={{ minHeight: '300px' }}
                defaultValue={`# ${pageItems.find(p => p.key === selectedPage)?.label}\n\nStandard guidelines and compliance details for B2B wholesalers across Maharashtra.`}
              ></textarea>
            </div>
            <button className="admin-btn admin-btn-primary" onClick={() => alert('Saved legal terms locally!')}>
              Save Terms
            </button>
          </div>
        );
    }
  };

  const renderVisualMockup = () => {
    switch (selectedPage) {
      case 'home':
        return (
          <div className="admin-pages-device-mockup">
            <div style={{ backgroundColor: '#111827', color: 'white', padding: '24px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'left' }}>
              <span className="admin-badge admin-badge-success" style={{ alignSelf: 'flex-start', marginBottom: '8px' }}>Hero Slider</span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>Powering Your Digital Future</h2>
              <p style={{ fontSize: '0.75rem', color: '#9CA3AF', lineHeight: 1.4, marginBottom: '16px' }}>Latest Laptops & Computing Solutions for Work, Study, and Gaming.</p>
              <div className="flex gap-2">
                <button type="button" className="admin-btn admin-btn-primary admin-btn-sm" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>Shop Now</button>
                <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" style={{ padding: '4px 8px', fontSize: '0.75rem', color: 'white', borderColor: '#374151' }}>Learn More</button>
              </div>
            </div>
          </div>
        );
      case 'about':
        return (
          <div className="admin-pages-device-mockup">
            <div style={{ padding: '24px', backgroundColor: '#F8FAFC', height: '100%', textAlign: 'left' }}>
              <span className="admin-badge admin-badge-info" style={{ marginBottom: '8px' }}>About Panel</span>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', marginBottom: '4px' }}>Genuine IT Hardware Wholesalers</h3>
              <p style={{ fontSize: '0.7rem', color: '#6B7280', lineHeight: 1.4 }}>Egreen Technology provides tested brand-new and refurbished business components with nationwide support.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '16px' }}>
                <div style={{ padding: '8px', border: '1px solid #E5E7EB', borderRadius: '6px', textAlign: 'center', background: 'white' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#10B981' }}>Mumbai</div>
                  <span style={{ fontSize: '0.65rem' }}>Headquarters</span>
                </div>
                <div style={{ padding: '8px', border: '1px solid #E5E7EB', borderRadius: '6px', textAlign: 'center', background: 'white' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#10B981' }}>1000+</div>
                  <span style={{ fontSize: '0.65rem' }}>Clients Served</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 'contact':
        return (
          <div className="admin-pages-device-mockup" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: '60%', backgroundColor: '#E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4B5563', fontSize: '0.85rem' }}>
              Google Iframe Maps View Area
            </div>
            <div style={{ padding: '12px 16px', backgroundColor: '#FFFFFF', flex: 1, textAlign: 'left' }}>
              <strong style={{ fontSize: '0.8rem', color: '#111827' }}>Goregaon East, Mumbai</strong>
              <p style={{ fontSize: '0.7rem', color: '#6B7280', marginTop: '2px' }}>Email: egreentechnology24@gmail.com</p>
            </div>
          </div>
        );
      case 'terms':
      case 'privacy':
      default:
        return (
          <div className="admin-pages-device-mockup" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAFAFA' }}>
            <FileText size={48} color="#9CA3AF" />
          </div>
        );
    }
  };

  return (
    <div style={{ textAlign: 'left' }}>
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Static Pages</h1>
          <p className="admin-page-subtitle">Manage and update website content and legal policies.</p>
        </div>
      </div>
      
      {/* Redesigned Pages Layout (Full Editor view vs Master-Detail list view) */}
      {isEditing ? (
        <div>
          <button 
            type="button" 
            className="admin-btn admin-btn-secondary mb-4" 
            onClick={handleBackToList}
            style={{ marginBottom: '20px' }}
          >
            <ArrowLeft size={16} /> Back to Directory
          </button>
          
          {renderActiveEditor()}
        </div>
      ) : (
        <div className="admin-pages-layout">
          {/* Left: Master Pages List Selector */}
          <div className="admin-pages-sidebar-list">
            <span className="admin-form-label" style={{ paddingLeft: '8px', marginBottom: '12px', fontWeight: 600 }}>Select Page to Edit</span>
            {pageItems.map(p => (
              <div 
                key={p.key}
                className={`admin-pages-sidebar-item ${selectedPage === p.key ? 'active' : ''}`}
                onClick={() => setSelectedPage(p.key)}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <strong style={{ color: 'var(--admin-text-heading)', fontSize: '0.88rem' }}>{p.label}</strong>
                  <span style={{ fontSize: '0.72rem', color: 'var(--admin-text-body)' }}>{p.desc}</span>
                </div>
                <ChevronRight size={14} color="var(--admin-text-body)" />
              </div>
            ))}
          </div>

          {/* Right: Selected Page Preview Mockup */}
          <div className="admin-pages-detail-view">
            <div className="flex justify-between items-center mb-4" style={{ borderBottom: '1px solid var(--admin-border)', paddingBottom: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <h3 className="admin-modal-title" style={{ fontSize: '1.15rem' }}>
                  {pageItems.find(p => p.key === selectedPage)?.label} Details
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-body)' }}>
                  Last published: {pageItems.find(p => p.key === selectedPage)?.lastUpdated}
                </span>
              </div>

              <button className="admin-btn admin-btn-primary" onClick={handleEditClick}>
                <Edit3 size={15} /> Edit Content
              </button>
            </div>

            <span className="admin-form-label" style={{ marginBottom: '8px' }}>Section Render Preview (Mock)</span>
            
            {/* Display Mockup Frame */}
            {renderVisualMockup()}
          </div>
        </div>
      )}
    </div>
  );
};

export default Pages;

