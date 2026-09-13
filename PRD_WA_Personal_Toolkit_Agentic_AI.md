# PRODUCT REQUIREMENTS DOCUMENT (PRD)
## WA Personal Toolkit — Cross-Browser Privacy & Productivity Extension for WhatsApp Web

**Document status:** Build-ready  
**Target:** Personal/private use, no subscription, no licensing server, no paid feature gates  
**Browsers:** Google Chrome / Chromium family + Mozilla Firefox  
**Primary host:** `https://web.whatsapp.com/*`  
**Implementation style:** Independent clean-room implementation; do not copy proprietary source code, assets, branding, or reverse-engineered extension code  
**Recommended stack:** TypeScript + WXT + React + CSS Modules/Tailwind (optional) + Vitest + Playwright  
**Product codename:** `wa-personal-toolkit`  
**Version target:** `0.1.0` MVP → `1.0.0` full personal release

---

# 1. Product Summary

WA Personal Toolkit is a privacy, productivity, export, customization, and local-AI browser extension for WhatsApp Web.

The product must reproduce the *capabilities* visible in the supplied reference screenshots, while using an original implementation, original UI assets, original code, and an independent product name.

The extension must:

- work locally in the browser wherever technically possible;
- have no account system;
- have no subscription;
- have no payment or licensing check;
- have no telemetry by default;
- have no advertisement;
- have no remote feature flag service;
- have no dependency on a proprietary backend;
- expose a consistent UI on Chrome and Firefox;
- fail safely when WhatsApp Web changes its DOM;
- never collect or transmit WhatsApp session credentials, cookies, encryption keys, auth tokens, or unrelated browsing data.

---

# 2. Product Goal

Provide a single local browser extension that enhances WhatsApp Web with:

1. visual privacy controls;
2. lock and idle protection;
3. selected presence/privacy controls where technically safe;
4. message and chat productivity utilities;
5. export tools;
6. status/media utilities;
7. local or browser-provided AI translation/transcription;
8. wallpaper personalization;
9. resilient cross-browser support.

Success means the user can install the unpacked extension and use the major features without creating an account, entering a license, or paying for an API.

---

# 3. Non-Goals

The project must NOT:

- clone the original commercial extension code;
- copy logos, icons, screenshots, store listing text, or proprietary branding;
- bypass WhatsApp authentication;
- extract or store session cookies/tokens;
- defeat another user's privacy settings;
- scrape content that WhatsApp Web has not presented to the logged-in user;
- send bulk unsolicited messages;
- provide spam, campaign, or mass-messaging automation;
- silently upload chat data to a server;
- pretend to be officially affiliated with WhatsApp or Meta;
- guarantee that experimental presence-related features will survive every WhatsApp Web update.

---

# 4. User Persona

## Primary Persona
A single technically capable user who uses WhatsApp Web on desktop and wants:

- better screen privacy in an office/public place;
- fast access to common utilities;
- local export and backup of visible chats;
- custom appearance;
- no recurring subscription;
- minimal cloud dependency;
- Chrome and Firefox support.

No multi-user/team administration is required.

---

# 5. Product Principles

1. **Local First** — keep settings and processed content on-device.
2. **Least Privilege** — request only permissions that are actually needed.
3. **Visible Actions** — destructive or state-changing actions require explicit user intent.
4. **No Credential Access** — never access, persist, log, or export WhatsApp credentials.
5. **Graceful Degradation** — if DOM selectors break, disable only the affected feature.
6. **Cross-Browser Core** — no critical feature may depend solely on Chrome Side Panel.
7. **Original Implementation** — implement functionality from requirements, not copied code.
8. **Reversible UI Changes** — every visual feature can be toggled off instantly.
9. **No Paywall** — all implemented functions are available locally.
10. **Safe Experimentation** — features that touch presence/read-state behavior are isolated behind experimental adapters and feature flags.

---

# 6. Platforms and Compatibility

## 6.1 Primary Targets

### Chrome / Chromium
- Manifest V3.
- Chrome, Edge, Brave, Vivaldi and other Chromium browsers are secondary compatible targets.
- Use packaged code only.
- Prefer the `browser` namespace through WXT abstraction.

### Firefox
- Use WXT browser-specific build.
- Account for Firefox differences in background execution and manifest keys.
- Do not make native Chrome Side Panel a mandatory dependency.
- Use the same injected panel/popup UX as the cross-browser baseline.

## 6.2 Minimum Browser Strategy

Do not hardcode a minimum version until build validation is complete.

The CI pipeline must test:
- latest stable Chrome;
- latest stable Firefox;
- one previous major version where practical.

---

# 7. Recommended Architecture

