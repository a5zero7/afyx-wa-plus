import { applyPrivacyStyle } from '../src/features/privacy/privacy-style';
import { getSettings } from '../src/storage/settings';

/**
 * Runs only WhatsApp effects. The browser-action popup is the sole settings UI,
 * so no visible panel is mounted into web.whatsapp.com.
 */
export default defineContentScript({
  matches: ['https://web.whatsapp.com/*'],
  runAt: 'document_idle',
  main() {
    void getSettings().then(applyPrivacyStyle);
    browser.storage.onChanged.addListener((changes, area) => {
      if (area === 'local' && changes['afyx-wa-plus-settings']) {
        void getSettings().then(applyPrivacyStyle);
      }
    });
  },
});