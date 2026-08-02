// Admin Contact Details Editor Component â€” Redesigned
import React, { useState, useEffect } from 'react';
import { pageService } from '../../services/pageService';
import { useAdmin } from '../../contexts/AdminContext';
import { FormSkeleton } from '../../components/admin/Skeleton';
import {
  Card,
  Button,
  Tabs,
  Collapsible,
  Input,
  Textarea,
} from '../../components/admin/UI';
import {
  Save,
  Edit3,
  MapPin,
  Phone,
  Mail,
  Clock,
  Globe,
} from 'lucide-react';

const Facebook = ({ size = 16, color = 'var(--color-muted)' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const Instagram = ({ size = 16, color = 'var(--color-muted)' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);
const Linkedin = ({ size = 16, color = 'var(--color-muted)' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" radius="2" />
  </svg>
);
const TwitterX = ({ size = 16, color = 'var(--color-muted)' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3v1m12 0v1M7 20h10a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2z" />
    <path d="M9 15l3-3 3 3" />
    <path d="M9 11l3-3 3 3" />
  </svg>
);

const ContactEditor = () => {
  const { showToast } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('edit');
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
    setContactData((prev) => ({ ...prev, [field]: value }));
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
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Contact Editor</h1>
          <p className="admin-page-subtitle">Edit office address, contact details, map link, and social media handles.</p>
        </div>
        {activeTab === 'edit' && (
          <Button variant="primary" size="md" icon={<Save size={16} />} onClick={handleSave}>
            Save Changes
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <Tabs
          tabs={['Edit Elements', 'Live Preview']}
          activeTab={activeTab === 'edit' ? 'Edit Elements' : 'Live Preview'}
          onChange={(tab) => setActiveTab(tab === 'Edit Elements' ? 'edit' : 'preview')}
        />
      </div>

      {/* Edit form */}
      {activeTab === 'edit' && (
        <form onSubmit={handleSave}>
          <div className="space-y-4">
            <Collapsible title="Core Office Contacts" icon={<MapPin size={16} />} defaultOpen>
              <div className="relative">
                <span className="absolute left-3 top-9 text-muted"><MapPin size={16} /></span>
                <Textarea
                  label="Physical Office Address"
                  placeholder="Enter full office address"
                  value={contactData.address || ''}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  required
                  minHeight="80px"
                  style={{ paddingLeft: '36px' }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="relative">
                  <span className="absolute left-3 top-9 text-muted"><Phone size={16} /></span>
                  <Input
                    label="Phone Hotline"
                    value={contactData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                    style={{ paddingLeft: '36px' }}
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-9 text-muted"><Phone size={16} /></span>
                  <Input
                    label="WhatsApp Number"
                    placeholder="e.g. +917942625065"
                    value={contactData.whatsapp || ''}
                    onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                    required
                    style={{ paddingLeft: '36px' }}
                  />
                </div>
              </div>

              <div className="relative mt-4">
                <span className="absolute left-3 top-9 text-muted"><Mail size={16} /></span>
                <Input
                  type="email"
                  label="Corporate Email Address"
                  value={contactData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  style={{ paddingLeft: '36px' }}
                />
              </div>
            </Collapsible>

            <Collapsible title="Business Hours & Maps" icon={<Clock size={16} />} defaultOpen={false}>
              <div className="relative">
                <span className="absolute left-3 top-9 text-muted"><Clock size={16} /></span>
                <Input
                  label="Working Hours Text"
                  placeholder="e.g. Monday - Saturday: 9am - 6pm"
                  value={contactData.workingHours || ''}
                  onChange={(e) => handleInputChange('workingHours', e.target.value)}
                  required
                  style={{ paddingLeft: '36px' }}
                />
              </div>

              <div className="mt-4">
                <Input
                  label="Google Maps Embed URL Link"
                  placeholder="https://maps.google.com/maps?q=..."
                  value={contactData.googleMapsLink || ''}
                  onChange={(e) => handleInputChange('googleMapsLink', e.target.value)}
                  required
                  icon={<Globe size={14} />}
                />
                <p className="text-xs text-muted mt-1">
                  Enter a valid iframe source coordinates URL parameter link.
                </p>
              </div>
            </Collapsible>

            <Collapsible title="Social Media Handles" icon={<Globe size={16} />} defaultOpen={false}>
              <div className="space-y-4">
                <div className="relative">
                  <span className="absolute left-3 top-9"><Facebook size={16} /></span>
                  <Input
                    label="Facebook Profile Link"
                    value={contactData.facebook || ''}
                    onChange={(e) => handleInputChange('facebook', e.target.value)}
                    style={{ paddingLeft: '36px' }}
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-9"><Instagram size={16} /></span>
                  <Input
                    label="Instagram Profile Link"
                    value={contactData.instagram || ''}
                    onChange={(e) => handleInputChange('instagram', e.target.value)}
                    style={{ paddingLeft: '36px' }}
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-9"><Linkedin size={16} /></span>
                  <Input
                    label="LinkedIn Profile Link"
                    value={contactData.linkedin || ''}
                    onChange={(e) => handleInputChange('linkedin', e.target.value)}
                    style={{ paddingLeft: '36px' }}
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-9"><TwitterX size={16} /></span>
                  <Input
                    label="Twitter / X Profile Link"
                    value={contactData.twitter || ''}
                    onChange={(e) => handleInputChange('twitter', e.target.value)}
                    style={{ paddingLeft: '36px' }}
                  />
                </div>
              </div>
            </Collapsible>

            <Collapsible title="Footer Contact Block" icon={<Edit3 size={16} />} defaultOpen={false}>
              <Input
                label="Footer Short Address Text"
                value={contactData.footerContact || ''}
                onChange={(e) => handleInputChange('footerContact', e.target.value)}
                required
              />
            </Collapsible>
          </div>
        </form>
      )}

      {/* Live preview */}
      {activeTab === 'preview' && (
        <Card padding="none" className="overflow-hidden bg-white">
          <div className="px-8 py-12 text-center border-b border-border">
            <h1 className="admin-page-title mb-2" style={{ color: 'var(--color-text-heading)' }}>Contact Us</h1>
            <p className="text-sm text-muted">
              We're here to help you with quotes, bulk orders, and enterprise support.
            </p>
          </div>

          <div className="px-8 py-10 grid grid-cols-2 gap-10 max-w-5xl mx-auto">
            <div className="space-y-6 text-left">
              <h2 className="text-lg font-semibold text-text mb-1">Get In Touch</h2>

              <div className="flex gap-4 items-start">
                <span className="text-primary mt-0.5 flex-shrink-0"><MapPin size={20} /></span>
                <div>
                  <h4 className="font-medium text-sm text-text mb-1">Office Address</h4>
                  <p className="text-sm text-muted whitespace-pre-line">{contactData.address || 'Address not set'}</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <span className="text-primary mt-0.5 flex-shrink-0"><Phone size={20} /></span>
                <div>
                  <h4 className="font-medium text-sm text-text mb-1">Phone & WhatsApp</h4>
                  <p className="text-sm text-muted">Contact: {contactData.phone || 'â€”'}</p>
                  <p className="text-sm text-muted">WhatsApp: {contactData.whatsapp || 'â€”'}</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <span className="text-primary mt-0.5 flex-shrink-0"><Mail size={20} /></span>
                <div>
                  <h4 className="font-medium text-sm text-text mb-1">Email</h4>
                  <p className="text-sm text-muted">{contactData.email || 'â€”'}</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <span className="text-primary mt-0.5 flex-shrink-0"><Clock size={20} /></span>
                <div>
                  <h4 className="font-medium text-sm text-text mb-1">Business Hours</h4>
                  <p className="text-sm text-muted">{contactData.workingHours || 'â€”'}</p>
                </div>
              </div>

              <div className="border-t border-border pt-4 mt-2">
                <h4 className="font-medium text-sm text-text mb-3">Follow Us</h4>
                <div className="flex gap-4">
                  {contactData.facebook && <Facebook size={18} color="var(--color-muted)" />}
                  {contactData.instagram && <Instagram size={18} color="var(--color-muted)" />}
                  {contactData.linkedin && <Linkedin size={18} color="var(--color-muted)" />}
                  {contactData.twitter && <TwitterX size={18} color="var(--color-muted)" />}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-text mb-3">Google Maps Location</h2>
              <div className="w-full h-64 rounded-[var(--radius-card)] overflow-hidden border border-border">
                {contactData.googleMapsLink ? (
                  <iframe
                    src={contactData.googleMapsLink}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    title="Google Maps Location"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted bg-muted/3">
                    No Map Configured
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-border px-6 py-4 text-center text-xs text-muted">
            <strong>Footer Address segment:</strong> {contactData.footerContact || 'â€”'}
          </div>
        </Card>
      )}
    </div>
  );
};

export default ContactEditor;

