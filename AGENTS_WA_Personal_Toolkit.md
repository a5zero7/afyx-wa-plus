# AGENTS.md — WA Personal Toolkit

This repository is designed to be implemented by an autonomous coding agent.

## Mission

Build a clean-room, local-first Chrome/Firefox extension that enhances WhatsApp Web with privacy, export, translation, status, customization, and productivity features defined in the PRD.

## Source of Truth

Read in this order:

1. `PRD_WA_Personal_Toolkit_Agentic_AI.md`
2. `AGENTS.md`
3. `docs/ARCHITECTURE.md`
4. `docs/FEATURE_STATUS.md`
5. tests

If implementation conflicts with the PRD, the PRD wins unless a browser security requirement makes it impossible. In that case document the conflict and choose the safer implementation.

## Hard Constraints

- No account system.
- No paid tier.
- No feature license.
- No telemetry/analytics.
- No advertising.
- No remote hosted JavaScript.
- No eval.
- No credential/session-cookie/token extraction.
- No bulk unsolicited messaging features.
- No copying source, assets, icons, or branding from other extensions.
- No hidden cloud fallback.
- No broad `<all_urls>` permission.
- No silent transmission of chat content.

## Required Stack

- WXT
- TypeScript
- React
- WebExtension APIs
- Vitest
- Playwright
- Web Crypto API
- browser.storage.local
- IndexedDB when large local data is needed

## Architecture Rules

- WhatsApp DOM logic belongs only under `src/adapters/whatsapp/`.
- Browser differences belong only under `src/adapters/browser/`.
- AI provider differences belong only under `src/adapters/ai/`.
- Feature code must never hardcode generated WhatsApp class names.
- UI code must not query WhatsApp DOM directly.
- Experimental presence logic must not leak into stable feature code.
- Every experimental adapter must have an availability probe and kill switch.
- Use Shadow DOM for injected UI.

## Implementation Order

Phase 0: bootstrap  
Phase 1: panel/settings  
Phase 2: stable privacy  
Phase 3: stable utilities + wallpaper  
Phase 4: DOM-dependent utilities  
Phase 5: local AI  
Phase 6: deleted-message local cache  
Phase 7: experimental presence  
Phase 8: hardening/release

Do not jump to Phase 7 before Phases 0–6 are working.

## Required Commands

Provide package scripts equivalent to:

```bash
pnpm dev
pnpm dev:firefox
pnpm typecheck
pnpm lint
pnpm test
pnpm test:e2e
pnpm build
pnpm build:firefox
pnpm zip
pnpm zip:firefox
```

## Testing Rule

A feature is not done because the UI exists.

Done means:
- logic implemented;
- failure state implemented;
- unit test added;
- adapter/DOM test added where applicable;
- Chrome checked;
- Firefox checked or limitation recorded;
- no new console errors;
- docs updated.

## Selector Rule

Prefer:
1. roles;
2. accessible labels;
3. stable data attributes;
4. structural relation within a known adapter scope.

Avoid:
- generated class names;
- nth-child chains;
- global querySelector scattered through features.

## Logging

Create a logger with levels:
- error;
- warn;
- info;
- debug.

Production defaults:
- debug off.

Redact:
- phone numbers;
- names;
- message content;
- URLs containing identifiers;
- auth/session information;
- local endpoint tokens.

## Security

Sanitize all chat-derived text used in HTML.
Never inject unsanitized strings into `innerHTML`.
Never return page globals through the MAIN-world bridge.
Never allow arbitrary message names or arbitrary selector execution.
Validate all runtime messages.
Do not use remote scripts.

## Experimental Features

The following are experimental unless proven otherwise:
- hide typing state;
- hide recording state;
- private status viewing;
- invisible/online suppression;
- online tracking.

If a safe adapter cannot be built:
- return `unsupported`;
- show a clear UI state;
- document why;
- do not use credential extraction or broad network interception as a workaround.

## Local Pins

"Unlimited pins" must be implemented as extension-local pins/favorites.
Do not attempt to defeat WhatsApp server-side pin limits.

## Deleted Messages

Only preserve content that was already observed locally while the feature was enabled.
Do not claim server recovery.
Default off.
Retention must be configurable.

## Translation

Provider priority:
1. browser built-in local translator where supported;
2. user-configured local/self-hosted LibreTranslate;
3. user-configured local Ollama/LLM endpoint;
4. unavailable.

Never silently send content to a third-party cloud provider.

## Transcription

Prefer local/on-device provider.
External local-network endpoint requires user setup and explicit consent.

## Commit Hygiene

Never commit:
- real chat exports;
- personal phone numbers;
- cookies;
- tokens;
- screenshots containing private chats;
- browser profiles;
- local AI secrets.

Use synthetic test fixtures only.

## Phase Completion Report

After each phase, update `docs/FEATURE_STATUS.md` with a table:

| Feature | State | Chrome | Firefox | Tests | Notes |
|---|---|---|---|---|---|

Allowed state values:
- planned
- implementing
- implemented
- experimental
- unsupported
- blocked

## Final Release Gate

Before `1.0.0`:
- both builds succeed;
- stable feature tests pass;
- no unreviewed broad permission;
- no remote executable code;
- no telemetry endpoint;
- no secrets in repo;
- README and privacy documentation are complete;
- experimental limitations are clearly visible.
