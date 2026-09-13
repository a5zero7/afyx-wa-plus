import { createRoot } from 'react-dom/client';
import { ToolkitPanel } from '../src/components/ToolkitPanel';
import { applyPrivacyStyle } from '../src/features/privacy/privacy-style';
import { getSettings } from '../src/storage/settings';

export default defineContentScript({
  matches: ['https://web.whatsapp.com/*'],
  runAt: 'document_idle',
  main() {
    const host = document.createElement('div');
    host.id = 'afyx-wa-plus-root';
    host.style.cssText = 'position:fixed;top:76px;right:16px;z-index:2147483647;';
    const shadow = host.attachShadow({ mode: 'closed' });
    const mount = document.createElement('div');
    const style = document.createElement('style');
    style.textContent = `:host{color-scheme:light dark}.afyx-panel{width:360px;max-height:calc(100vh - 92px);overflow:auto;background:#fff;color:#17211b;border:1px solid #d9e3db;border-radius:16px;box-shadow:0 12px 36px #0003;font:14px system-ui,sans-serif}.afyx-panel header,.afyx-panel footer{display:flex;justify-content:space-between;align-items:center;padding:16px}.afyx-panel strong,.afyx-panel small{display:block}.afyx-panel small,.afyx-panel footer{color:#68736c;font-size:12px}.afyx-panel nav{display:flex;padding:0 12px;border-bottom:1px solid #e4ebe5}.afyx-panel button{flex:1;border:0;background:none;padding:12px 6px;cursor:pointer}.afyx-panel button.active{color:#087f4f;border-bottom:2px solid #087f4f;font-weight:700}.afyx-panel main{padding:10px 16px}.afyx-row{display:flex;align-items:center;justify-content:space-between;min-height:48px;border-bottom:1px solid #edf1ee}.afyx-row input{width:20px;height:20px;accent-color:#0a8a57}.afyx-note{line-height:1.5}.afyx-panel footer{gap:8px;border-top:1px solid #e4ebe5}@media(prefers-color-scheme:dark){.afyx-panel{background:#17211b;color:#edf4ee;border-color:#314137}.afyx-panel nav,.afyx-row,.afyx-panel footer{border-color:#314137}.afyx-panel small,.afyx-panel footer{color:#aab6ad}}`;
    shadow.append(style, mount);
    document.documentElement.append(host);
    createRoot(mount).render(<ToolkitPanel />);
    void getSettings().then(applyPrivacyStyle);
    browser.storage.onChanged.addListener(() => { void getSettings().then(applyPrivacyStyle); });
  },
});
