
import { useEffect, useState } from 'react';
import {
  Save,
  RefreshCw,
  PanelsTopLeft,
  Globe,
  Image as ImageIcon,
  BookOpen,
  Building2,
} from 'lucide-react';

import api, { getErrorMessage } from '../../api/client';
import { fallbackContent } from '../../data/defaultContent';
import ImageField from '../../components/ImageField';
import Toast from '../../components/Toast';

const jsonFields = [
  'stats',
  'features',
  'processSteps',
  'securityPoints',
  'principles',
];

const sections = [
  {
    id: 'site',
    label: 'Brand & contact',
    icon: Globe,
    description:
      'Your brand identity, business details, contact information and footer copy.',
    fields: [
      ['brand', 'Brand name'],
      ['tagline', 'Tagline'],
      ['email', 'Public email'],
      ['phone', 'Phone number'],
      ['address', 'Office address'],
      ['officeHours', 'Office hours'],
      ['primaryColor', 'Brand accent color'],
      ['footerText', 'Footer description', 'textarea'],
    ],
  },
  {
    id: 'hero',
    label: 'Homepage hero',
    icon: ImageIcon,
    description: 'The first message visitors see on the homepage.',
    fields: [
      ['eyebrow', 'Small label'],
      ['title', 'Main headline', 'textarea'],
      ['description', 'Description', 'textarea'],
      ['primaryCta', 'Primary button label'],
      ['primaryHref', 'Primary button link'],
      ['secondaryCta', 'Secondary button label'],
      ['secondaryHref', 'Secondary button link'],
    ],
  },
  {
    id: 'home',
    label: 'Homepage sections',
    icon: PanelsTopLeft,
    description: 'Section headlines and descriptive copy on the homepage.',
    fields: [
      ['heroNote', 'Hero supporting note'],
      ['heroImageTitle', 'Hero image card title'],
      ['heroImageSubtitle', 'Hero image card subtitle'],
      ['heroBottomLeft', 'Bottom banner left text'],
      ['heroBottomRight', 'Bottom banner right text'],
      ['servicesEyebrow', 'Services eyebrow'],
      ['servicesTitle', 'Services heading', 'textarea'],
      ['servicesDescription', 'Services description', 'textarea'],
      ['whyEyebrow', 'Why-us eyebrow'],
      ['whyTitle', 'Why-us heading', 'textarea'],
      ['whyDescription', 'Why-us description', 'textarea'],
      ['whyButtonText', 'Why-us button label'],
      ['processEyebrow', 'Process eyebrow'],
      ['processTitle', 'Process heading', 'textarea'],
      ['processDescription', 'Process section description', 'textarea'],
      ['securityEyebrow', 'Security eyebrow'],
      ['securityTitle', 'Security heading', 'textarea'],
      ['securityDescription', 'Security description', 'textarea'],
      ['caseEyebrow', 'Case study eyebrow'],
      ['caseTitle', 'Case study heading', 'textarea'],
      ['caseDescription', 'Case study description', 'textarea'],
      ['caseVisualTitle', 'Case visual title'],
      ['caseVisualStatus', 'Case visual status'],
      ['caseMetricLeft', 'Case metric left'],
      ['caseMetricRight', 'Case metric right'],
      ['testimonialsEyebrow', 'Testimonials eyebrow'],
      ['testimonialsTitle', 'Testimonials heading', 'textarea'],
      ['faqEyebrow', 'FAQ eyebrow'],
      ['faqsTitle', 'FAQ heading'],
      ['faqDescription', 'FAQ intro', 'textarea'],
      ['faqLinkText', 'FAQ link label'],
      ['ctaEyebrow', 'Final CTA eyebrow'],
      ['ctaTitle', 'Final CTA heading', 'textarea'],
      ['ctaDescription', 'Final CTA description', 'textarea'],
      ['ctaButtonText', 'Final CTA button'],
      ['stats', 'Statistics (JSON)', 'json'],
      ['features', 'Why-us features (JSON)', 'json'],
      ['processSteps', 'Process steps (JSON)', 'json'],
      ['securityPoints', 'Security points (JSON)', 'json'],
    ],
  },
  {
    id: 'servicesPage',
    label: 'Services page',
    icon: BookOpen,
    description:
      'Services-page introduction, feature cards and final contact prompt.',
    fields: [
      ['eyebrow', 'Page eyebrow'],
      ['title', 'Page headline', 'textarea'],
      ['description', 'Page description', 'textarea'],
      ['promiseTitle1', 'Feature 1 title'],
      ['promiseDescription1', 'Feature 1 description', 'textarea'],
      ['promiseTitle2', 'Feature 2 title'],
      ['promiseDescription2', 'Feature 2 description', 'textarea'],
      ['promiseTitle3', 'Feature 3 title'],
      ['promiseDescription3', 'Feature 3 description', 'textarea'],
      ['ctaEyebrow', 'Final CTA eyebrow'],
      ['ctaTitle', 'Final CTA heading', 'textarea'],
      ['ctaDescription', 'Final CTA description', 'textarea'],
      ['ctaButtonText', 'Final CTA button'],
    ],
  },
  {
    id: 'about',
    label: 'About page',
    icon: Building2,
    description:
      'About page story, mission, vision, principles, team section and CTA.',
    fields: [
      ['eyebrow', 'Page eyebrow'],
      ['title', 'Page headline', 'textarea'],
      ['description', 'Page description', 'textarea'],
      ['introEyebrow', 'Intro eyebrow'],
      ['introTitle', 'Intro heading', 'textarea'],
      ['introParagraph1', 'Intro paragraph 1', 'textarea'],
      ['introParagraph2', 'Intro paragraph 2', 'textarea'],
      ['mission', 'Our mission', 'textarea'],
      ['vision', 'Our vision', 'textarea'],
      ['principlesEyebrow', 'Principles eyebrow'],
      ['principlesTitle', 'Principles heading', 'textarea'],
      ['principlesDescription', 'Principles intro', 'textarea'],
      ['teamEyebrow', 'Team section eyebrow'],
      ['teamTitle', 'Team section heading', 'textarea'],
      ['teamDescription', 'Team section description', 'textarea'],
      ['ctaEyebrow', 'Final CTA eyebrow'],
      ['ctaTitle', 'Final CTA heading', 'textarea'],
      ['ctaDescription', 'Final CTA description', 'textarea'],
      ['ctaButtonText', 'Final CTA button'],
      ['principles', 'Principles (JSON)', 'json'],
    ],
  },
  {
    id: 'contact',
    label: 'Contact page',
    icon: Globe,
    description:
      'Contact page intro, form heading and supporting notes.',
    fields: [
      ['eyebrow', 'Page eyebrow'],
      ['title', 'Page headline', 'textarea'],
      ['description', 'Page description', 'textarea'],
      ['detailsEyebrow', 'Contact details eyebrow'],
      ['detailsTitle', 'Contact details heading', 'textarea'],
      ['detailsDescription', 'Contact details description', 'textarea'],
      ['formEyebrow', 'Form eyebrow'],
      ['formTitle', 'Form heading'],
      ['formDescription', 'Form helper text'],
      ['contactNote', 'Privacy note', 'textarea'],
      ['submitLabel', 'Submit button label'],
      ['privacyCopy', 'Form footer note', 'textarea'],
    ],
  },
];

