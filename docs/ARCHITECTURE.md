# Architecture

`entrypoints/content.tsx` hosts the WhatsApp-only injected Shadow DOM UI. Feature code never queries WhatsApp markup directly; it uses modules under `src/adapters/whatsapp/`. Local preferences are validated and stored in `browser.storage.local`. The background worker owns keyboard commands. No component accesses page globals, credentials, or network traffic.
