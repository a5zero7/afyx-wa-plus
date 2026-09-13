import { useEffect, useMemo, useState } from 'react';
import { messages } from '../locales/messages';
import { getSettings, saveSettings } from '../storage/settings';
import { DEFAULT_SETTINGS, type AppSettings } from '../types/settings';

type Tab = 'privacy' | 'enhance' | 'wallpaper';
type BooleanPath =
  | 'privacy.blurChatContent' | 'privacy.blurRecentPreviews' | 'privacy.blurAvatars'
  | 'privacy.blurNames' | 'privacy.composerPrivacy' | 'enhance.localPins'
  | 'enhance.translation' | 'enhance.statusDownload';

export function ToolkitPanel() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [tab, setTab] = useState<Tab>('privacy');
  useEffect(() => { void getSettings().then(setSettings); }, []);
  const copy = messages[settings.locale];

  const setFlag = (path: BooleanPath) => {
    const [section, field] = path.split('.') as [keyof AppSettings, string];
    const next = structuredClone(settings) as AppSettings;
    const group = next[section] as Record<string, boolean>;
    group[field] = !group[field];
    setSettings(next);
    void saveSettings(next);
  };
  const rows = useMemo(() => ({
    privacy: [
      [copy.blurChat, 'privacy.blurChatContent'], [copy.blurPreviews, 'privacy.blurRecentPreviews'],
      [copy.blurAvatars, 'privacy.blurAvatars'], [copy.blurNames, 'privacy.blurNames'],
      [copy.composerPrivacy, 'privacy.composerPrivacy'],
    ],
    enhance: [[copy.localPins, 'enhance.localPins'], [copy.translation, 'enhance.translation'], [copy.statusDownload, 'enhance.statusDownload']],
  } as const), [copy]);

  return <section className="afyx-panel" aria-label={copy.title}>
    <header><div><strong>{copy.title}</strong><small>Local-first toolkit</small></div>
      <select aria-label="Language" value={settings.locale} onChange={(event) => {
        const next = { ...settings, locale: event.target.value as AppSettings['locale'] };
        setSettings(next); void saveSettings(next);
      }}><option value="en">EN</option><option value="id">ID</option></select>
    </header>
    <nav aria-label="Toolkit sections">{(['privacy', 'enhance', 'wallpaper'] as const).map((item) =>
      <button key={item} className={tab === item ? 'active' : ''} onClick={() => setTab(item)}>{copy[item]}</button>)}</nav>
    <main>
      {tab !== 'wallpaper' && rows[tab].map(([label, path]) => <label className="afyx-row" key={path}>
        <span>{label}</span><input type="checkbox" checked={Boolean(path.split('.')[0] === 'privacy'
          ? settings.privacy[path.split('.')[1] as keyof AppSettings['privacy']]
          : settings.enhance[path.split('.')[1] as keyof AppSettings['enhance']])} onChange={() => setFlag(path)} />
      </label>)}
      {tab === 'wallpaper' && <p className="afyx-note">Wallpaper presets and local image import will be available in Phase 3.</p>}
    </main>
    <footer><span>v0.1.0</span><span>Independent of WhatsApp and Meta</span></footer>
  </section>;
}