```text
┌──────────────────────────────────────────────────────────┐
│                      WhatsApp Web                        │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │ Content Script                                    │  │
│  │ - DOM Adapter                                     │  │
│  │ - Feature Orchestrator                            │  │
│  │ - Mutation Observer                              │  │
│  │ - Privacy CSS                                    │  │
│  │ - Export/Status/UI Helpers                       │  │
│  └────────────────┬───────────────────────────────────┘  │
│                   │ runtime messaging                    │
└───────────────────┼──────────────────────────────────────┘
                    │
          ┌─────────▼──────────┐
          │ Extension Runtime  │
          │ background worker/ │
          │ browser adapter    │
          └─────┬────────┬─────┘
                │        │
        ┌───────▼───┐ ┌──▼────────────────┐
        │ Storage   │ │ Local AI adapters │
        │ settings  │ │ translate/STT     │
        └───────────┘ └───────────────────┘

UI surfaces:
- Toolbar action popup
- Injected dock/side panel on web.whatsapp.com (primary consistent UI)
- Optional native Chrome Side Panel enhancement
- Lock-screen overlay
```

---

# 8. Technology Stack

## Required
- TypeScript
- WXT
- React
- WebExtension APIs
- Web Crypto API
- IndexedDB for larger local data
- `browser.storage.local` for preferences
- MutationObserver
- Playwright for E2E
- Vitest for unit tests

## Optional
- Tailwind CSS or CSS Modules
- Zod for settings/data validation
- SheetJS only if license/package policy is acceptable, otherwise implement CSV plus lightweight XLSX generation
- Local Whisper adapter for transcription
- LibreTranslate or Ollama local adapter
- Chrome built-in Translator API when available

## Dependency rule
Every dependency must be:
- open source;
- pinned to a known version;
- bundled at build time;
- never executed from a remote CDN.

---

# 9. UI/UX Requirements

## 9.1 Main Panel

Approximate reference layout:
- width: 340–380 px;
- vertically scrollable;
- white/light base in light mode;
- dark theme equivalent;
- rounded cards;
- green accent for enabled states;
- top title + product icon;
- top utility buttons;
- segmented tabs:
  - Privacy
  - Enhance
  - Wallpaper

Footer:
- language selector;
- help/about;
- optional version display.

Remove from personal build:
- Rate Us prompt;
- upgrade/paywall CTA;
- login/subscription CTA.

## 9.2 Top Actions
- Theme: Light / Dark / System.
- Lock screen shortcut.
- Panel docking mode.
- Full-height / compact toggle where supported.

## 9.3 Toggle Rules
- Disabled = grey.
- Enabled = green.
- Feature change applies immediately.
- Persist across browser restart.
- "Enable all" only affects the group where shown.
- Experimental capabilities show a subtle `Experimental` badge.

## 9.4 Accessibility
- Keyboard navigable.
- Visible focus ring.
- ARIA labels.
- Minimum 44 px interaction target where possible.
- Toggle state must be announced to screen readers.
- Color is not the only state indicator.

---

# 10. Functional Scope Overview

| ID | Feature | Priority | Stability Class |
|---|---|---:|---|
| P01 | Blur chat content | P0 | Stable |
| P02 | Blur recent message previews | P0 | Stable |
| P03 | Blur profile pictures | P0 | Stable |
| P04 | Blur names | P0 | Stable |
| P05 | Lock screen with PIN/password | P0 | Stable |
| P06 | Blur on idle | P0 | Stable |
| P07 | Hide typing indicator | P1 | Experimental |
| P08 | Hide recording status | P1 | Experimental |
| P09 | View status privately | P1 | Experimental |
| P10 | Invisible mode / suppress online presence | P1 | Experimental |
| P11 | Hide composer while typing / focus privacy | P1 | Stable visual mode |
| E01 | Mark all as read | P0 | DOM-dependent |
| E02 | Quick Chat to unsaved number | P0 | Stable |
| E03 | Unlimited local pinned chats | P0 | Stable local overlay |
| E04 | Status download | P0 | DOM/media-dependent |
| E05 | Message translation | P0 | Provider-dependent |
| E06 | Status highlights | P1 | DOM-dependent |
| E07 | Online indicator / tracker | P1 | Experimental / visibility-dependent |
| E08 | Export active chat: TXT | P0 | Stable |
| E09 | Export active chat: HTML | P0 | Stable |
| E10 | Export active chat: JSON | P0 | Stable |
| E11 | Export active chat: XLSX/CSV | P0 | Stable |
| E12 | Export contacts | P1 | Visibility-dependent |
| E13 | Click-to-chat link generator | P0 | Stable |
| E14 | Deleted-message local recovery | P1 | Best-effort local cache |
| E15 | Voice-note transcription | P1 | Local AI/provider-dependent |
| E16 | Profile info helper | P2 | Derived/local |
| W01 | Default wallpaper | P0 | Stable |
| W02 | Solid presets | P0 | Stable |
| W03 | Gradient presets | P0 | Stable |
| W04 | Pattern presets | P0 | Stable |
| W05 | Custom image wallpaper | P0 | Stable |
| W06 | Reset wallpaper | P0 | Stable |
| G01 | Light/dark/system UI | P0 | Stable |
| G02 | English/Indonesian localization | P0 | Stable |
| G03 | Import/export extension settings | P1 | Stable |
| G04 | Diagnostics panel | P1 | Stable |

