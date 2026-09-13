import { describe, expect, it } from 'vitest';
import { DEFAULT_SETTINGS } from '../../src/types/settings';

describe('default settings', () => {
  it('keeps sensitive and experimental features off by default', () => {
    expect(DEFAULT_SETTINGS.privacy.blurChatContent).toBe(false);
    expect(DEFAULT_SETTINGS.privacy.hideTypingExperimental).toBe(false);
    expect(DEFAULT_SETTINGS.enhance.deletedMessageCache).toBe(false);
  });
});
