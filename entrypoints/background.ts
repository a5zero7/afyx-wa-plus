import { getSettings, saveSettings } from '../src/storage/settings';

export default defineBackground(() => {
  browser.commands.onCommand.addListener((command) => {
    if (command === 'toggle-privacy-blur') {
      void getSettings().then(async (settings) => {
        settings.privacy.blurChatContent = !settings.privacy.blurChatContent;
        await saveSettings(settings);
      });
    }
  });
});