function mergeContent(data = {}) {
  return {
    ...fallbackContent,
    ...data,
    site: {
      ...fallbackContent.site,
      ...data.site,
    },
    hero: {
      ...fallbackContent.hero,
      ...data.hero,
    },
    home: {
      ...fallbackContent.home,
      ...data.home,
    },
    servicesPage: {
      ...fallbackContent.servicesPage,
      ...data.servicesPage,
    },
    about: {
      ...fallbackContent.about,
      ...data.about,
    },
    contact: {
      ...fallbackContent.contact,
      ...data.contact,
    },
  };
}

function makeJsonValues(content) {
  return Object.fromEntries(
    jsonFields.map((key) => [
      key,
      JSON.stringify(
        key === 'principles'
          ? content.about?.[key] ?? []
          : content.home?.[key] ?? [],
        null,
        2
      ),
    ])
  );
}

export default function ContentManager() {
  const [content, setContent] = useState(fallbackContent);
  const [active, setActive] = useState('site');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [jsonText, setJsonText] = useState(
    makeJsonValues(fallbackContent)
  );

  useEffect(() => {
    let mounted = true;

    async function loadContent() {
      try {
        const { data } = await api.get('/site-content', {
          params: { _fresh: Date.now() },
          headers: { 'Cache-Control': 'no-cache' },
        });

        if (!mounted) return;

        const merged = mergeContent(data);
        setContent(merged);
        setJsonText(makeJsonValues(merged));
      } catch (error) {
        if (mounted) {
          setToast({
            type: 'error',
            message: getErrorMessage(error),
          });
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadContent();

    return () => {
      mounted = false;
    };
  }, []);

  const current = sections.find((section) => section.id === active)
    || sections[0];

  function change(section, key, value) {
    setContent((previous) => ({
      ...previous,
      [section]: {
        ...previous[section],
        [key]: value,
      },
    }));
  }

  function changeJson(key, value) {
    setJsonText((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  async function save() {
    setSaving(true);
    setToast(null);

    try {
      const payload = structuredClone(content);

      for (const key of jsonFields) {
        const parsed = JSON.parse(jsonText[key] || '[]');

        if (!Array.isArray(parsed)) {
          throw new SyntaxError(`${key} must be a JSON array.`);
        }

        if (key === 'principles') {
          payload.about[key] = parsed;
        } else {
          payload.home[key] = parsed;
        }
      }

      const { data } = await api.put('/site-content', payload);

      const savedContent = mergeContent(data?.content ?? payload);

      setContent(savedContent);
      setJsonText(makeJsonValues(savedContent));

      setToast({
        type: 'success',
        message: 'Website content saved successfully.',
      });
    } catch (error) {
      setToast({
        type: 'error',
        message:
          error instanceof SyntaxError
            ? `Invalid JSON: ${error.message}`
            : getErrorMessage(error, 'Could not save content.'),
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-heading">
        <div>
          <p className="eyebrow">CONTENT STUDIO</p>
          <h1>Website content</h1>
          <p>
            Edit site copy, page sections and images without changing code.
          </p>
        </div>

        <button
          className="button button-primary"
          onClick={save}
          disabled={saving || loading}
        >
          {saving
            ? <RefreshCw size={17} className="spin" />
            : <Save size={17} />}
          {saving ? 'Saving…' : 'Save all changes'}
        </button>
      </div>

      <div className="content-manager-layout">
        <aside className="content-section-nav">
          <p className="admin-side-label">CONTENT AREAS</p>

          {sections.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={`content-section-tab ${
                active === id ? 'active' : ''
              }`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}

          <div className="content-nav-note">
            <strong>Before publishing</strong>
            <p>
              Replace sample company claims and testimonials with accurate,
              approved content. Save after making your changes.
            </p>
          </div>
        </aside>

        <section className="admin-panel-card content-editor-panel">
          <div className="content-editor-heading">
            <div>
              <span className="content-editor-icon">
                <current.icon size={20} />
              </span>
              <h2>{current.label}</h2>
              <p>{current.description}</p>
            </div>
            <span className="edit-mode-pill">Editable</span>
          </div>

          {loading ? (
            <div className="panel-empty">
              <RefreshCw size={20} className="spin" />
              Loading saved content…
            </div>
          ) : (
            <div className="content-form-grid">
              {active === 'site' && (
                <ImageField
                  label="Logo image (optional)"
                  value={content.site.logoUrl}
                  onChange={(value) => change('site', 'logoUrl', value)}
                  toast={setToast}
                />
              )}

              {active === 'hero' && (
                <ImageField
                  label="Hero image"
                  value={content.hero.imageUrl}
                  onChange={(value) => change('hero', 'imageUrl', value)}
                  toast={setToast}
                />
              )}

              {active === 'about' && (
                <ImageField
                  label="About page image"
                  value={content.about.imageUrl}
                  onChange={(value) => change('about', 'imageUrl', value)}
                  toast={setToast}
                />
              )}

              {current.fields.map(([key, label, type]) => {
                if (type === 'json') {
                  return (
                    <label
                      className="form-field form-field-full"
                      key={key}
                    >
                      <span>{label}</span>
                      <textarea
                        className="json-editor"
                        spellCheck="false"
                        rows={11}
                        value={jsonText[key] || ''}
                        onChange={(event) =>
                          changeJson(key, event.target.value)
                        }
                      />
                      <small className="field-hint">
                        Valid JSON array. Keep the data structure and
                        property names intact.
                      </small>
                    </label>
                  );
                }

                return (
                  <label
                    className={`form-field ${
                      type === 'textarea' ? 'form-field-full' : ''
                    }`}
                    key={key}
                  >
                    <span>{label}</span>

                    {type === 'textarea' ? (
                      <textarea
                        rows={3}
                        value={content[active]?.[key] ?? ''}
                        onChange={(event) =>
                          change(active, key, event.target.value)
                        }
                      />
                    ) : key === 'primaryColor' ? (
                      <div className="color-input-wrap">
                        <input
                          type="color"
                          value={
                            /^#[0-9a-f]{6}$/i.test(
                              content[active]?.[key] || ''
                            )
                              ? content[active][key]
                              : '#1746a2'
                          }
                          onChange={(event) =>
                            change(active, key, event.target.value)
                          }
                        />
                        <input
                          value={content[active]?.[key] ?? ''}
                          onChange={(event) =>
                            change(active, key, event.target.value)
                          }
                          placeholder="#1746a2"
                        />
                      </div>
                    ) : (
                      <input
                        value={content[active]?.[key] ?? ''}
                        onChange={(event) =>
                          change(active, key, event.target.value)
                        }
                      />
                    )}
                  </label>
                );
              })}
            </div>
          )}

          <div className="content-editor-footer">
            <span>Changes appear on the public site after you save.</span>

            <button
              className="button button-primary"
              onClick={save}
              disabled={saving || loading}
            >
              {saving
                ? <RefreshCw size={16} className="spin" />
                : <Save size={16} />}
              Save changes
            </button>
          </div>
        </section>
      </div>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
