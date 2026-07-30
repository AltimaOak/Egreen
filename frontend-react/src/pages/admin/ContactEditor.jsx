// Admin Contact Details Editor Component
import React, { useState, useEffect } from 'react';
import { pageService } from '../../services/pageService';
import { useAdmin } from '../../contexts/AdminContext';
import { FormSkeleton } from '../../components/admin/Skeleton';
import { 
  Save, 
  Eye, 
  Edit3, 
  MapPin, 
  Phone, 
  Mail, 
  Clock 
} from 'lucide-react';

const Facebook = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);
const Instagram = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);
const Linkedin = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
);
const Twitter = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
);

const ContactEditor = () => {
  const { showToast } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('edit'); // edit, preview
  const [contactData, setContactData] = useState(null);

  const fetchContactData = async () => {
    try {
      setLoading(true);
      const data = await pageService.getContact();
      setContactData(data);
    } catch (e) {
      showToast('Failed to load contact information.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContactData();
  }, []);

  const handleInputChange = (field, value) => {
    setContactData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    showToast('Saving Changes...', 'loading');
    
    try {
      await pageService.updateContact(contactData);
      showToast('Changes Published Successfully', 'success');
      fetchContactData();
    } catch (err) {
      showToast('Failed to save contact information.', 'error');
    }
  };

  if (loading) return <FormSkeleton />;

  return (
    <div style={{ textAlign: 'left' }}>
      {/* Editor Toggles */}
      <div className="flex justify-between items-center mb-4">
        <div className="admin-editor-tabs" style={{ marginBottom: 0 }}>
          <button 
            className={`admin-editor-tab ${activeTab === 'edit' ? 'active' : ''}`}
            onClick={() => setActiveTab('edit')}
          >
            <span className="flex items-center gap-2"><Edit3 size={16} /> Edit Settings</span>
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
            
            {/* Core Contact Card */}
            <div className="admin-card" style={{ marginBottom: 0 }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--admin-text-heading)', marginBottom: '16px' }}>Core Office Contacts</h3>
              
              <div className="admin-form-group">
                <label className="admin-form-label">Physical Office Address</label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={16} style={{ position: 'absolute', left: '12px', top: '15px', color: 'var(--admin-text-body)' }} />
                  <textarea 
                    className="admin-textarea"
                    style={{ paddingLeft: '38px', minHeight: '80px' }}
                    value={contactData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    required
                  ></textarea>
                </div>
              </div>

              <div className="grid-cols-2">
                <div className="admin-form-group">
                  <label className="admin-form-label">Phone Hotline</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-body)' }} />
                    <input 
                      type="text" 
                      className="admin-input" 
                      style={{ paddingLeft: '38px' }}
                      value={contactData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">WhatsApp Number (e.g. +917942625065)</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-body)' }} />
                    <input 
                      type="text" 
                      className="admin-input" 
                      style={{ paddingLeft: '38px' }}
                      value={contactData.whatsapp}
                      onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="admin-form-group" style={{ marginBottom: 0 }}>
                <label className="admin-form-label">Corporate Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-body)' }} />
                  <input 
                    type="email" 
                    className="admin-input" 
                    style={{ paddingLeft: '38px' }}
                    value={contactData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Embed Map and Work hours */}
            <div className="admin-card" style={{ marginBottom: 0 }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--admin-text-heading)', marginBottom: '16px' }}>Business Hours & Maps</h3>
              
              <div className="admin-form-group">
                <label className="admin-form-label">Working Hours Text</label>
                <div style={{ position: 'relative' }}>
                  <Clock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-body)' }} />
                  <input 
                    type="text" 
                    className="admin-input" 
                    style={{ paddingLeft: '38px' }}
                    placeholder="e.g. Monday - Saturday: 9am - 6pm"
                    value={contactData.workingHours}
                    onChange={(e) => handleInputChange('workingHours', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="admin-form-group" style={{ marginBottom: 0 }}>
                <label className="admin-form-label">Google Maps Embed URL Link</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  placeholder="https://maps.google.com/maps?q=..."
                  value={contactData.googleMapsLink}
                  onChange={(e) => handleInputChange('googleMapsLink', e.target.value)}
                  required
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-body)', marginTop: '4px', display: 'block' }}>
                  Enter a valid iframe source coordinates URL parameter link.
                </span>
              </div>
            </div>

          </div>

          {/* Socials & Footers Column */}
          <div className="flex flex-col gap-4">
            
            {/* Social media handles */}
            <div className="admin-card" style={{ marginBottom: 0 }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--admin-text-heading)', marginBottom: '16px' }}>Social Media Handles</h3>
              
              <div className="admin-form-group">
                <label className="admin-form-label">Facebook Profile Link</label>
                <div style={{ position: 'relative' }}>
                  <Facebook size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-body)' }} />
                  <input 
                    type="text" 
                    className="admin-input" 
                    style={{ paddingLeft: '38px' }}
                    value={contactData.facebook}
                    onChange={(e) => handleInputChange('facebook', e.target.value)}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Instagram Profile Link</label>
                <div style={{ position: 'relative' }}>
                  <Instagram size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-body)' }} />
                  <input 
                    type="text" 
                    className="admin-input" 
                    style={{ paddingLeft: '38px' }}
                    value={contactData.instagram}
                    onChange={(e) => handleInputChange('instagram', e.target.value)}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">LinkedIn Profile Link</label>
                <div style={{ position: 'relative' }}>
                  <Linkedin size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-body)' }} />
                  <input 
                    type="text" 
                    className="admin-input" 
                    style={{ paddingLeft: '38px' }}
                    value={contactData.linkedin}
                    onChange={(e) => handleInputChange('linkedin', e.target.value)}
                  />
                </div>
              </div>

              <div className="admin-form-group" style={{ marginBottom: 0 }}>
                <label className="admin-form-label">Twitter / X Profile Link</label>
                <div style={{ position: 'relative' }}>
                  <Twitter size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-body)' }} />
                  <input 
                    type="text" 
                    className="admin-input" 
                    style={{ paddingLeft: '38px' }}
                    value={contactData.twitter}
                    onChange={(e) => handleInputChange('twitter', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Footer Contact Details */}
            <div className="admin-card" style={{ marginBottom: 0 }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--admin-text-heading)', marginBottom: '16px' }}>Footer Contact Block</h3>
              <div className="admin-form-group" style={{ marginBottom: 0 }}>
                <label className="admin-form-label">Footer Short Address Text</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  value={contactData.footerContact}
                  onChange={(e) => handleInputChange('footerContact', e.target.value)}
                  required
                />
              </div>
            </div>

          </div>
        </form>
      )}

      {/* RENDERED PREVIEW DRAWER PANEL */}
      {activeTab === 'preview' && (
        <div style={{ border: '1px solid var(--admin-border)', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#FFF', color: '#6B7280' }}>
          
          {/* Header Preview */}
          <div style={{ padding: '40px 24px', textAlign: 'center', background: 'var(--admin-bg)', borderBottom: '1px solid var(--admin-border)' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 600, color: '#111827', margin: '0 auto 8px' }}>Contact Us</h1>
            <p style={{ fontSize: '0.95rem', color: '#6B7280', maxWidth: '600px', margin: '0 auto' }}>We're here to help you with quotes, bulk orders, and enterprise support.</p>
          </div>

          {/* Contact Details Grid */}
          <div style={{ padding: '40px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', maxWidth: '1000px', margin: '0 auto', textAlign: 'left' }} className="grid-cols-2">
            
            {/* Contact list details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#111827', marginBottom: '8px' }}>Get In Touch</h2>
              
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <MapPin size={20} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h4 style={{ fontWeight: 600, color: '#111827', fontSize: '0.9rem', marginBottom: '2px' }}>Office Address</h4>
                  <p style={{ fontSize: '0.85rem', color: '#6B7280', whiteSpace: 'pre-line' }}>{contactData.address}</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <Phone size={20} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h4 style={{ fontWeight: 600, color: '#111827', fontSize: '0.9rem', marginBottom: '2px' }}>Phone & WhatsApp</h4>
                  <p style={{ fontSize: '0.85rem', color: '#6B7280' }}>Contact: {contactData.phone}</p>
                  <p style={{ fontSize: '0.85rem', color: '#6B7280' }}>WhatsApp: {contactData.whatsapp}</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <Mail size={20} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h4 style={{ fontWeight: 600, color: '#111827', fontSize: '0.9rem', marginBottom: '2px' }}>Email</h4>
                  <p style={{ fontSize: '0.85rem', color: '#6B7280' }}>{contactData.email}</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <Clock size={20} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h4 style={{ fontWeight: 600, color: '#111827', fontSize: '0.9rem', marginBottom: '2px' }}>Business Hours</h4>
                  <p style={{ fontSize: '0.85rem', color: '#6B7280' }}>{contactData.workingHours}</p>
                </div>
              </div>

              {/* Social profile list preview */}
              <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '16px', marginTop: '8px' }}>
                <h4 style={{ fontWeight: 600, color: '#111827', fontSize: '0.9rem', marginBottom: '12px' }}>Follow Us</h4>
                <div style={{ display: 'flex', gap: '16px' }}>
                  {contactData.facebook && <Facebook size={18} color="#4B5563" />}
                  {contactData.instagram && <Instagram size={18} color="#4B5563" />}
                  {contactData.linkedin && <Linkedin size={18} color="#4B5563" />}
                  {contactData.twitter && <Twitter size={18} color="#4B5563" />}
                </div>
              </div>
            </div>

            {/* Google Map Preview */}
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#111827', marginBottom: '16px' }}>Google Maps Location</h2>
              <div style={{ width: '100%', height: '320px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #E5E7EB' }}>
                {contactData.googleMapsLink ? (
                  <iframe 
                    src={contactData.googleMapsLink}
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen="" 
                    loading="lazy" 
                    title="Google Maps Location"
                  ></iframe>
                ) : (
                  <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--admin-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    No Map Configured
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Footer Contact block preview */}
          <div style={{ borderTop: '1px solid #E5E7EB', padding: '24px', backgroundColor: '#FAFAFA', fontSize: '0.8rem', textAlign: 'center' }}>
            <strong>Footer Address segment:</strong> <span style={{ color: '#4B5563' }}>{contactData.footerContact}</span>
          </div>

        </div>
      )}
    </div>
  );
};

export default ContactEditor;