---

# 11. Detailed Functional Requirements

## P01 — Blur Chat Content

### User story
As a user, I want message contents and media blurred so people near my screen cannot read my chats.

### Scope
Blur:
- incoming/outgoing text bubbles;
- quoted previews;
- image thumbnails;
- video thumbnails;
- stickers;
- link-preview text/media where safely selectable;
- document captions where visible.

### Behavior
- Default blur strength: 8 px.
- Reveal on hover can be enabled/disabled.
- Optional reveal only while holding a configurable modifier key.
- Blur must not alter underlying chat data.

### Acceptance criteria
- Toggle takes effect within 300 ms.
- Scrolling new messages preserves blur.
- Newly rendered messages inherit blur automatically.
- Turning off restores normal rendering without page reload.
- No chat message content is stored solely to implement blur.

---

## P02 — Blur Recent Message Previews

Blur last-message snippets in the left chat list.

### Acceptance criteria
- Existing and newly rendered chat rows are covered.
- Unread badges remain readable.
- Time/date may remain visible by default.
- Optional "blur timestamp too" advanced setting.

---

## P03 — Blur Profile Pictures

Blur:
- contact avatars;
- group avatars;
- status avatars where applicable;
- current-chat header avatar.

Optional reveal on hover.

---

## P04 — Blur Names

Blur:
- contact names;
- group names;
- current chat title;
- sender names in groups;
- names in search results and chat list.

Phone numbers are treated as names for this feature.

---

## P05 — Lock Screen

### Requirements
- Full-page overlay on WhatsApp Web.
- User-configurable PIN/password.
- Lock button available in panel.
- Keyboard shortcut configurable.
- Auto-lock can be tied to idle timeout.

### Password handling
- Never store plaintext.
- Use Web Crypto API.
- Store:
  - random salt;
  - derived password verifier;
  - KDF metadata.
- Prefer PBKDF2-SHA-256 using a high iteration count suitable for interactive use.
- Rate limit unlock attempts locally.
- After repeated failures, add increasing delay.

### Important security note
This is a privacy screen, not a replacement for OS login or disk encryption.

### Acceptance criteria
- Overlay obscures the entire WhatsApp Web application.
- Reloading the page while locked keeps the extension logically locked.
- Unlock does not require network access.
- Password cannot be retrieved from settings UI.

---

## P06 — Blur on Idle

Configurable timeout:
- 15 sec
- 30 sec
- 1 min
- 2 min
- 5 min
- custom

Modes:
- blur all sensitive content;
- full lock overlay.

Events that reset timer:
- mouse/pointer interaction;
- keyboard activity;
- focus within WhatsApp tab.

Do not monitor activity on unrelated websites.

---

## P07 — Hide Typing Indicator [Experimental]

### Goal
Prevent or reduce sending a typing-state signal when the user types.

### Safety constraint
Implementation MUST NOT:
- extract credentials;
- export tokens;
- persist WebSocket frames;
- modify unrelated traffic;
- bypass authentication.

### Engineering strategy
Use an isolated `PresenceAdapter` abstraction.

Possible implementations, in preference order:
1. a stable WhatsApp Web state hook exposed to the page;
2. a packaged MAIN-world bridge that disables only typing-presence dispatch;
3. graceful "unsupported in this WhatsApp version" state.

### Acceptance criteria
- Must never prevent actual message sending.
- Must not break composer input.
- Must degrade to disabled if no safe adapter is detected.
- Must be covered by a kill switch.

---

## P08 — Hide Recording Status [Experimental]

Same engineering boundaries as P07.

Goal:
Suppress the "recording audio..." presence signal without blocking actual voice-note recording.

If safe suppression is unavailable, feature must report unsupported rather than attempting broad network interception.

---

## P09 — View Status Privately [Experimental]

Goal:
Allow viewing status content while reducing/avoiding read receipt behavior where technically possible.

Constraints:
- do not bypass the publisher's privacy restrictions;
- do not fetch content the user's session cannot normally access;
- do not access another account/session.

Behavior:
- clear disclaimer that behavior can change with WhatsApp updates;
- feature-specific diagnostics.

---

## P10 — Invisible Mode [Experimental]

Goal:
Reduce presence/online signaling while WhatsApp Web remains open.

Must be isolated from:
- message delivery;
- normal receiving;
- authentication;
- media retrieval.

