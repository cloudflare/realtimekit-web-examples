# html-examples

## OVERVIEW

5 vanilla HTML/JS/CSS example apps for Cloudflare RealtimeKit. No framework. Deployed as a single Cloudflare Worker.

## STRUCTURE

```
html-examples/
├── examples/
│   ├── default-meeting-ui/          # Single <rtk-meeting> web component; minimal setup
│   ├── create-your-own-ui/          # Full custom UI — pure HTML/CSS/JS, hand-rolled reactive store
│   │   └── components/              # 18 component files (.js + .html templates)
│   ├── with-background-transformer/ # Headless background blur integration
│   ├── background-transformer-ui/   # Background blur with UI controls (blur vs. image toggle)
│   └── with-ui-addons/              # Default UI + @cloudflare/realtimekit-ui-addons widgets
├── update-cloudflare-realtime-deps.sh
├── postbuild.sh
├── worker.js
└── wrangler.jsonc
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Minimal no-framework integration | `default-meeting-ui/` | HTML file + web component; understand before building custom |
| Full custom UI without a framework | `create-your-own-ui/` | Best reference; hand-rolled store, custom setup/control/sidebar |
| Background blur headless | `with-background-transformer/` | API-only; no custom UI |
| Background blur with controls | `background-transformer-ui/` | Adds toggle UI over `with-background-transformer` pattern |
| UI addons (polls, plugins) | `with-ui-addons/` | Drops `@cloudflare/realtimekit-ui-addons` into default meeting UI |

## CONVENTIONS

- SDK loaded via `@cloudflare/realtimekit-ui` npm package — web components (`<rtk-meeting>`, etc.) auto-registered as custom elements on import
- `create-your-own-ui` uses a hand-rolled reactive state store — state changes propagate via custom event dispatching (no external state lib)
- Auth: `authToken` injected via URL query param, same as React examples

## NOTES

- `create-your-own-ui` README is 150+ lines and comprehensive — consult before modifying that example
- `background-transformer-ui` and `with-background-transformer` share the same underlying SDK approach; `background-transformer-ui` adds the UI layer on top
