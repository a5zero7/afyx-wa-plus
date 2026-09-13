import type { AppSettings } from '../../types/settings';

const STYLE_ID = 'afyx-wa-plus-privacy';
export function applyPrivacyStyle(settings: AppSettings): void {
  let style = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement('style');
    style.id = STYLE_ID;
    document.documentElement.append(style);
  }
  const blur = `${settings.privacy.blurStrengthPx}px`;
  style.textContent = `
    ${settings.privacy.blurChatContent ? '[data-pre-plain-text] { filter: blur(' + blur + '); }' : ''}
    ${settings.privacy.blurRecentPreviews ? '[role="grid"] [dir="auto"] { filter: blur(' + blur + '); }' : ''}
    ${settings.privacy.blurAvatars ? 'img[alt] { filter: blur(' + blur + '); }' : ''}
    ${settings.privacy.blurNames ? '[title] { filter: blur(' + blur + '); }' : ''}
    ${settings.privacy.composerPrivacy ? '[contenteditable="true"][role="textbox"] { filter: blur(' + blur + '); }' : ''}
    ${settings.privacy.revealOnHover ? '[data-pre-plain-text]:hover, img[alt]:hover, [title]:hover { filter: none; }' : ''}
  `;
}
