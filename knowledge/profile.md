# Do Thanh Nhat Nguyen: Shopify Developer

Public profile used by the CV chatbot. Everything here is safe to share. Anything not written here is unknown.

## Summary
- Shopify Developer, 4+ years (since 2021), based in Da Nang, Viet Nam, working with clients worldwide.
- Focus: Shopify themes, custom sections, custom Shopify apps, and the services around them.
- Core languages: Liquid, JavaScript, TypeScript. Frameworks: Vue, React, Svelte/SvelteKit, Remix, Node.js.
- Strengths: owning a feature end to end (requirements, build, deploy, support), replacing paid third-party apps with in-house apps, and shipping practical AI features on a live store.
- Open to: full-time roles, agency partnerships, freelance Shopify projects.
- Contact: nhatnguyendothanh@gmail.com, (+84) 935 443 369, github.com/nguyendo1011

## Timeline
| Period | Company | Type | Focus |
|---|---|---|---|
| 2024 - now | Sartoro (custom menswear and tailoring, sartoro.co) | Full-time | Custom Shopify apps, storefront features, AI features, internal tools |
| 2023 - 2024 | QDN Digital | Full-time | Client Shopify builds, team lead for 1-2 junior developers |
| 2023 - 2024 | Scentiment Ecommerce | Part-time | Custom sections, maintenance, hotfixes |
| 2021 - 2023 | Burgess Commerce & Meaningful Mantras | Full-time | Sections, custom features, full store builds |

## Sartoro (2024 - now)
Sartoro is a made-to-measure menswear brand on Shopify. Nguyen builds most of its custom software, usually solo, from the storefront to the admin tools staff use every day.

### Product options and bundles app
- Custom Shopify app that replaced a third-party product-options app.
- Merchandisers build option sets (dropdowns, swatches, add-on prices, images) and reuse them across products as presets.
- A no-code "When, Then, Do" rule editor lets non-developers show or hide options based on what the customer picks.
- Fixed bundles and multipacks using Shopify's native bundle features.
- Storefront loads options lazily so product pages stay fast.
- Includes an audit log of admin changes and a daily product sync.
- Stack: Node.js, React, Shopify Polaris, Shopify Admin GraphQL API, theme app extension (Liquid), PostgreSQL, Docker, GitHub Actions.

### AI virtual try-on
- Shoppers upload a photo on the product page and get a realistic image of themselves wearing the garment.
- Photo checks before generation, consent recorded, rate limiting to prevent abuse.
- Merchant dashboard with settings, usage analytics and shopper feedback.
- A/B testing of AI versions before switching the default; try-on sessions are linked to later orders to measure impact.
- Stack: TypeScript, React, Remix, Shopify App framework and Polaris, theme app extension, PostgreSQL, Google Gemini image models.

### AI product search and AI stylist
- Custom search for sartoro.co that understands natural language ("navy linen suit"), mixing keyword and meaning-based search.
- Theme-matched result cards with quick view and add to cart; filters only show options that exist in the results; mobile-first.
- AI Stylist chat that recommends real products, with guardrails against spam, off-topic questions and made-up prices.
- Merchants can pin, boost or bury products; the index updates automatically when products change.
- Search analytics dashboard, including which searches lead to orders.
- Stack: TypeScript, SvelteKit, Cloudflare Workers, Workers AI, Cloudflare D1 and KV, Typesense, Shopify Admin API.

### Wishlist, reviews and Q&A app
- In-house app that replaced a third-party reviews app.
- Wishlists with named lists; guest wishlists merge into the account at login.
- Photo reviews, automated post-purchase review requests, "Verified buyer" badges, AI review summaries.
- Star ratings, review carousels and an all-reviews page on the storefront; ratings feed search-result rich snippets.
- Moderation dashboard styled like the Shopify admin; imported existing reviews from the previous provider.
- Stack: TypeScript, SvelteKit, Shopify App Proxy and Admin GraphQL API, theme blocks (Liquid), Web Components, Cloudflare Workers, D1, R2, Workers AI.

