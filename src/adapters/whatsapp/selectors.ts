/** Semantic, version-tolerant WhatsApp Web selectors. Never use generated classes here. */
export const selectors = {
  app: '#app',
  chatList: '[role="grid"], [aria-label="Chat list"]',
  activeChat: '[role="application"]',
  composer: '[contenteditable="true"][role="textbox"]',
  message: '[data-pre-plain-text], [role="row"]',
  avatar: 'img[alt], [role="img"]',
} as const;
