import { selectors } from './selectors';

export type FailureReason = 'not-found' | 'unsupported' | 'changed-dom' | 'permission';
export type FeatureResult<T> = { ok: true; value: T } | { ok: false; reason: FailureReason };

export class WhatsAppDomAdapter {
  getApp(): FeatureResult<HTMLElement> {
    const app = document.querySelector<HTMLElement>(selectors.app);
    return app ? { ok: true, value: app } : { ok: false, reason: 'not-found' };
  }

  getComposer(): FeatureResult<HTMLElement> {
    const composer = document.querySelector<HTMLElement>(selectors.composer);
    return composer ? { ok: true, value: composer } : { ok: false, reason: 'not-found' };
  }

  observeApp(callback: () => void): FeatureResult<MutationObserver> {
    const result = this.getApp();
    if (!result.ok) return result;
    const observer = new MutationObserver(callback);
    observer.observe(result.value, { childList: true, subtree: true });
    return { ok: true, value: observer };
  }
}
