export type ThemeMode = 'light' | 'dark' | 'system';
export type Locale = 'en' | 'id';

export interface AppSettings {
  schemaVersion: 1;
  locale: Locale;
  theme: ThemeMode;
  privacy: {
    blurChatContent: boolean;
    blurRecentPreviews: boolean;
    blurAvatars: boolean;
    blurNames: boolean;
    revealOnHover: boolean;
    blurStrengthPx: number;
    blurOnIdle: boolean;
    idleSeconds: number;
    idleAction: 'blur' | 'lock';
    composerPrivacy: boolean;
    hideTypingExperimental: boolean;
    hideRecordingExperimental: boolean;
    privateStatusViewExperimental: boolean;
    invisibleModeExperimental: boolean;
  };
  enhance: {
    statusDownload: boolean;
    translation: boolean;
    statusHighlights: boolean;
    onlineIndicator: boolean;
    deletedMessageCache: boolean;
    localPins: boolean;
  };
  wallpaper: {
    mode: 'default' | 'solid' | 'gradient' | 'pattern' | 'custom';
    presetId?: string;
    customAssetId?: string;
    opacity?: number;
  };
  diagnostics: { verboseLogs: boolean };
}

export const DEFAULT_SETTINGS: AppSettings = {
  schemaVersion: 1,
  locale: 'en',
  theme: 'system',
  privacy: {
    blurChatContent: false, blurRecentPreviews: false, blurAvatars: false,
    blurNames: false, revealOnHover: true, blurStrengthPx: 8,
    blurOnIdle: false, idleSeconds: 60, idleAction: 'blur', composerPrivacy: false,
    hideTypingExperimental: false, hideRecordingExperimental: false,
    privateStatusViewExperimental: false, invisibleModeExperimental: false,
  },
  enhance: {
    statusDownload: false, translation: false, statusHighlights: false,
    onlineIndicator: false, deletedMessageCache: false, localPins: false,
  },
  wallpaper: { mode: 'default' },
  diagnostics: { verboseLogs: false },
};
