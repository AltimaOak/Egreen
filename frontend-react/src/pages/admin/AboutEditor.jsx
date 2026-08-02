// Admin About Page Content Editor Component — Redesigned
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
  Badge
} from '../../components/admin/UI';
import {
  Save,
  Award,
  Edit3,
  Plus,
  Trash2,
  TrendingUp,
  Users,
  FileText,
  Calendar,
} from 'lucide-react';

const AboutEditor = () => {
  const { showToast } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('edit');
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
    setAboutData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFactChange = (index, field, value) => {
    const updated = [...aboutData.facts];
    updated[index][field] = value;
    setAboutData((prev) => ({ ...prev, facts: updated }));
  };

  const handleTimelineChange = (index, field, value) => {
    const updated = [...aboutData.timeline];
    updated[index][field] = value;
    setAboutData((prev) => ({ ...prev, timeline: updated }));
  };

  const addTimelineItem = () => {
    setAboutData((prev) => ({
      ...prev,
      timeline: [...prev.timeline, { year: '', title: '', desc: '' }],
    }));
  };

  const removeTimelineItem = (index) => {
    const updated = aboutData.timeline.filter((_, idx) => idx !== index);
    setAboutData((prev) => ({ ...prev, timeline: updated }));
  };

  const handleAchievementChange = (index, value) => {
    const updated = [...aboutData.achievements];
    updated[index] = value;
    setAboutData((prev) => ({ ...prev, achievements: updated }));
  };

  const addAchievement = () => {
    setAboutData((prev) => ({
      ...prev,
      achievements: [...prev.achievements, ''],
    }));
  };

  const removeAchievement = (index) => {
    const updated = aboutData.achievements.filter((_, idx) => idx !== index);
    setAboutData((prev) => ({ ...prev, achievements: updated }));
  };

  const handleTeamChange = (index, field, value) => {
    const updated = [...aboutData.team];
    updated[index][field] = value;
    setAboutData((prev) => ({ ...prev, team: updated }));
  };

  const addTeamMember = () => {
    setAboutData((prev) => ({
      ...prev,
      team: [...prev.team, { id: Date.now(), name: '', role: '', image: '' }],
    }));
  };

  const removeTeamMember = (index) => {
    const updated = aboutData.team.filter((_, idx) => idx !== index);
    setAboutData((prev) => ({ ...prev, team: updated }));
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
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
    <div className="space-y-6">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">About Page Editor</h1>
          <p className="admin-page-subtitle">Edit story, mission, timeline, achievements, and team members.</p>
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
            <Collapsible title="Story & Title Headlines" icon={<FileText size={16} />} defaultOpen={true}>
              <Input
                label="About Page Title"
                value={aboutData.heroTitle || ''}
                onChange={(e) => handleInputChange('heroTitle', e.target.value)}
                required
              />
              <Input
                label="Hero Subtitle"
                value={aboutData.heroSubtitle || ''}
                onChange={(e) => handleInputChange('heroSubtitle', e.target.value)}
                required
              />
              <Textarea
                label="Detailed Company Story"
                value={aboutData.story || ''}
                onChange={(e) => handleInputChange('story', e.target.value)}
                required
                minHeight="120px"
              />
            </Collapsible>

            <Collapsible title="Mission & Vision Statements" icon={<TrendingUp size={16} />} defaultOpen={true}>
              <Textarea
                label="Our Mission Statement"
                value={aboutData.mission || ''}
                onChange={(e) => handleInputChange('mission', e.target.value)}
                required
                minHeight="80px"
              />
              <Textarea
                label="Our Vision Statement"
                value={aboutData.vision || ''}
                onChange={(e) => handleInputChange('vision', e.target.value)}
                required
                minHeight="80px"
              />
            </Collapsible>

            <Collapsible title="Company Timeline History" icon={<Calendar size={16} />} defaultOpen={true}>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs text-muted font-medium">{aboutData.timeline.length} events</span>
                <Button variant="ghost" size="sm" icon={<Plus size={14} />} onClick={addTimelineItem}>
                  Add Event
                </Button>
              </div>
              {aboutData.timeline.map((time, idx) => (
                <Card key={idx} padding="sm" className="mb-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Timeline Year"
                      placeholder="e.g. 2024"
                      value={time.year || ''}
                      onChange={(e) => handleTimelineChange(idx, 'year', e.target.value)}
                      required
                    />
                    <Input
                      label="Event Headline Title"
                      placeholder="e.g. Company Incorporated"
                      value={time.title || ''}
                      onChange={(e) => handleTimelineChange(idx, 'title', e.target.value)}
                      required
                    />
                  </div>
                  <Textarea
                    label="Description of Event"
                    placeholder="Details about what happened during this phase..."
                    value={time.desc || ''}
                    onChange={(e) => handleTimelineChange(idx, 'desc', e.target.value)}
                    required
                    minHeight="50px"
                  />
                  {aboutData.timeline.length > 1 && (
                    <button
                      type="button"
                      className="text-danger text-xs hover:text-danger/80 flex items-center gap-1 cursor-pointer mt-1"
                      onClick={() => removeTimelineItem(idx)}
                    >
                      <Trash2 size={12} /> Remove Event
                    </button>
                  )}
                </Card>
              ))}
            </Collapsible>

            <Collapsible title="CEO / Proprietor Message" icon={<Edit3 size={16} />} defaultOpen={true}>
              <Input
                label="Proprietor Name"
                value={aboutData.ceoName || ''}
                onChange={(e) => handleInputChange('ceoName', e.target.value)}
                required
              />
              <Textarea
                label="Message Text"
                value={aboutData.ceoMessage || ''}
                onChange={(e) => handleInputChange('ceoMessage', e.target.value)}
                required
                minHeight="100px"
              />
            </Collapsible>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Collapsible title="Company Facts / Statistics" icon={<TrendingUp size={16} />} defaultOpen={true}>
                {aboutData.facts.map((fact, idx) => (
                  <Card key={idx} padding="sm" className="mb-3">
                    <Input
                      label="Statistic Label"
                      value={fact.label || ''}
                      onChange={(e) => handleFactChange(idx, 'label', e.target.value)}
                      disabled
                    />
                    <Input
                      label="Display Value"
                      value={fact.value || ''}
                      onChange={(e) => handleFactChange(idx, 'value', e.target.value)}
                      required
                    />
                  </Card>
                ))}
              </Collapsible>

              <div className="space-y-4">
                <Collapsible title="Achievements & Milestones" icon={<Award size={16} />} defaultOpen={true}>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs text-muted font-medium">{aboutData.achievements.length} items</span>
                    <Button variant="ghost" size="sm" icon={<Plus size={14} />} onClick={addAchievement}>
                      Add
                    </Button>
                  </div>
                  {aboutData.achievements.map((ach, idx) => (
                    <div key={idx} className="flex gap-2 items-center mb-2">
                      <Input
                        placeholder="Achievement description"
                        value={ach || ''}
                        onChange={(e) => handleAchievementChange(idx, e.target.value)}
                        required
                        className="mb-0"
                      />
                      {aboutData.achievements.length > 1 && (
                        <button
                          type="button"
                          className="text-danger hover:text-danger/80 cursor-pointer p-2"
                          onClick={() => removeAchievement(idx)}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </Collapsible>

                <Collapsible title="Team Members" icon={<Users size={16} />} defaultOpen={true}>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs text-muted font-medium">{aboutData.team.length} members</span>
                    <Button variant="ghost" size="sm" icon={<Plus size={14} />} onClick={addTeamMember}>
                      Add
                    </Button>
                  </div>
                  {aboutData.team.map((member, idx) => (
                    <Card key={member.id} padding="sm" className="mb-3">
                      <Input
                        label="Full Name"
                        value={member.name || ''}
                        onChange={(e) => handleTeamChange(idx, 'name', e.target.value)}
                        required
                      />
                      <Input
                        label="Role Title"
                        value={member.role || ''}
                        onChange={(e) => handleTeamChange(idx, 'role', e.target.value)}
                        required
                      />
                      {aboutData.team.length > 1 && (
                        <button
                          type="button"
                          className="text-danger text-xs hover:text-danger/80 flex items-center gap-1 cursor-pointer mt-1"
                          onClick={() => removeTeamMember(idx)}
                        >
                          <Trash2 size={12} /> Remove
                        </button>
                      )}
                    </Card>
                  ))}
                </Collapsible>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Live preview */}
      {activeTab === 'preview' && (
        <Card padding="none" className="overflow-hidden bg-white">
          <div className="px-8 py-12 text-center border-b border-border">
            <h1 className="admin-page-title mb-2" style={{ color: 'var(--color-text-heading)' }}>{aboutData.heroTitle || 'About Us'}</h1>
            <p className="text-sm text-muted max-w-xl mx-auto">{aboutData.heroSubtitle || 'Hero subtitle'}</p>
          </div>

          <div className="px-8 py-10 max-w-4xl mx-auto space-y-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {aboutData.facts.map((fact, idx) => (
                <div key={idx} className="p-4 border border-border rounded-[var(--radius-card)] bg-muted/3 text-center">
                  <div className="text-2xl font-bold text-primary mb-1">{fact.value || '—'}</div>
                  <span className="text-xs text-muted font-medium">{fact.label || 'Fact'}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6 text-left">
                <div>
                  <h2 className="text-lg font-semibold text-text mb-2">Our Story</h2>
                  <p className="text-sm text-muted whitespace-pre-line leading-relaxed">{aboutData.story || 'Story not set'}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Card>
                    <h3 className="font-medium text-text mb-1">Our Mission</h3>
                    <p className="text-xs text-muted leading-relaxed">{aboutData.mission || '—'}</p>
                  </Card>
                  <Card>
                    <h3 className="font-medium text-text mb-1">Our Vision</h3>
                    <p className="text-xs text-muted leading-relaxed">{aboutData.vision || '—'}</p>
                  </Card>
                </div>

                <div className="border-l-2 border-primary pl-4 mt-2">
                  <h4 className="font-medium text-sm text-text mb-1">
                    Proprietor's Note ({aboutData.ceoName || '—'})
                  </h4>
                  <p className="text-xs text-muted italic leading-relaxed">"{aboutData.ceoMessage || '—'}"</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-text mb-4">Historical Journey</h2>
                  <div className="space-y-5">
                    {aboutData.timeline.map((time, idx) => (
                      <div key={idx} className="relative pl-5 border-l border-border">
                        <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-primary" />
                        <span className="text-sm font-bold text-primary">{time.year || '——'}</span>
                        <h4 className="font-medium text-sm text-text mt-1">{time.title || 'Event'}</h4>
                        <p className="text-xs text-muted mt-1 leading-relaxed">{time.desc || '—'}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-text mb-3">Achievements</h2>
                  <ul className="space-y-1">
                    {aboutData.achievements.map((ach, idx) => (
                      <li key={idx} className="text-xs text-muted flex items-start gap-1.5">
                        <span className="text-primary mt-0.5">▸</span>
                        {ach || '—'}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border px-8 py-8 bg-muted/3">
            <h2 className="text-lg font-semibold text-text text-center mb-6">Company Leadership</h2>
            <div className="flex justify-center gap-8 flex-wrap">
              {aboutData.team.map((member) => (
                <div key={member.id} className="text-center w-36">
                  <div className="w-20 h-20 rounded-full bg-muted/20 flex items-center justify-center mx-auto mb-2">
                    <Users size={20} className="text-muted" />
                  </div>
                  <strong className="block text-sm text-text">{member.name || 'Member Name'}</strong>
                  <span className="text-xs text-muted">{member.role || 'Position'}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AboutEditor;
