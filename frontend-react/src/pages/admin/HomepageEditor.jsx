// Admin Homepage Content Editor Component
import React, { useState, useEffect } from 'react';
import { pageService } from '../../services/pageService';
import { useAdmin } from '../../contexts/AdminContext';
import { FormSkeleton } from '../../components/admin/Skeleton';
import { 
  Save, 
  Eye, 
  Edit3, 
  Plus, 
  Trash2, 
  HelpCircle,
  Link as LinkIcon 
} from 'lucide-react';

const HomepageEditor = () => {
  const { showToast } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('edit'); // edit, preview
  const [homepageData, setHomepageData] = useState(null);

  const fetchHomepageData = async () => {
    try {
      setLoading(true);
      const data = await pageService.getHomepage();
      setHomepageData(data);
    } catch (e) {
      showToast('Failed to load homepage data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomepageData();
  }, []);

  const handleInputChange = (field, value) => {
    setHomepageData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Offers helpers
  const handleOfferChange = (index, field, value) => {
    const updated = [...homepageData.offers];
    updated[index][field] = value;
    setHomepageData(prev => ({ ...prev, offers: updated }));
  };

  const addOffer = () => {
    if (homepageData.offers.length >= 8) {
      showToast('Maximum 8 features/offers allowed.', 'warning');
      return;
    }
    setHomepageData(prev => ({
      ...prev,
      offers: [...prev.offers, { title: '', desc: '' }]
    }));
  };

  const removeOffer = (index) => {
    const updated = homepageData.offers.filter((_, idx) => idx !== index);
    setHomepageData(prev => ({ ...prev, offers: updated }));
  };

  // Testimonials helpers
  const handleTestimonialChange = (index, field, value) => {
    const updated = [...homepageData.testimonials];
    updated[index][field] = value;
    setHomepageData(prev => ({ ...prev, testimonials: updated }));
  };

  const addTestimonial = () => {
    setHomepageData(prev => ({
      ...prev,
      testimonials: [...prev.testimonials, { id: Date.now(), name: '', role: '', content: '' }]
    }));
  };

  const removeTestimonial = (index) => {
    const updated = homepageData.testimonials.filter((_, idx) => idx !== index);
    setHomepageData(prev => ({ ...prev, testimonials: updated }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    showToast('Saving Changes...', 'loading');
    
    try {
      await pageService.updateHomepage(homepageData);
      showToast('Changes Published Successfully', 'success');
      fetchHomepageData();
    } catch (err) {
      showToast('Failed to save homepage modifications.', 'error');
    }
  };

  if (loading) return <FormSkeleton />;

  return (
    <div style={{ textAlign: 'left' }}>
      {/* Editor Headers and Toggles */}
      <div className="flex justify-between items-center mb-4">
        <div className="admin-editor-tabs" style={{ marginBottom: 0 }}>
          <button 
            className={`admin-editor-tab ${activeTab === 'edit' ? 'active' : ''}`}
            onClick={() => setActiveTab('edit')}
          >
            <span className="flex items-center gap-2"><Edit3 size={16} /> Edit Elements</span>
          </button>
          <button 
            className={`admin-editor-tab ${activeTab === 'preview' ? 'active' : ''}`}
            onClick={() => setActiveTab('preview')}
          >
            <span className="flex items-center gap-2"><Eye size={16} /> Live Preview</span>
          </button>
        </div>

        {activeTab === 'edit' && (
          <button className="admin-btn admin-btn-primary" onClick={handleSave}>
            <Save size={16} /> Save Changes (2s delay)
          </button>
        )}
      </div>

      {/* EDITING FORM PANEL */}
      {activeTab === 'edit' && (
        <form onSubmit={handleSave} className="grid-cols-2" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', alignItems: 'start' }}>
          <div className="flex flex-col gap-4">
            
            {/* Hero Card */}
            <div className="admin-card" style={{ marginBottom: 0 }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--admin-text-heading)', marginBottom: '16px' }}>Hero Section Headlines</h3>
              
              <div className="admin-form-group">
                <label className="admin-form-label">Hero Title Headline</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  value={homepageData.heroTitle}
                  onChange={(e) => handleInputChange('heroTitle', e.target.value)}
                  required
                />
              </div>

              <div className="admin-form-group" style={{ marginBottom: 0 }}>
                <label className="admin-form-label">Hero Subtitle Paragraph</label>
                <textarea 
                  className="admin-textarea" 
                  value={homepageData.heroSubtitle}
                  onChange={(e) => handleInputChange('heroSubtitle', e.target.value)}
                  required
                ></textarea>
              </div>
            </div>

            {/* CTAs / Buttons Card */}
            <div className="admin-card" style={{ marginBottom: 0 }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--admin-text-heading)', marginBottom: '16px' }}>Buttons & Call To Actions</h3>
              
              <div className="grid-cols-2">
                <div className="admin-form-group">
                  <label className="admin-form-label">Hero Button Title</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    value={homepageData.heroBtnText}
                    onChange={(e) => handleInputChange('heroBtnText', e.target.value)}
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Hero Button Link</label>
                  <div style={{ position: 'relative' }}>
                    <LinkIcon size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-body)' }} />
                    <input 
                      type="text" 
                      className="admin-input" 
                      style={{ paddingLeft: '32px' }}
                      value={homepageData.heroBtnLink}
                      onChange={(e) => handleInputChange('heroBtnLink', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="grid-cols-2" style={{ marginBottom: 0 }}>
                <div className="admin-form-group" style={{ marginBottom: 0 }}>
                  <label className="admin-form-label">CTA Offer Button Title</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    value={homepageData.ctaBtnText}
                    onChange={(e) => handleInputChange('ctaBtnText', e.target.value)}
                  />
                </div>
                <div className="admin-form-group" style={{ marginBottom: 0 }}>
                  <label className="admin-form-label">CTA Offer Button Link</label>
                  <div style={{ position: 'relative' }}>
                    <LinkIcon size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-body)' }} />
                    <input 
                      type="text" 
                      className="admin-input" 
                      style={{ paddingLeft: '32px' }}
                      value={homepageData.ctaBtnLink}
                      onChange={(e) => handleInputChange('ctaBtnLink', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonials Card */}
            <div className="admin-card" style={{ marginBottom: 0 }}>
              <div className="flex justify-between items-center mb-4">
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--admin-text-heading)', marginBottom: 0 }}>Customer Testimonials</h3>
                <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={addTestimonial}>
                  <Plus size={14} /> Add Testimonial
                </button>
              </div>

              {homepageData.testimonials.map((t, idx) => (
                <div key={t.id} style={{ borderBottom: idx !== homepageData.testimonials.length - 1 ? '1px solid var(--admin-border)' : 'none', paddingBottom: '16px', marginBottom: '16px' }}>
                  <div className="grid-cols-2" style={{ marginBottom: '8px' }}>
                    <div className="admin-form-group" style={{ marginBottom: 0 }}>
                      <label className="admin-form-label">Client Name</label>
                      <input 
                        type="text" 
                        className="admin-input" 
                        value={t.name}
                        onChange={(e) => handleTestimonialChange(idx, 'name', e.target.value)}
                        required
                      />
                    </div>
                    <div className="admin-form-group" style={{ marginBottom: 0 }}>
                      <label className="admin-form-label">Client Position/Role</label>
                      <input 
                        type="text" 
                        className="admin-input" 
                        value={t.role}
                        placeholder="e.g. Director at ABC Corp"
                        onChange={(e) => handleTestimonialChange(idx, 'role', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: '8px' }}>
                    <label className="admin-form-label">Review Quotation</label>
                    <textarea 
                      className="admin-textarea" 
                      style={{ minHeight: '60px' }}
                      value={t.content}
                      onChange={(e) => handleTestimonialChange(idx, 'content', e.target.value)}
                      required
                    ></textarea>
                  </div>
                  {homepageData.testimonials.length > 1 && (
                    <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm text-danger" style={{ color: '#EF4444' }} onClick={() => removeTestimonial(idx)}>
                      <Trash2 size={12} /> Remove Review
                    </button>
                  )}
                </div>
              ))}
            </div>

          </div>

          {/* Right Column: Features and footer */}
          <div className="flex flex-col gap-4">
            
            {/* Features / Banners */}
            <div className="admin-card" style={{ marginBottom: 0 }}>
              <div className="flex justify-between items-center mb-4">
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--admin-text-heading)', marginBottom: 0 }}>Features / Grid List</h3>
                <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={addOffer}>
                  <Plus size={14} /> Add Card
                </button>
              </div>

              {homepageData.offers.map((offer, idx) => (
                <div key={idx} style={{ padding: '12px', border: '1px solid var(--admin-border)', borderRadius: '8px', marginBottom: '12px' }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Card Header Title</label>
                    <input 
                      type="text" 
                      className="admin-input" 
                      value={offer.title}
                      onChange={(e) => handleOfferChange(idx, 'title', e.target.value)}
                      required
                    />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: '8px' }}>
                    <label className="admin-form-label">Card Sub-Description</label>
                    <textarea 
                      className="admin-textarea"
                      style={{ minHeight: '50px' }}
                      value={offer.desc}
                      onChange={(e) => handleOfferChange(idx, 'desc', e.target.value)}
                      required
                    ></textarea>
                  </div>
                  {homepageData.offers.length > 1 && (
                    <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm text-danger" style={{ color: '#EF4444', padding: '4px 8px' }} onClick={() => removeOffer(idx)}>
                      <Trash2 size={12} /> Remove Card
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Footer Text Box */}
            <div className="admin-card" style={{ marginBottom: 0 }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--admin-text-heading)', marginBottom: '16px' }}>Footer Text</h3>
              <div className="admin-form-group" style={{ marginBottom: 0 }}>
                <label className="admin-form-label">Footer Copyright text</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  value={homepageData.footerText}
                  onChange={(e) => handleInputChange('footerText', e.target.value)}
                />
              </div>
            </div>

          </div>
        </form>
      )}

      {/* RENDERED PREVIEW DRAWER PANEL */}
      {activeTab === 'preview' && (
        <div style={{ border: '1px solid var(--admin-border)', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#FFF', color: '#6B7280' }}>
          
          {/* Public Navbar Preview Header */}
          <div style={{ backgroundColor: '#FFF', borderBottom: '1px solid #E5E7EB', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#111827', fontWeight: 'bold' }}>
              <div style={{ width: '24px', height: '24px', backgroundColor: '#10B981', borderRadius: '4px' }}></div>
              <span>Egreen Technology</span>
            </div>
            <div style={{ display: 'flex', gap: '20px', fontSize: '0.85rem', fontWeight: 500 }}>
              <span style={{ color: '#10B981', borderBottom: '2px solid #10B981', paddingBottom: '4px' }}>Home</span>
              <span>About Us</span>
              <span>Products</span>
              <span>Contact</span>
            </div>
            <button className="admin-btn admin-btn-primary admin-btn-sm" type="button" style={{ borderRadius: '8px', backgroundColor: '#10B981' }}>Get Quote</button>
          </div>

          {/* Hero Section Preview */}
          <div style={{ padding: '80px 24px', textAlign: 'center', background: '#FAFAFA' }}>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: '#111827', maxWidth: '700px', margin: '0 auto 16px', fontFamily: "'Poppins', sans-serif" }}>
              {homepageData.heroTitle}
            </h1>
            <p style={{ fontSize: '1rem', color: '#6B7280', maxWidth: '650px', margin: '0 auto 32px', lineHeight: 1.5 }}>
              {homepageData.heroSubtitle}
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button className="admin-btn admin-btn-primary" style={{ backgroundColor: '#10B981' }} type="button">{homepageData.heroBtnText}</button>
              <button className="admin-btn admin-btn-secondary" type="button" style={{ border: '1px solid #E5E7EB', color: '#111827' }}>{homepageData.ctaBtnText}</button>
            </div>
          </div>

          {/* Grid Offers Preview */}
          <div style={{ padding: '60px 24px', background: '#FFFFFF' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#111827', textAlign: 'center', marginBottom: '40px' }}>Features & Assurances</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px', maxWidth: '1000px', margin: '0 auto' }}>
              {homepageData.offers.map((offer, idx) => (
                <div key={idx} style={{ padding: '24px', border: '1px solid #F3F4F6', borderRadius: '12px', background: '#FAFAFA', textAlign: 'left' }}>
                  <h3 style={{ color: '#111827', fontSize: '1rem', fontWeight: 600, marginBottom: '8px' }}>{offer.title || 'Feature Title'}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#6B7280', lineHeight: 1.5 }}>{offer.desc || 'Feature description.'}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial Section Preview */}
          <div style={{ padding: '60px 24px', background: '#FAFAFA' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#111827', textAlign: 'center', marginBottom: '40px' }}>Client Reviews</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', maxWidth: '900px', margin: '0 auto' }}>
              {homepageData.testimonials.map((t) => (
                <div key={t.id} style={{ padding: '24px', border: '1px solid #E5E7EB', borderRadius: '12px', background: '#FFFFFF', textAlign: 'left' }}>
                  <p style={{ fontStyle: 'italic', fontSize: '0.9rem', color: '#4B5563', marginBottom: '16px' }}>"{t.content || 'Great review text.'}"</p>
                  <div>
                    <strong style={{ display: 'block', color: '#111827', fontSize: '0.88rem' }}>{t.name || 'Client Name'}</strong>
                    <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{t.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Preview */}
          <div style={{ backgroundColor: '#111827', color: '#9CA3AF', padding: '32px 24px', textAlign: 'center', fontSize: '0.8rem' }}>
            <p>{homepageData.footerText}</p>
          </div>

        </div>
      )}
    </div>
  );
};

export default HomepageEditor;
