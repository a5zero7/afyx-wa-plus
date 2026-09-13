import { defineConfig } from 'wxt';

export default defineConfig({
  manifest: {
    name: 'Afyx WA Plus',
    description: 'Local privacy, export, translation and customization tools for WhatsApp Web.',
    permissions: ['storage', 'downloads', 'activeTab'],
    host_permissions: ['https://web.whatsapp.com/*'],
    commands: {
      'toggle-privacy-blur': {
        suggested_key: { default: 'Alt+Shift+B' },
        description: 'Toggle privacy blur',
      },
      'lock-whatsapp': {
        suggested_key: { default: 'Alt+Shift+L' },
        description: 'Lock WhatsApp',
      },
      'toggle-toolkit-panel': {
        suggested_key: { default: 'Alt+Shift+X' },
        description: 'Open or close Afyx WA Plus',
      },
    },
    browser_specific_settings: {
      gecko: {
        id: 'afyx-wa-plus@afyx.local',
        data_collection_permissions: { required: ['none'] },
      },
    },
  },
  modules: ['@wxt-dev/module-react'],
});
