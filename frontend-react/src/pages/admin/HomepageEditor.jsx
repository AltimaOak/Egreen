// Admin Homepage Content Editor Component — Redesigned
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
  Plus,
  Trash2,
  Link as LinkIcon,
} from 'lucide-react';

const HomepageEditor = () => {
  const { showToast } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('edit');
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
    setHomepageData((prev) => ({ ...prev, [field]: value }));
  };

  const handleOfferChange = (index, field, value) => {
    const updated = [...homepageData.offers];
    updated[index][field] = value;
    setHomepageData((prev) => ({ ...prev, offers: updated }));
  };

  const addOffer = () => {
    if (homepageData.offers.length >= 8) {
      showToast('Maximum 8 features/offers allowed.', 'warning');
      return;
    }
    setHomepageData((prev) => ({
      ...prev,
      offers: [...prev.offers, { title: '', desc: '' }],
    }));
  };

  const removeOffer = (index) => {
    const updated = homepageData.offers.filter((_, idx) => idx !== index);
    setHomepageData((prev) => ({ ...prev, offers: updated }));
  };

  const handleTestimonialChange = (index, field, value) => {
    const updated = [...homepageData.testimonials];
    updated[index][field] = value;
    setHomepageData((prev) => ({ ...prev, testimonials: updated }));
  };

  const addTestimonial = () => {
    setHomepageData((prev) => ({
      ...prev,
      testimonials: [...prev.testimonials, { id: Date.now(), name: '', role: '', content: '' }],
    }));
  };

  const removeTestimonial = (index) => {
    const updated = homepageData.testimonials.filter((_, idx) => idx !== index);
    setHomepageData((prev) => ({ ...prev, testimonials: updated }));
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
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
    <div className="space-y-6">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Homepage Editor</h1>
          <p className="admin-page-subtitle">Edit hero headlines, features, and footer content.</p>
        </div>
        {activeTab === 'edit' && (
          <Button variant="primary" size="md" icon={<Save size={16} />} onClick={handleSave}>
            Save Changes
          </Button>
        )}
      </div>

      {/* Tab selector */}
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
            <Collapsible title="Hero Section" icon={<Edit3 size={16} />} defaultOpen={true}>
              <Input
                label="Hero Title Headline"
                placeholder="Reliable New & Refurbished IT Hardware Solutions"
                value={homepageData.heroTitle || ''}
                onChange={(e) => handleInputChange('heroTitle', e.target.value)}
                required
              />
              <Textarea
                label="Hero Subtitle Paragraph"
                value={homepageData.heroSubtitle || ''}
                onChange={(e) => handleInputChange('heroSubtitle', e.target.value)}
                required
                minHeight="80px"
              />
            </Collapsible>

            <Collapsible title="Call to Action Buttons" icon={<LinkIcon size={16} />} defaultOpen={true}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Hero Button Title"
                  value={homepageData.heroBtnText || ''}
                  onChange={(e) => handleInputChange('heroBtnText', e.target.value)}
                />
                <Input
                  label="Hero Button Link"
                  icon={<LinkIcon size={14} />}
                  value={homepageData.heroBtnLink || ''}
                  onChange={(e) => handleInputChange('heroBtnLink', e.target.value)}
                />
                <Input
                  label="CTA Offer Button Title"
                  value={homepageData.ctaBtnText || ''}
                  onChange={(e) => handleInputChange('ctaBtnText', e.target.value)}
                />
                <Input
                  label="CTA Offer Button Link"
                  icon={<LinkIcon size={14} />}
                  value={homepageData.ctaBtnLink || ''}
                  onChange={(e) => handleInputChange('ctaBtnLink', e.target.value)}
                />
              </div>
            </Collapsible>

            <Collapsible title="Features / Grid Cards" icon={<Plus size={14} />} defaultOpen={true}>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs text-muted font-medium">{homepageData.offers.length} / 8 cards</span>
                <Button variant="ghost" size="sm" icon={<Plus size={14} />} onClick={addOffer}>
                  Add Card
                </Button>
              </div>
              {homepageData.offers.map((offer, idx) => (
                <Card key={idx} padding="sm" className="mb-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-text">Card #{idx + 1}</span>
                    {homepageData.offers.length > 1 && (
                      <button
                        type="button"
                        className="text-danger text-xs hover:text-danger/80 flex items-center gap-1 cursor-pointer"
                        onClick={() => removeOffer(idx)}
                      >
                        <Trash2 size={12} /> Remove
                      </button>
                    )}
                  </div>
                  <Input
                    label="Card Header Title"
                    value={offer.title || ''}
                    onChange={(e) => handleOfferChange(idx, 'title', e.target.value)}
                    required
                  />
                  <Textarea
                    label="Card Sub-Description"
                    value={offer.desc || ''}
                    onChange={(e) => handleOfferChange(idx, 'desc', e.target.value)}
                    required
                    minHeight="50px"
                  />
                </Card>
              ))}
            </Collapsible>

            <Collapsible title="Customer Testimonials" icon={<Edit3 size={16} />} defaultOpen={true}>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs text-muted font-medium">{homepageData.testimonials.length} testimonials</span>
                <Button variant="ghost" size="sm" icon={<Plus size={14} />} onClick={addTestimonial}>
                  Add Testimonial
                </Button>
              </div>
              {homepageData.testimonials.map((t, idx) => (
                <Card key={t.id} padding="sm" className="mb-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Client Name"
                      value={t.name || ''}
                      onChange={(e) => handleTestimonialChange(idx, 'name', e.target.value)}
                      required
                    />
                    <Input
                      label="Client Position/Role"
                      placeholder="e.g. Director at ABC Corp"
                      value={t.role || ''}
                      onChange={(e) => handleTestimonialChange(idx, 'role', e.target.value)}
                      required
                    />
                  </div>
                  <Textarea
                    label="Review Quotation"
                    value={t.content || ''}
                    onChange={(e) => handleTestimonialChange(idx, 'content', e.target.value)}
                    required
                    minHeight="60px"
                  />
                  {homepageData.testimonials.length > 1 && (
                    <button
                      type="button"
                      className="text-danger text-xs hover:text-danger/80 mt-2 flex items-center gap-1 cursor-pointer"
                      onClick={() => removeTestimonial(idx)}
                    >
                      <Trash2 size={12} /> Remove Review
                    </button>
                  )}
                </Card>
              ))}
            </Collapsible>

            <Collapsible title="Footer Text" icon={<Edit3 size={16} />} defaultOpen={true}>
              <Input
                label="Footer Copyright text"
                value={homepageData.footerText || ''}
                onChange={(e) => handleInputChange('footerText', e.target.value)}
              />
            </Collapsible>
          </div>
        </form>
      )}

      {/* Live preview */}
      {activeTab === 'preview' && (
        <Card padding="none" className="overflow-hidden bg-white text-muted">
          {/* Preview header (site nav) */}
          <div className="bg-white border-b border-border px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2 font-bold text-text">
              <div className="w-6 h-6 rounded bg-primary flex items-center justify-center text-white text-xs">E</div>
              Egreen Technology
            </div>
            <div className="flex gap-5 text-sm font-medium">
              <span className="text-primary border-b-2 border-primary pb-1">Home</span>
              <span className="text-muted">About Us</span>
              <span className="text-muted">Products</span>
              <span className="text-muted">Contact</span>
            </div>
          </div>

          {/* Hero section preview */}
          <div className="px-8 py-16 text-center bg-muted/5">
            <h1 className="text-3xl font-bold text-text mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              {homepageData.heroTitle || 'Hero Title'}
            </h1>
            <p className="text-base text-muted max-w-2xl mx-auto mb-8">
              {homepageData.heroSubtitle || 'Hero subtitle'}
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="primary">{homepageData.heroBtnText || 'Explore Products'}</Button>
              <Button variant="secondary">{homepageData.ctaBtnText || 'Request Quote'}</Button>
            </div>
          </div>

          {/* Features grid preview */}
          <div className="px-8 py-12 bg-white">
            <h2 className="text-xl font-semibold text-text text-center mb-8">Features & Assurances</h2>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-6 max-w-3xl mx-auto">
              {homepageData.offers.map((offer, idx) => (
                <div key={idx} className="p-5 border border-border rounded-[var(--radius-card)] bg-muted/3">
                  <h3 className="font-semibold text-text mb-1">{offer.title || 'Feature Title'}</h3>
                  <p className="text-xs text-muted">{offer.desc || 'Feature description.'}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonials preview */}
          <div className="px-8 py-12 bg-muted/5">
            <h2 className="text-xl font-semibold text-text text-center mb-8">Client Reviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {homepageData.testimonials.map((t) => (
                <div key={t.id} className="p-5 border border-border rounded-[var(--radius-card)] bg-white">
                  <p className="italic text-sm text-muted mb-3">"{t.content || 'Great review text.'}"</p>
                  <div>
                    <strong className="text-sm text-text block">{t.name || 'Client Name'}</strong>
                    <span className="text-xs text-muted">{t.role || 'Position'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer preview */}
          <div className="bg-text text-muted py-4 text-center text-xs">
            {homepageData.footerText || '© 2026 Egreen Technology. All rights reserved.'}
          </div>
        </Card>
      )}
    </div>
  );
};

export default HomepageEditor;
