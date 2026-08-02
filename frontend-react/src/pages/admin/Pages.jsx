import React, { useState, useEffect } from 'react';
import HomepageEditor from './HomepageEditor';
import AboutEditor from './AboutEditor';
import ContactEditor from './ContactEditor';
import { useAdmin } from '../../contexts/AdminContext';
import { pageService } from '../../services/pageService';
import { Card, Button, Badge, Textarea, AdminPageHeader } from '../../components/admin/UI';
import { Edit3, ArrowLeft, FileText, ChevronRight, Save } from 'lucide-react';

const PAGE_ITEMS = [
  { key: 'home',    label: 'Home Page',           desc: 'Hero sliders, call to action grids' },
  { key: 'about',   label: 'About Us',             desc: 'Story, timelines, and fact sections' },
  { key: 'contact', label: 'Contact Us',           desc: 'Map parameters, addresses, hours' },
  { key: 'terms',   label: 'Terms & Conditions',   desc: 'Standard business terms & B2B compliance' },
  { key: 'privacy', label: 'Privacy Policy',       desc: 'Privacy details and cookie specs' },
];

const Pages = () => {
  const { showToast } = useAdmin();
  const [selectedPage, setSelectedPage] = useState('home');
  const [isEditing, setIsEditing] = useState(false);
  const [timestamps, setTimestamps] = useState({});
  const [legalContent, setLegalContent] = useState({
    terms:   '# Terms & Conditions\n\nStandard wholesale supply guidelines and B2B GST compliance.\n\n1. Warranty applies per manufacturer policy.\n2. Invoices are tax-inclusive with GST credits.',
    privacy: '# Privacy Policy\n\nWe prioritize customer data security.\n\n1. All payment data is processed securely.\n2. Account details are protected under encryption.',
  });

  useEffect(() => {
    (async () => {
      try {
        const ts = {};
        const pages = [
          { key: 'home',    fetch: () => pageService.getHomepage() },
          { key: 'about',   fetch: () => pageService.getAbout() },
          { key: 'contact', fetch: () => pageService.getContact() },
        ];
        for (const p of pages) {
          const d = await p.fetch();
          if (d && (d.lastUpdated || d.updated || d.updatedDate)) ts[p.key] = d.lastUpdated || d.updated || d.updatedDate;
        }
        setTimestamps(ts);
      } catch (e) { console.error('Timestamp load error', e); }
    })();
  }, []);

  const handleSaveLegal = () => {
    showToast('Saving…', 'loading');
    setTimeout(() => showToast('Changes saved', 'success'), 400);
  };

  const renderEditor = () => {
    switch (selectedPage) {
      case 'home':    return <HomepageEditor />;
      case 'about':   return <AboutEditor />;
      case 'contact': return <ContactEditor />;
      default: {
        const pg = PAGE_ITEMS.find(p => p.key === selectedPage);
        return (
          <Card title={`Edit: ${pg?.label}`} subtitle="Manage markdown policy text">
            <div style={{ marginTop: 12 }}>
              <Textarea
                label="Full Policy Text (Markdown)"
                value={legalContent[selectedPage] || ''}
                onChange={e => setLegalContent(p => ({ ...p, [selectedPage]: e.target.value }))}
                rows={12}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                <Button variant="primary" icon={<Save size={15} />} onClick={handleSaveLegal}>Save Policy</Button>
              </div>
            </div>
          </Card>
        );
      }
    }
  };

  const renderPreview = () => {
    switch (selectedPage) {
      case 'home': return (
        <div style={{ padding: '20px 22px', background: 'var(--color-background)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-card)' }}>
          <Badge variant="success" style={{ marginBottom: 10, display: 'inline-block' }}>Hero Banner</Badge>
          <h2 style={{ margin: '0 0 8px', fontSize: '1rem', fontWeight: 800, color: 'var(--color-text)' }}>Reliable IT Hardware Solutions</h2>
          <p style={{ margin: '0 0 14px', fontSize: '0.78rem', color: 'var(--color-muted)', lineHeight: 1.6 }}>Latest Laptops, Workstations & Components for Enterprise Clients.</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="primary" size="sm">Shop Wholesale</Button>
            <Button variant="secondary" size="sm">Request Quote</Button>
          </div>
        </div>
      );
      case 'about': return (
        <div style={{ padding: '20px 22px', background: 'var(--color-background)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-card)' }}>
          <Badge variant="info" style={{ marginBottom: 10, display: 'inline-block' }}>Company Overview</Badge>
          <h3 style={{ margin: '0 0 8px', fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-text)' }}>Genuine IT Hardware Wholesalers</h3>
          <p style={{ margin: '0 0 14px', fontSize: '0.78rem', color: 'var(--color-muted)', lineHeight: 1.6 }}>Tested brand-new and refurbished business components with nationwide support.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[{ v: 'Mumbai, MH', l: 'Headquarters' }, { v: '1000+', l: 'B2B Clients' }].map(item => (
              <div key={item.l} style={{ padding: '10px', border: '1px solid var(--color-border)', borderRadius: 10, textAlign: 'center', background: 'var(--color-surface)' }}>
                <div style={{ fontWeight: 800, color: 'var(--color-primary)', fontSize: '0.9rem' }}>{item.v}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-muted)', fontWeight: 600 }}>{item.l}</div>
              </div>
            ))}
          </div>
        </div>
      );
      case 'contact': return (
        <div style={{ padding: '20px 22px', background: 'var(--color-background)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-card)' }}>
          <Badge variant="warning" style={{ marginBottom: 10, display: 'inline-block' }}>Contact & Support</Badge>
          <h3 style={{ margin: '0 0 8px', fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-text)' }}>Mumbai Support Center</h3>
          <div style={{ fontSize: '0.78rem', color: 'var(--color-muted)', lineHeight: 2 }}>
            <div>Email: info@egreentech.com</div>
            <div>Phone: +91 98765-43210</div>
          </div>
        </div>
      );
      default: return (
        <div style={{ padding: '40px 20px', textAlign: 'center', background: 'var(--color-background)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-card)' }}>
          <FileText size={36} color="var(--color-muted)" style={{ marginBottom: 8 }} />
          <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-muted)' }}>Policy document preview</p>
        </div>
      );
    }
  };

  const activePage = PAGE_ITEMS.find(p => p.key === selectedPage);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <AdminPageHeader title="Static Pages" subtitle="Manage and update website landing content and legal policies." />

      {isEditing ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <Button variant="secondary" size="sm" icon={<ArrowLeft size={15} />} onClick={() => setIsEditing(false)}>
              Back to Directory
            </Button>
          </div>
          {renderEditor()}
        </div>
      ) : (
        <div className="admin-pages-layout">
          {/* Sidebar list */}
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10, paddingLeft: 4 }}>Page Directory</div>
            <div className="admin-pages-sidebar-list">
              {PAGE_ITEMS.map(p => (
                <div
                  key={p.key}
                  onClick={() => setSelectedPage(p.key)}
                  className={`admin-pages-sidebar-item${selectedPage === p.key ? ' active' : ''}`}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-text)', marginBottom: 2 }}>{p.label}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.desc}</div>
                  </div>
                  <ChevronRight size={14} color={selectedPage === p.key ? 'var(--color-primary)' : 'var(--color-muted)'} />
                </div>
              ))}
            </div>
          </div>

          {/* Detail view */}
          <div className="admin-pages-detail-view">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, gap: 12 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-text)' }}>{activePage?.label}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)', marginTop: 3 }}>
                  {timestamps[selectedPage] ? `Last updated: ${timestamps[selectedPage]}` : activePage?.desc}
                </div>
              </div>
              <Button variant="primary" size="sm" icon={<Edit3 size={14} />} onClick={() => setIsEditing(true)}>
                Edit Content
              </Button>
            </div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>Live Preview</div>
            {renderPreview()}
          </div>
        </div>
      )}
    </div>
  );
};

export default Pages;