If impossible without unsafe internal manipulation, mark feature unavailable for that build.

---

## P11 — Composer Privacy

Two modes:
1. visually blur the text input while user types;
2. hide/reveal typed text with hover/shortcut.

This is purely a local visual privacy feature and does not alter message data.

---

# 12. Enhance Features

## E01 — Mark All as Read

### Behavior
- User presses `Mark all`.
- Extension identifies currently available unread chat rows.
- Marks chats as read using safe UI interactions or stable adapters.
- Processes sequentially with throttling.
- Shows progress:
  - processed;
  - skipped;
  - failed.

### Guardrails
- user-initiated only;
- no recurring automation;
- confirm if unread count exceeds configurable threshold.

### Acceptance criteria
- operation can be cancelled;
- failure on one chat does not stop the rest;
- no message is sent.

---

## E02 — Quick Chat

Input:
- country code;
- phone number;
- optional prefilled message.

Validation:
- E.164-like normalization;
- remove spaces, hyphens, parentheses;
- user preview before navigation.

Action:
- open WhatsApp chat route for the number without requiring contact save.

History:
- disabled by default;
- optional local recent-number history.

---

## E03 — Unlimited Local Pin Chat

### Important design
Do NOT attempt to circumvent server-side WhatsApp pin limits.

Implement an extension-local pin/favorite layer:
- any visible chat can be added to local pins;
- local pinned section appears at the top of chat list or as an extension overlay;
- local state stored in extension storage;
- user can reorder pins;
- user can remove pin.

Pin identity should prefer stable chat identifiers available to the page without extracting credentials. Fall back to normalized visible identifiers where necessary.

---

## E04 — Status Download

Allow download of status image/video already made available to the user's logged-in browser session.

UI:
- Download icon while status is open.
- Filename:
  `wa-status_YYYY-MM-DD_HH-mm-ss.ext`

Constraints:
- no hidden bulk scraping;
- no token export;
- no downloading content that has not been loaded/authorized for the user.

---

## E05 — Message Translation

### User experience
- hover/context action on a message;
- choose `Translate`;
- output displayed inline or in a small popover;
- preserve original text;
- allow source/target language selection.

### Free provider order
1. Chrome built-in Translator API when available;
2. local/self-hosted LibreTranslate endpoint configured by user;
3. local Ollama/LLM adapter configured by user;
4. disabled with setup guidance.

Firefox must never depend on Chrome-only translation.

### Privacy
- default must prefer on-device/local provider;
- external custom endpoint must require explicit opt-in;
- show provider used for each translation;
- no hidden fallback to a paid service.

---

## E06 — Status Highlights

Goal:
Visually highlight chats/avatars whose status indicator is visible in WhatsApp Web.

Behavior:
- decoration only;
- does not query hidden data.

---

## E07 — Online Indicator / Tracker [Experimental]

Scope:
- reflect online state only when WhatsApp Web legitimately exposes it to the logged-in user;
- no attempts to bypass a contact's privacy setting.

Optional local event log:
- OFF by default;
- max retention configurable;
- stores contact identifier + timestamp + visible state only;
- clear-all button.

---

## E08–E11 — Export Active Chat

Formats:
- TXT
- HTML
- JSON
- CSV/XLSX

### Export model
Export only content present/accessible in the active chat DOM/session.

Fields:
- chat title;
- message direction;
- sender display name;
- timestamp text;
- message text;
- quoted text where visible;
- message type;
- attachment filename where visible;
- link URLs where visible;
- export timestamp.

### HTML
- self-contained;
- no remote scripts;
- escaped content;
- optional inline thumbnails only if already loaded and user selects `Include media`.

### JSON schema example
```json
{
  "schemaVersion": 1,
  "chat": {
    "title": "Example"
  },
  "exportedAt": "ISO-8601",
  "messages": [
    {
      "id": "local-export-id",
      "direction": "incoming",
      "sender": "Display Name",
      "timestamp": "visible timestamp",
      "type": "text",
      "text": "message"
    }
  ]
}
```

### Media
Default: metadata only.
Optional: user-initiated inclusion for media already loaded in the browser.

### Large chats
- stream/iterate in chunks where possible;
- progress UI;
- cancel;
- avoid freezing UI thread.

---

## E12 — Export Contacts

Export visible/accessible contacts discovered through WhatsApp Web UI.

Fields:
- display name;
- phone number if visible;
- type: contact/group/unknown;
- optional labels available in UI.

Formats:
- CSV;
- JSON;
- XLSX optional.

Must not claim to export phonebook entries unavailable to WhatsApp Web UI.

---

## E13 — Click-to-Chat Link Generator

Input:
- phone number;
- optional message.

Output:
- generated click-to-chat URL;
- Copy button;
- Open button;
- QR code optional P2.

