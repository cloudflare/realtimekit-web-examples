# angular-examples

## OVERVIEW

3 Angular example apps demonstrating Cloudflare RealtimeKit. Deployed as a single Cloudflare Worker, same sub-path pattern as react-examples.

## STRUCTURE

```
angular-examples/
├── examples/
│   ├── default-meeting-ui/    # Drop-in <rtk-meeting> web component — minimal integration
│   ├── create-your-own-ui/    # Full custom Angular UI with services, sidebar, setup screen
│   └── with-video-transformer/ # Default UI + background blur via realtimekit-ui-addons
├── update-cloudflare-realtime-deps.sh
├── postbuild.sh
├── worker.js
└── wrangler.jsonc
```

## CONVENTIONS

- **NgModule-based** — all three examples use `@NgModule` with traditional module architecture. Do NOT use standalone components or `bootstrapApplication`.
- `useDefineForClassFields: false` in `tsconfig.json` — required for Angular decorators; do not change
- `experimentalDecorators: true` + `strictTemplates: true` enforced across all examples
- Build uses Angular CLI (`ng build` via `@angular-devkit/build-angular:browser`) — no Vite
- Bundle budgets are high: 4 MB initial warning / 5 MB error — expected for SDK-heavy apps
- Prettier v2 (inline config in `package.json`) — not v3 like the rest of the repo

## SDK PACKAGES

- `@cloudflare/realtimekit-angular-ui` — Angular-specific wrapper exposing `<rtk-meeting>` and other components as Angular directives
- `@cloudflare/realtimekit-ui` — underlying web components (loaded via `@cloudflare/realtimekit-angular-ui`)
- `@cloudflare/realtimekit-ui-addons` — background transformer (`with-video-transformer` only)

## ANTI-PATTERNS

- Do NOT add `vite.config.ts` — Angular examples use `ng build`, not Vite
- Do NOT switch to standalone components without updating all three examples consistently

## NOTES

- `create-your-own-ui/angular.json` has a copy-paste error: project `name` field is `"default-meeting-ui"` — do not "fix" without verifying the build still passes
- `create-your-own-ui` has the most comprehensive architecture (services, sidebar with custom tabs, media preview modal, Tailwind) — use as reference for Angular SDK integration
- Angular 15 era (`@angular/*` ^15.0.0); `rxjs ~7.5.0`, `zone.js ~0.12.0`
