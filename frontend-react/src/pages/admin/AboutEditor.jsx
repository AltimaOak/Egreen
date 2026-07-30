// Admin About Page Content Editor Component
import React, { useState, useEffect } from 'react';
import { pageService } from '../../services/pageService';
import { useAdmin } from '../../contexts/AdminContext';
import { FormSkeleton } from '../../components/admin/Skeleton';
import { 
  Save, 
  Eye, 
  Edit3, 
  Plus, 
  Trash2 
} from 'lucide-react';

const AboutEditor = () => {
  const { showToast } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('edit'); // edit, preview
  const [aboutData, setAboutData] = useState(null);

  const fetchAboutData = async () => {
    try {
      setLoading(true);
      const data = await pageService.getAbout();
      setAboutData(data);
    } catch (e) {
      showToast('Failed to load about page details.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutData();
  }, []);

  const handleInputChange = (field, value) => {
    setAboutData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Facts helpers
  const handleFactChange = (index, field, value) => {
    const updated = [...aboutData.facts];
    updated[index][field] = value;
    setAboutData(prev => ({ ...prev, facts: updated }));
  };

  // Timeline helpers
  const handleTimelineChange = (index, field, value) => {
    const updated = [...aboutData.timeline];
    updated[index][field] = value;
    setAboutData(prev => ({ ...prev, timeline: updated }));
  };

  const addTimelineItem = () => {
    setAboutData(prev => ({
      ...prev,
      timeline: [...prev.timeline, { year: '', title: '', desc: '' }]
    }));
  };

  const removeTimelineItem = (index) => {
    const updated = aboutData.timeline.filter((_, idx) => idx !== index);
    setAboutData(prev => ({ ...prev, timeline: updated }));
  };

  // Achievements helpers
  const handleAchievementChange = (index, value) => {
    const updated = [...aboutData.achievements];
    updated[index] = value;
    setAboutData(prev => ({ ...prev, achievements: updated }));
  };

  const addAchievement = () => {
    setAboutData(prev => ({
      ...prev,
      achievements: [...prev.achievements, '']
    }));
  };

  const removeAchievement = (index) => {
    const updated = aboutData.achievements.filter((_, idx) => idx !== index);
    setAboutData(prev => ({ ...prev, achievements: updated }));
  };

  // Team helpers
  const handleTeamChange = (index, field, value) => {
    const updated = [...aboutData.team];
    updated[index][field] = value;
    setAboutData(prev => ({ ...prev, team: updated }));
  };

  const addTeamMember = () => {
    setAboutData(prev => ({
      ...prev,
      team: [...prev.team, { id: Date.now(), name: '', role: '', image: '' }]
    }));
  };

  const removeTeamMember = (index) => {
    const updated = aboutData.team.filter((_, idx) => idx !== index);
    setAboutData(prev => ({ ...prev, team: updated }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    showToast('Saving Changes...', 'loading');
    
    try {
      await pageService.updateAbout(aboutData);
      showToast('Changes Published Successfully', 'success');
      fetchAboutData();
    } catch (err) {
      showToast('Failed to save about page details.', 'error');
    }
  };

  if (loading) return <FormSkeleton />;

  return (
    <div style={{ textAlign: 'left' }}>
      {/* Tab Selectors */}
      <div className="flex justify-between items-center mb-4">
        <div className="admin-editor-tabs" style={{ marginBottom: 0 }}>
          <button 
            className={`admin-editor-tab ${activeTab === 'edit' ? 'active' : ''}`}
            onClick={() => setActiveTab('edit')}
          >
            <span className="flex items-center gap-2"><Edit3 size={16} /> Edit Details</span>
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

      {/* EDIT CONTENT FORM */}
      {activeTab === 'edit' && (
        <form onSubmit={handleSave} className="grid-cols-2" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', alignItems: 'start' }}>
          
          {/* Main Panel fields */}
          <div className="flex flex-col gap-4">
            
            {/* Headers / Story Card */}
            <div className="admin-card" style={{ marginBottom: 0 }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--admin-text-heading)', marginBottom: '16px' }}>Story & Title Headlines</h3>
              
              <div className="admin-form-group">
                <label className="admin-form-label">About Page Title</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  value={aboutData.heroTitle}
                  onChange={(e) => handleInputChange('heroTitle', e.target.value)}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Hero Subtitle</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  value={aboutData.heroSubtitle}
                  onChange={(e) => handleInputChange('heroSubtitle', e.target.value)}
                  required
                />
              </div>

              <div className="admin-form-group" style={{ marginBottom: 0 }}>
                <label className="admin-form-label">Detailed Company Story</label>
                <textarea 
                  className="admin-textarea"
                  style={{ minHeight: '120px' }}
                  value={aboutData.story}
                  onChange={(e) => handleInputChange('story', e.target.value)}
                  required
                ></textarea>
              </div>
            </div>

            {/* Mission & Vision Statements */}
            <div className="admin-card" style={{ marginBottom: 0 }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--admin-text-heading)', marginBottom: '16px' }}>Mission & Vision Statements</h3>
              
              <div className="admin-form-group">
                <label className="admin-form-label">Our Mission Statement</label>
                <textarea 
                  className="admin-textarea"
                  style={{ minHeight: '80px' }}
                  value={aboutData.mission}
                  onChange={(e) => handleInputChange('mission', e.target.value)}
                  required
                ></textarea>
              </div>

              <div className="admin-form-group" style={{ marginBottom: 0 }}>
                <label className="admin-form-label">Our Vision Statement</label>
                <textarea 
                  className="admin-textarea"
                  style={{ minHeight: '80px' }}
                  value={aboutData.vision}
                  onChange={(e) => handleInputChange('vision', e.target.value)}
                  required
                ></textarea>
              </div>
            </div>

            {/* Timelines list */}
            <div className="admin-card" style={{ marginBottom: 0 }}>
              <div className="flex justify-between items-center mb-4">
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--admin-text-heading)', marginBottom: 0 }}>Company Timeline History</h3>
                <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={addTimelineItem}>
                  <Plus size={14} /> Add Event
                </button>
              </div>

              {aboutData.timeline.map((time, idx) => (
                <div key={idx} style={{ padding: '12px', border: '1px solid var(--admin-border)', borderRadius: '8px', marginBottom: '12px' }}>
                  <div className="grid-cols-2">
                    <div className="admin-form-group">
                      <label className="admin-form-label">Timeline Year</label>
                      <input 
                        type="text" 
                        className="admin-input" 
                        placeholder="e.g. 2024"
                        value={time.year}
                        onChange={(e) => handleTimelineChange(idx, 'year', e.target.value)}
                        required
                      />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-form-label">Event Headline Title</label>
                      <input 
                        type="text" 
                        className="admin-input" 
                        placeholder="e.g. Company Incorporated"
                        value={time.title}
                        onChange={(e) => handleTimelineChange(idx, 'title', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: '8px' }}>
                    <label className="admin-form-label">Description of Event</label>
                    <textarea 
                      className="admin-textarea"
                      style={{ minHeight: '50px' }}
                      placeholder="Details about what happened during this phase..."
                      value={time.desc}
                      onChange={(e) => handleTimelineChange(idx, 'desc', e.target.value)}
                      required
                    ></textarea>
                  </div>
                  {aboutData.timeline.length > 1 && (
                    <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm text-danger" style={{ color: '#EF4444' }} onClick={() => removeTimelineItem(idx)}>
                      <Trash2 size={12} /> Remove Event
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* CEO Message Card */}
            <div className="admin-card" style={{ marginBottom: 0 }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--admin-text-heading)', marginBottom: '16px' }}>CEO / Proprietor Message</h3>
              
              <div className="admin-form-group">
                <label className="admin-form-label">Proprietor Name</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  value={aboutData.ceoName}
                  onChange={(e) => handleInputChange('ceoName', e.target.value)}
                  required
                />
              </div>

              <div className="admin-form-group" style={{ marginBottom: 0 }}>
                <label className="admin-form-label">Message Text</label>
                <textarea 
                  className="admin-textarea"
                  style={{ minHeight: '100px' }}
                  value={aboutData.ceoMessage}
                  onChange={(e) => handleInputChange('ceoMessage', e.target.value)}
                  required
                ></textarea>
              </div>
            </div>

          </div>

          {/* Right Column fields */}
          <div className="flex flex-col gap-4">
            
            {/* Company facts numericals */}
            <div className="admin-card" style={{ marginBottom: 0 }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--admin-text-heading)', marginBottom: '16px' }}>Company Facts / Statistics</h3>
              {aboutData.facts.map((fact, idx) => (
                <div key={idx} className="grid-cols-2" style={{ borderBottom: idx !== aboutData.facts.length - 1 ? '1px solid var(--admin-border)' : 'none', paddingBottom: '12px', marginBottom: '12px' }}>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label className="admin-form-label">Statistic Label</label>
                    <input 
                      type="text" 
                      className="admin-input" 
                      value={fact.label}
                      onChange={(e) => handleFactChange(idx, 'label', e.target.value)}
                      disabled
                    />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label className="admin-form-label">Display Value</label>
                    <input 
                      type="text" 
                      className="admin-input" 
                      value={fact.value}
                      onChange={(e) => handleFactChange(idx, 'value', e.target.value)}
                      required
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Achievements Card */}
            <div className="admin-card" style={{ marginBottom: 0 }}>
              <div className="flex justify-between items-center mb-4">
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--admin-text-heading)', marginBottom: 0 }}>Achievements & Milestones</h3>
                <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={addAchievement}>
                  <Plus size={14} /> Add
                </button>
              </div>

              {aboutData.achievements.map((ach, idx) => (
                <div key={idx} className="flex gap-2" style={{ marginBottom: '8px' }}>
                  <input 
                    type="text" 
                    className="admin-input" 
                    value={ach}
                    onChange={(e) => handleAchievementChange(idx, e.target.value)}
                    required
                  />
                  {aboutData.achievements.length > 1 && (
                    <button type="button" className="admin-btn admin-btn-secondary" style={{ padding: '8px', color: '#EF4444' }} onClick={() => removeAchievement(idx)}>
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Team Members Card */}
            <div className="admin-card" style={{ marginBottom: 0 }}>
              <div className="flex justify-between items-center mb-4">
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--admin-text-heading)', marginBottom: 0 }}>Team Members</h3>
                <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={addTeamMember}>
                  <Plus size={14} /> Add
                </button>
              </div>

              {aboutData.team.map((member, idx) => (
                <div key={member.id} style={{ padding: '10px', border: '1px solid var(--admin-border)', borderRadius: '8px', marginBottom: '12px' }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Full Name</label>
                    <input 
                      type="text" 
                      className="admin-input" 
                      value={member.name}
                      onChange={(e) => handleTeamChange(idx, 'name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: '8px' }}>
                    <label className="admin-form-label">Role Title</label>
                    <input 
                      type="text" 
                      className="admin-input" 
                      value={member.role}
                      onChange={(e) => handleTeamChange(idx, 'role', e.target.value)}
                      required
                    />
                  </div>
                  {aboutData.team.length > 1 && (
                    <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm text-danger" style={{ color: '#EF4444' }} onClick={() => removeTeamMember(idx)}>
                      <Trash2 size={12} /> Remove
                    </button>
                  )}
                </div>
              ))}
            </div>

          </div>
        </form>
      )}

      {/* LIVE ABOUT PREVIEW SECTION */}
      {activeTab === 'preview' && (
        <div style={{ border: '1px solid var(--admin-border)', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#FFF', color: '#6B7280', textRendering: 'optimizeLegibility' }}>
          
          {/* Header Preview */}
          <div style={{ padding: '40px 24px', textAlign: 'center', background: 'var(--admin-bg)', borderBottom: '1px solid var(--admin-border)' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 600, color: '#111827', margin: '0 auto 8px' }}>{aboutData.heroTitle}</h1>
            <p style={{ fontSize: '0.95rem', color: '#6B7280', maxWidth: '600px', margin: '0 auto' }}>{aboutData.heroSubtitle}</p>
          </div>

          {/* Company facts statistics section */}
          <div style={{ padding: '32px 24px', background: '#FFF' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', maxWidth: '800px', margin: '0 auto' }} className="grid-cols-2">
              {aboutData.facts.map((fact, idx) => (
                <div key={idx} style={{ padding: '16px', border: '1px solid #E5E7EB', borderRadius: '12px', background: '#FAFAFA', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#10B981', marginBottom: '4px' }}>{fact.value}</div>
                  <span style={{ fontSize: '0.75rem', color: '#4B5563', fontWeight: 500 }}>{fact.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Story and Mission/Vision */}
          <div style={{ padding: '32px 24px', display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px', maxWidth: '1000px', margin: '0 auto', textAlign: 'left' }} className="grid-cols-2">
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '12px' }}>Our Story</h2>
              <p style={{ fontSize: '0.88rem', color: '#6B7280', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{aboutData.story}</p>
              
              <div style={{ marginTop: '24px', padding: '16px', borderLeft: '3px solid #10B981', backgroundColor: '#FAFAFA' }}>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 'bold', color: '#111827', marginBottom: '6px' }}>Proprietor's Note ({aboutData.ceoName})</h4>
                <p style={{ fontStyle: 'italic', fontSize: '0.85rem', color: '#4B5563' }}>"{aboutData.ceoMessage}"</p>
              </div>
            </div>

            <div>
              <div style={{ padding: '20px', border: '1px solid #E5E7EB', borderRadius: '12px', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', marginBottom: '8px' }}>Our Mission</h3>
                <p style={{ fontSize: '0.82rem', color: '#6B7280', lineHeight: 1.5 }}>{aboutData.mission}</p>
              </div>
              
              <div style={{ padding: '20px', border: '1px solid #E5E7EB', borderRadius: '12px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', marginBottom: '8px' }}>Our Vision</h3>
                <p style={{ fontSize: '0.82rem', color: '#6B7280', lineHeight: 1.5 }}>{aboutData.vision}</p>
              </div>
            </div>
          </div>

          {/* Timeline and facts lists */}
          <div style={{ padding: '40px 24px', background: '#FAFAFA', borderTop: '1px solid #E5E7EB' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '24px', textAlign: 'center' }}>Historical Journey</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '700px', margin: '0 auto', textAlign: 'left' }}>
              {aboutData.timeline.map((time, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ fontWeight: 'bold', color: '#10B981', fontSize: '1.1rem', minWidth: '60px' }}>{time.year}</div>
                  <div style={{ borderLeft: '2px solid #E5E7EB', paddingLeft: '16px', paddingBottom: '8px' }}>
                    <h4 style={{ fontWeight: 600, color: '#111827', fontSize: '0.9rem', marginBottom: '4px' }}>{time.title}</h4>
                    <p style={{ fontSize: '0.82rem', color: '#6B7280' }}>{time.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team member preview */}
          <div style={{ padding: '40px 24px', background: '#FFF' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '28px', textAlign: 'center' }}>Company Leadership</h2>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', flexWrap: 'wrap' }}>
              {aboutData.team.map((member) => (
                <div key={member.id} style={{ textAlign: 'center', width: '150px' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#E5E7EB', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF' }}>Team</div>
                  <strong style={{ display: 'block', color: '#111827', fontSize: '0.88rem' }}>{member.name || 'Member Name'}</strong>
                  <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>{member.role || 'Position'}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default AboutEditor;