No external shortening service.

---

## E14 — Deleted Message Local Recovery

### Definition
This feature is not "server recovery."

It can only retain a local copy of message content that the extension already observed before WhatsApp Web replaced it with a deletion marker.

### Default
OFF.

### Storage
- IndexedDB;
- configurable retention:
  - session only;
  - 1 day;
  - 7 days;
  - custom;
- clear immediately button.

### UX
When a message becomes deleted:
- show an extension-only local recovery indicator;
- reveal only on explicit user action.

### Privacy
- local only;
- never sync;
- no media retention by default.

---

## E15 — Voice-Note Transcription

### Provider order
1. local/browser on-device transcription capability where available;
2. optional locally hosted Whisper/Ollama-compatible service;
3. optional user-imported local model if implementation supports it.

No paid API is bundled.

### UX
- Transcribe button near voice note;
- progress;
- transcript in collapsible panel;
- copy transcript;
- delete transcript.

### Privacy
- default local;
- any external local-network endpoint requires explicit setup.

---

## E16 — Profile Info Helper

Derived helper, not a hidden-data feature.

Can display:
- country inferred from phone calling code;
- approximate timezone based on country/region if determinable;
- current local time estimate;
- currency reference.

Must clearly label inferred fields as estimates.

---

# 13. Wallpaper Module

## W01 Default
Restore WhatsApp's default appearance.

## W02 Solid Presets
Provide at least 8 soft preset colors.

## W03 Gradients
At least 4 built-in gradients.

## W04 Patterns
At least 4 bundled local pattern assets.

## W05 Custom
- upload JPG/PNG/WebP;
- crop mode:
  - cover;
  - contain;
  - tile;
- opacity control;
- optional chat-overlay tint.

Custom image is stored locally.

## W06 Reset
One-click reset to default and delete custom stored wallpaper.

### Acceptance
- changes apply without reload;
- composer and bubbles remain readable;
- wallpaper cannot alter other websites.

---

# 14. General Settings

```ts
type ThemeMode = "light" | "dark" | "system";

interface AppSettings {
  schemaVersion: number;
  locale: "en" | "id";
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
    idleAction: "blur" | "lock";
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
    mode: "default" | "solid" | "gradient" | "pattern" | "custom";
    presetId?: string;
    customAssetId?: string;
    opacity?: number;
  };

  diagnostics: {
    verboseLogs: boolean;
  };
}
```

---

# 15. Data Storage

## `browser.storage.local`
Use for:
- feature toggles;
- theme;
- locale;
- idle preferences;
- local pin references;
- provider settings excluding secrets where possible;
- wallpaper metadata;
- KDF verifier metadata.

## IndexedDB
Use for:
- optional deleted-message local cache;
- custom wallpaper blobs;
- optional transcript cache;
- temporary large export preparation.

## Secret handling
If a user configures a local endpoint token:
- never log it;
- store only if user explicitly selects "remember";
- use local storage only;
- provide delete button.

For this personal project, avoid any cloud sync of chat-related settings/data.

---

# 16. Permissions

Start with the minimum practical manifest permissions.

Candidate permissions:

```json
{
  "permissions": [
    "storage",
    "downloads",
    "scripting",
    "activeTab"
  ],
  "host_permissions": [
    "https://web.whatsapp.com/*"
  ]
}
```

Optional permissions only when needed:
- `sidePanel` in Chrome build;
- `unlimitedStorage` only if local AI/data storage actually requires it;
- localhost host permissions only after user enables a local translation/STT provider.

Do not request:
- `<all_urls>`;
- cookies;
- history;
- webRequest access unless a reviewed experimental requirement cannot be met otherwise.

Experimental presence features should prefer in-page adapter logic and never require broad browsing permissions.

---

# 17. Cross-Browser UI Strategy

## Baseline
Use an injected docked panel inside `web.whatsapp.com` rendered in a Shadow DOM root.

Advantages:
- consistent Chrome/Firefox experience;
- CSS isolation;
- no hard dependency on Chrome Side Panel;
- easy screenshot-style vertical layout.

## Optional Chrome enhancement
Native `sidePanel` may be offered as an alternative surface in Chrome builds.

Core functionality must remain available through:
- toolbar popup;
- injected dock panel.

---

# 18. DOM Adapter Layer

WhatsApp Web changes often. Direct selectors must not be scattered through feature code.

Create:

```text
src/
  adapters/
    whatsapp/
      selectors.ts
      dom-adapter.ts
      presence-adapter.ts
      status-adapter.ts
      chat-adapter.ts
      export-adapter.ts
      diagnostics.ts
```

## Rules
- All DOM queries go through adapter methods.
- Prefer semantic attributes:
  - `role`;
  - `aria-*`;
  - stable data attributes when available.