### Order and tailoring operations platform
- Contributed to Sartoro's internal Shopify app for custom-tailoring orders, then led a ground-up rebuild of it as the next-generation platform.
- Customer fit profiles: one reliable source of truth, built from the customer's choices for guests and logged-in shoppers.
- Order re-confirmation flow: customers review and confirm measurements before production, with a clear status timeline.
- Measurement analysis tools for staff, admin settings editable without a deploy, and correct Vietnamese labels on factory production sheets.
- Rebuild: staff sign-in, orders with status changes synced back to Shopify, background jobs, diagnostics, containerised deployment.
- Stack: Node.js, TypeScript, NestJS, Koa, React, Shopify Polaris and App Bridge, Shopify Admin API, PostgreSQL, Redis, Docker.

### First-party analytics
- Sartoro's own analytics for the storefront and its custom-tailoring fit tool, without relying on third-party analytics.
- Consent-aware tracking, funnel analysis for the fit tool, Core Web Vitals monitoring with alerts after theme deploys.
- Bot and internal-traffic filtering; affiliate conversion tracking; dashboard styled like the Shopify admin.
- Stack: TypeScript, React, Vite, Cloudflare Workers, Cloudflare D1, Tinybird, Shopify Web Pixels.

### Garment configurator (prototype)
- Made-to-measure builder: customers design a jacket, trousers, waistcoat or full suit and see a layered preview and live price.
- Admin editor for options and rules, with live preview; saved designs can be reopened from the order.
- Status: working prototype.
- Stack: TypeScript, SvelteKit (Svelte 5), Cloudflare Workers, R2.

### Internal tools
- AI wedding proposals: stylists generate private, branded proposal pages for couples, using real store products. Staff can edit the AI templates without a deploy.
- Model photo organizer: face recognition sorts photoshoot images by model, then uploads them to Shopify and links products to the models wearing them. Has a dry-run mode.
- Company context service for AI coding assistants: indexes the company's code and docs with source citations and access control.
- Stack across these: TypeScript, Astro, Python, FastAPI, Cloudflare Workers, Shopify Admin API, Docker.

### Prototypes and R&D
- Browser body scan: a 360-degree turn in front of the camera produces body measurements, with no photos leaving the phone.
- Warehouse inventory: QR labels, phone-camera stock scanning, and a floor map built from phone photos with on-device AI.
- Described as prototypes, not shipped products.

## QDN Digital (2023 - 2024)
- Built custom features for client campaigns and events using JavaScript and Shopify Apps.
- Led a small team of 1-2 junior developers: code review and Git merges.
- Delivered projects end to end: filters, search, upsell features and full store builds.
- Daily syncs with the PM; maintenance and hotfixes with fast turnaround.

## Scentiment Ecommerce (2023 - 2024, part-time)
- Custom sections and features per client requirements.
- Maintenance, support and hotfixes for client stores.

## Burgess Commerce & Meaningful Mantras (2021 - 2023)
- Built and modified sections and custom features per client specs.
- Projects from start to launch: filters, search, upsells and more.
- Maintenance, support and hotfixes; supported teammates and kept timelines on track.

## Live stores worked on
Scentiment (home fragrance), Sartoro (custom menswear), Lasermaster (laser engraving equipment, B2B), Meaningful Mantras (candles, lifestyle), Hit Box Arcade (gaming controllers), Housenine (home and living), Stelly (Australian women's fashion).

## Side tools
- Shopify Dev Quick Tools: Chrome extension for Shopify developers (theme detection, preview links, admin shortcuts).
- GetFastImage: Chrome extension that converts page images to WebP and downloads them.

## Skills
- Shopify: themes, Online Store 2.0 sections, Liquid, theme app extensions, custom apps, Admin GraphQL/REST API, App Proxy, webhooks, metafields, metaobjects, bundles, Web Pixels, Polaris.
- Frontend: JavaScript, TypeScript, HTML, CSS, SCSS, Tailwind, Vue, React, Svelte/SvelteKit, Remix, Astro.
- Backend: Node.js, Express, NestJS, Python (FastAPI), PostgreSQL, SQLite, Redis.
- Cloud and tooling: Cloudflare Workers, D1, R2, KV, Workers AI, Docker, GitHub Actions, Git, Figma.
- AI: product search, chat assistants with guardrails, image generation, AI summaries, face recognition, on-device models.
