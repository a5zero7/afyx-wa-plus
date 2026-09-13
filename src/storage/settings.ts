import { z } from 'zod';
import { DEFAULT_SETTINGS, type AppSettings } from '../types/settings';

const settingsSchema = z.object({
  schemaVersion: z.literal(1),
  locale: z.enum(['en', 'id']),
  theme: z.enum(['light', 'dark', 'system']),
  privacy: z.object({
    blurChatContent: z.boolean(), blurRecentPreviews: z.boolean(), blurAvatars: z.boolean(),
    blurNames: z.boolean(), revealOnHover: z.boolean(), blurStrengthPx: z.number().min(1).max(24),
    blurOnIdle: z.boolean(), idleSeconds: z.number().int().min(15).max(3600),
    idleAction: z.enum(['blur', 'lock']), composerPrivacy: z.boolean(),
    hideTypingExperimental: z.boolean(), hideRecordingExperimental: z.boolean(),
    privateStatusViewExperimental: z.boolean(), invisibleModeExperimental: z.boolean(),
  }),
  enhance: z.object({
    statusDownload: z.boolean(), translation: z.boolean(), statusHighlights: z.boolean(),
    onlineIndicator: z.boolean(), deletedMessageCache: z.boolean(), localPins: z.boolean(),
  }),
  wallpaper: z.object({
    mode: z.enum(['default', 'solid', 'gradient', 'pattern', 'custom']),
    presetId: z.string().optional(), customAssetId: z.string().optional(), opacity: z.number().min(0).max(1).optional(),
  }),
  diagnostics: z.object({ verboseLogs: z.boolean() }),
});

const KEY = 'afyx-wa-plus-settings';

export async function getSettings(): Promise<AppSettings> {
  const stored = await browser.storage.local.get(KEY);
  const parsed = settingsSchema.safeParse(stored[KEY]);
  return parsed.success ? parsed.data : structuredClone(DEFAULT_SETTINGS);
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  const validated = settingsSchema.parse(settings);
  await browser.storage.local.set({ [KEY]: validated });
}