- Avoid deep positional CSS selectors.
- Never rely only on generated class names.
- Use `MutationObserver`.
- Detect feature availability at runtime.
- Return typed `Result` values rather than throwing into UI code.

Example:

```ts
type FeatureResult<T> =
  | { ok: true; value: T }
  | { ok: false; reason: "not-found" | "unsupported" | "changed-dom" | "permission" };
```

---

# 19. Main-World Bridge Rules

Some WhatsApp state may live in page context rather than the extension isolated world.

If a MAIN-world bridge is used:
- bridge code must be packaged with the extension;
- expose the narrowest possible API;
- validate every message payload;
- never expose arbitrary `eval`;
- never return credentials or session internals;
- never expose raw global object dumps;
- remove bridge listeners when disabled;
- feature must be isolated behind an adapter.

---

# 20. Messaging Architecture

Message namespaces:

```text
SETTINGS/*
PRIVACY/*
LOCK/*
EXPORT/*
STATUS/*
TRANSLATE/*
TRANSCRIBE/*
PINS/*
DIAGNOSTICS/*
```

Every message:
- has a typed payload;
- is schema validated;
- has an explicit response type;
- rejects unknown action names.

Do not accept arbitrary code or selector strings from content/page context.

---

# 21. Security Requirements

## Required
- CSP compatible with browser extension policies.
- No remote JS execution.
- No `eval`.
- No dynamically downloaded executable code.
- Escape all user/chat content before rendering into extension HTML.
- Sanitize generated HTML exports.
- Blob URLs revoked after use.
- Downloads require explicit user action.
- No credentials in console logs.
- Diagnostics redact:
  - phone numbers;
  - message text;
  - chat names;
  - endpoint tokens.

## Threats to test
- malicious message containing HTML/script text;
- malicious filename;
- huge message history;
- corrupted settings;
- oversized wallpaper;
- wrong local translator endpoint;
- compromised page trying to spoof extension messages;
- DOM changes;
- user opening multiple WhatsApp tabs.

---

# 22. Privacy Requirements

Default:
- zero telemetry;
- zero analytics;
- zero crash upload;
- zero account;
- zero server database.

Provide an About/Privacy screen:

> WA Personal Toolkit processes WhatsApp Web data locally to provide enabled features. The extension does not require an account and does not transmit your chats to a developer-operated server. Optional third-party or local AI endpoints are used only when explicitly configured by the user.

Do not state "100% private" if the user enables an external provider.

---

# 23. Performance Requirements

Targets:
- content script idle CPU near zero;
- mutation processing debounced/batched;
- panel open < 300 ms after UI assets are loaded;
- privacy toggle effect < 300 ms;
- avoid full DOM rescans on every mutation;
- export of large chat must yield to UI thread;
- no unbounded arrays/event logs;
- no periodic polling faster than necessary.

Use:
- targeted observers;
- requestIdleCallback where appropriate;
- batching;
- feature-specific observers only when enabled.

---

# 24. Reliability Requirements

Each feature must have:
- availability check;
- runtime error boundary;
- diagnostics code;
- kill switch.

A broken experimental feature must not prevent:
- WhatsApp loading;
- message reading;
- message sending;
- extension settings opening.

---

# 25. Diagnostics

Developer/diagnostic screen:
- extension version;
- browser;
- WhatsApp host URL;
- enabled features;
- adapter health;
- selector checks:
  - chat list found;
  - active chat found;
  - composer found;
  - status viewer found;
- last feature errors;
- `Copy sanitized diagnostics`.

Must not include message content or session secrets.

---

# 26. Localization

Initial:
- English (`en`)
- Indonesian (`id`)

All UI strings must live in locale resources, not hardcoded inside components.

Date/time formatting uses browser locale.

---

# 27. Keyboard Shortcuts

Suggested:
- Toggle privacy blur: `Alt+Shift+B`
- Lock WhatsApp: `Alt+Shift+L`
- Open toolkit panel: `Alt+Shift+X`

All shortcuts must be configurable through browser extension shortcut facilities where supported.

---

# 28. Agentic AI Build Contract

This PRD is intended to be consumed by an autonomous coding agent.

The agent MUST follow these rules:

1. Treat this PRD as the source of truth.
2. Do not add subscription, account, telemetry, analytics, ads, or licensing.
3. Do not copy code/assets from the reference extension.
4. Do not attempt credential/session-token extraction.
5. Do not use remote hosted JavaScript.
6. Implement stable/local features before experimental presence features.
7. Never block WhatsApp's normal send/receive flow if an enhancement fails.
8. Put all WhatsApp-specific DOM logic behind adapters.
9. Add tests with every feature.
10. Maintain Chrome and Firefox builds.
11. If a requested experimental feature cannot be implemented safely, return `unsupported` in the UI and document why.
12. Do not fake success for unimplemented features.
13. Keep a `FEATURE_STATUS.md` with:
    - implemented;
    - tested Chrome;
    - tested Firefox;
    - experimental;
    - blocked.
