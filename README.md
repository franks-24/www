# Franks24 — interactive website

The public homepage for **Franks24**, the parent brand. **Dispatch** is an independent service under Franks24, with its own application and Google authentication.

**Website:** https://www.franks24.com/  
**Dispatch service:** https://dispatch.franks24.com/  
**Source:** https://github.com/franks-24/www

## Experience

- Responsive, motion-led, original SVG design using native HTML/CSS/JavaScript (no framework, tracking SDK, or dependency installation).
- Interactive **play / pause / reset** workflow illustration. This is a **demo**, not live jobs, dispatch activity or operational telemetry.
- Accessible mobile navigation with Escape dismiss and correct aria-expanded state.
- Job seeker / hiring team content switcher with accessible tabs and keyboard arrows, Home and End.
- FAQ native disclosure controls, keyboard-visible focus, skip link and reduced-motion handling.
- Zero credentials, authentication handlers or Firebase configuration in the public homepage.
- Lightweight vector favicon and semantic metadata.

## Local preview

Serve the repository root with any static HTTP server, for example:

    python3 -m http.server 8080

Then visit http://localhost:8080 . You can also open index.html directly, but HTTP serving better matches GitHub Pages.

## Quality checks

Requires Node.js 22 or newer.

    npm test

The test command checks JavaScript syntax and runs static tests for identity, domain references, accessibility hooks, responsive CSS, reduced-motion support, external links and assets. This is not a replacement for manual browser/device QA.

## Deployment

GitHub Actions runs checks for pull requests. A successful push to **main** triggers the GitHub Pages deployment workflow in .github/workflows/site.yml; it is not deployed on a feature branch.

To publish: ensure **Settings → Pages → Build and deployment → Source: GitHub Actions**, then merge the reviewed PR. The existing CNAME maps to www.franks24.com; DNS records, TLS certificate issuance and Pages environment permissions must also be checked externally. Avoid parallel Pages workflows deploying to the same environment.

**Do not claim live publication merely because code was committed.** Verify the workflow run and https://www.franks24.com/ after merging.

## Authentication boundary

Google sign-in is managed by the **Dispatch** application (repository franks-24/dispatch). This public homepage links users to that service without copying OAuth configuration, Google assets or credentials into the parent website. Dispatch's Google SSO will only work when Firebase provider configuration, authorised domains and production rules are operational and tested.

## Accessibility and performance verification

Before merge, inspect at 320px, 375px, 768px, 1024px and desktop widths. Test touch, keyboard-only navigation, screen-reader tab labels, contrast, reduced motion and the interactive animation with a hidden browser tab. Review Core Web Vitals and Lighthouse with the deployed URL.