14. After each milestone, run:
    - typecheck;
    - unit tests;
    - extension build;
    - E2E smoke tests.
15. Before release, verify no secrets, chat data, or test fixtures containing personal data are committed.

---

# 29. Agent Implementation Phases

## Phase 0 — Repository bootstrap
Deliver:
- WXT TypeScript project;
- React UI;
- Chrome build;
- Firefox build;
- lint/typecheck/test scripts;
- base CI;
- extension opens only on WhatsApp host where relevant.

Exit criteria:
- both browser builds load successfully;
- no console errors.

## Phase 1 — Settings + panel shell
Deliver:
- Privacy/Enhance/Wallpaper tabs;
- local settings store;
- theme;
- localization;
- Shadow DOM injected panel;
- toolbar popup;
- feature toggle components.

## Phase 2 — Stable privacy
Deliver:
- P01–P06;
- P11;
- keyboard shortcut;
- lock persistence.

## Phase 3 — Stable enhance utilities
Deliver:
- E02;
- E03 local pins;
- E08–E11 exports;
- E13;
- W01–W06.

## Phase 4 — DOM-dependent utilities
Deliver:
- E01 Mark all as read;
- E04 status download;
- E06 status highlights;
- E12 contact export;
- diagnostics.

## Phase 5 — Local AI
Deliver:
- E05 translation provider abstraction;
- Chrome built-in translation support;
- local endpoint adapter;
- E15 transcription adapter.

## Phase 6 — Local cache features
Deliver:
- E14 deleted-message local recovery;
- retention settings;
- privacy controls.

## Phase 7 — Experimental presence
Deliver adapters for:
- P07;
- P08;
- P09;
- P10;
- E07.

Do not release an experimental capability as "working" until validated against current WhatsApp Web.

## Phase 8 — Hardening
Deliver:
- selector resilience tests;
- settings migration tests;
- performance profiling;
- Chrome/Firefox E2E;
- release package.

---

# 30. Repository Structure

```text
wa-personal-toolkit/
├─ entrypoints/
│  ├─ background.ts
│  ├─ content.ts
│  ├─ popup/
│  └─ options/
├─ src/
│  ├─ adapters/
│  │  ├─ browser/
│  │  ├─ ai/
│  │  └─ whatsapp/
│  ├─ components/
│  ├─ features/
│  │  ├─ privacy/
│  │  ├─ lock/
│  │  ├─ quick-chat/
│  │  ├─ pins/
│  │  ├─ status/
│  │  ├─ export/
│  │  ├─ translate/
│  │  ├─ transcribe/
│  │  ├─ deleted-cache/
│  │  └─ wallpaper/
│  ├─ storage/
│  ├─ messaging/
│  ├─ locales/
│  ├─ security/
│  ├─ diagnostics/
│  └─ types/
├─ tests/
│  ├─ unit/
│  ├─ fixtures/
│  └─ e2e/
├─ public/
│  ├─ icons/
│  └─ wallpapers/
├─ docs/
│  ├─ ARCHITECTURE.md
│  ├─ PRIVACY.md
│  ├─ FEATURE_STATUS.md
│  └─ TEST_PLAN.md
├─ AGENTS.md
├─ README.md
├─ wxt.config.ts
└─ package.json
```

---

# 31. Testing Strategy

## Unit
Test:
- settings validation/migration;
- phone normalization;
- export serialization;
- HTML escaping;
- password KDF verification;
- wallpaper settings;
- translation adapter selection;
- retention cleanup.

## DOM adapter tests
Use sanitized HTML fixtures mimicking:
- chat list;
- active chat;
- status viewer;
- composer;
- deleted-message marker.

Selectors must be centralized so fixture updates are simple.

## E2E
Minimum flows:
1. open WhatsApp mock/test page;
2. open extension panel;
3. toggle blur;
4. verify CSS;
5. enable lock;
6. unlock;
7. create Quick Chat URL;
8. export sample chat;
9. apply wallpaper;
10. Chrome build smoke test;
11. Firefox build smoke test.

Never automate against a real personal WhatsApp account in CI.

## Manual current-site validation
Required after WhatsApp Web UI changes:
- chat list selectors;
- active message selectors;
- status viewer;
- unread state;
- composer;
- media download path.

---

# 32. Acceptance Criteria for v1.0

v1.0 can be called complete when:

- Chrome build installs and runs.
- Firefox build installs and runs.
- No login/subscription/payment is present.
- No telemetry is present.
- Privacy blur features work reliably.
- Lock screen works offline.
- Idle privacy works.
- Quick Chat works.
- Local pins work without server-limit bypass.
- Status download works for media already accessible in the UI.
- Active chat exports work in TXT/HTML/JSON/CSV or XLSX.
- Contact export accurately labels its visibility limitations.
- Click-to-chat generator works.
- Wallpaper presets/custom upload work.
- English and Indonesian UI work.
- Translation works with at least one zero-cost local/browser provider in Chrome and one configurable local provider available for Firefox.
- Deleted-message recovery clearly functions only for content previously observed locally.
- Experimental presence features are either validated or visibly marked unsupported/experimental.
- No core WhatsApp flow breaks when the extension fails.
- All package code is local/bundled.
- Security review passes.

---

# 33. Definition of Done per Feature

A feature is only `Done` when all are true:

- requirement implemented;
- toggle/panel UX implemented;
- storage persistence implemented where relevant;
- error state handled;
- no unhandled console errors;
- unit test added;
- DOM adapter test added if applicable;
- Chrome manually tested;
- Firefox manually tested or explicitly marked browser-limited;
- privacy implications documented;
- diagnostics code added;
- feature status updated.

---

# 34. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| WhatsApp DOM changes | feature breakage | central adapter + diagnostics + semantic selectors |
| Presence internals change | experimental features fail | feature isolation + kill switch + unsupported state |
| Store policy blocks unsafe technique | distribution issue | local packaged code + least permissions |
| Firefox/Chrome API mismatch | browser divergence | WXT + browser adapters + separate builds |
| Chat export freezes page | poor UX | chunking + progress + cancel |
| Local cache contains sensitive content | privacy risk | OFF by default + retention + clear button |
| Translator sends content externally | privacy risk | local-first + explicit provider indication |
| Wallpaper blob grows storage | storage issue | size limit + compression/import guard |
| Malicious message content enters export | XSS risk | strict escaping/sanitization |
| User expects true server-side unlimited pins | expectation mismatch | explicitly label `Local Pins` |

---

# 35. Feature Capability Labels

Use these visible labels:

- **Local** — implemented purely in extension/browser.
- **DOM-dependent** — relies on current WhatsApp Web markup.
- **Experimental** — touches behavior that can change or may not be safely available.
- **Provider required** — needs local/browser AI provider.
- **Unsupported** — no safe compatible adapter detected.

Never silently hide a failed feature without explanation.

---

# 36. Privacy-Preserving AI Provider Interface

```ts
export interface TranslationProvider {
  id: string;
  label: string;
  isLocal: boolean;
  isAvailable(): Promise<boolean>;
  translate(input: {
    text: string;
    source?: string;
    target: string;
  }): Promise<{ text: string }>;
}

export interface TranscriptionProvider {
  id: string;
  label: string;
  isLocal: boolean;
  isAvailable(): Promise<boolean>;
  transcribe(input: Blob): Promise<{ text: string }>;
}
```

Provider selection must be explicit and user-visible.

---

# 37. Settings Import/Export

Export only extension settings by default.

Do not include:
- chat exports;
- deleted-message cache;
- transcripts;
- local provider secrets.

Format:

```json
{
  "product": "wa-personal-toolkit",
  "schemaVersion": 1,
  "exportedAt": "ISO-8601",
  "settings": {}
}
```

Import:
- schema validate;
- preview changes;
- confirm;
- migrate old schema if supported.

---

# 38. Suggested Original Product Copy

Name:
**WA Personal Toolkit**

Short description:
**Local privacy, export, translation and customization tools for WhatsApp Web.**

Disclaimer:
**Independent browser extension. Not affiliated with or endorsed by WhatsApp LLC or Meta Platforms, Inc.**

Do not use the original extension's logo or product name.

---

# 39. Release Artifacts

Agent must produce:

```text
release/
  chrome/
    wa-personal-toolkit-chrome.zip
  firefox/
    wa-personal-toolkit-firefox.zip
  checksums.txt
```

Also:
- README installation steps for unpacked Chrome;
- Firefox temporary-install steps for development;
- version changelog;
- known limitations.

---

# 40. Final Agent Handoff Prompt

Use this text when handing the repository to a coding agent:

> Build `WA Personal Toolkit` according to `PRD_WA_Personal_Toolkit_Agentic_AI.md` and `AGENTS.md`. Start from Phase 0 and work sequentially. The extension is personal/local-first, free, cross-browser, and must never include accounts, subscriptions, telemetry, remote JavaScript, credential extraction, or copied third-party extension source/assets. Use WXT + TypeScript + React. Keep all WhatsApp-specific logic behind adapter interfaces. Implement stable features before experimental presence features. Every feature must have tests, error handling, diagnostics, and graceful degradation. After each phase run typecheck, unit tests, browser builds, and E2E smoke tests. Do not claim experimental features are complete unless they are verified against the current WhatsApp Web behavior.
