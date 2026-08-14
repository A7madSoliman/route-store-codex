# Practical Implementation Milestones

## How to use this sequence

This is a beginner-to-advanced learning path. Complete one milestone, run its verification, update `DECISIONS.md` when evidence changes, and make one focused commit before starting the next milestone. Release headings group related capabilities; they do not require every milestone in an earlier release to finish before an unrelated vertical can begin.

Use this vertical execution path for the current repository:

`F00–F05 → D07–D10 → C00–C09 → F06 → A00–A04 → F07 → A05–A07 → F08 → A08–A09 → F09 → W01–W03 → F10 → W04–W08 → F11 → X01–X04 → F12 → X05–X08 → O00–O02 if approved → F13 → conditional admin → testing/deployment`

Each protected verification milestone runs immediately before its matching implementation vertical. Do not front-load F06–F12 merely because they appear in the Foundation group. F13 is a final evidence-consolidation checkpoint, not a prerequisite for architecture, public catalog, or a feature whose own verification gate has passed. D04 is an independent design track after D03/D06 and joins this path as a C00 dependency; it does not depend on D09 or D10 and may be worked while either is blocked.

Milestone statuses:

- **Complete** — the required repository artifact exists and has been reviewed.
- **Artifact present** — an artifact exists, but its milestone should be reopened if verified API evidence or approved design changes.
- **Planned** — ready after its dependencies are complete.
- **Conditional** — may proceed only when its stated safety or contract gate passes.
- **Deferred** — intentionally excluded until new evidence changes the decision.

Each milestone contains the same fields: Status, Outcome, Work, Verification, Commit, and Dependencies. A dependency on a decision means that the decision must have enough evidence for the milestone; it does not require every unrelated API uncertainty to be resolved.

## Working and live-verification rules

- `docs/API_INVENTORY.md` remains the endpoint inventory. All 33 Postman requests must stay represented in the endpoint coverage matrix at the end of this document.
- Use the ignored raw collection only as historical evidence. Use the sanitized collection for request names and shapes, then supply fresh test values locally.
- Public catalog GET endpoints may be inspected without authentication. “No auth shown” is not proof of public access; record the observed status.
- Create a new synthetic account dedicated to this project before testing pre-auth or protected customer flows. Keep its email, password, phone, reset codes, and tokens outside the repository.
- Never reuse collection credentials or tokens, personal credentials, or data belonging to another user.
- For protected resources, create, read, mutate, and delete only data owned by the dedicated test account. Take a before-state snapshot and clean up test resources when an endpoint supports cleanup.
- Never change IDs to probe another user, bypass authorization, guess admin access, or test a resource that was not created by or returned for the dedicated account.
- Do not call `GET /users` or `GET /orders` unless a normally issued session provides explicit, verifiable admin-role evidence. An undocumented or unexpectedly permissive response is not an invitation to continue testing.
- Do not create a cash order or checkout session until it is clear that the API is safe for synthetic transactions and no real fulfillment or charge can occur. Otherwise mark the decision unresolved and leave that integration conditional.
- Sanitize captured examples before committing them: remove tokens, cookies, reset codes, emails, phones, addresses, user/order IDs, and unnecessary headers. Preserve only the response structure and safe representative values.
- Store approved examples under a future `docs/api/examples/<domain>/` directory. Include method, normalized path, observed status, capture date, and sanitization note beside each example.
- Confirmed facts, provisional observations, and assumptions must remain visibly distinct in `DECISIONS.md`.
- Before writing Next.js code, read the relevant local Next 16 guide under `node_modules/next/dist/docs/`; do not rely on remembered APIs or conventions.
- Do not add response fields, routes, or behavior that are absent from the inventory, verified live evidence, and approved product scope.
- Product controls call `POST /cart` once with only `productId` and add one item. Do not repeat add requests to emulate quantity; quantity belongs to verified cart-line `PUT /cart/{id}` behavior.

## Release 1 — Foundation

### F00 — Documentation and decision baseline

- **Status:** Complete when the revised `TASKS.md` and `DECISIONS.md` are committed.
- **Outcome:** The project has one safe workflow, one decision register, and explicit endpoint coverage.
- **Work:** Review the inventory, PRD, route map, UI specification, and this sequence; record every unresolved API and architecture decision.
- **Verification:** The endpoint matrix contains 33 unique requests; no milestone requires another user’s data or unverified admin access.
- **Commit:** `docs: establish implementation workflow and decision log`
- **Dependencies:** None.

### F01 — Repository conventions and AGENTS.md

- **Status:** Complete; the expanded root `AGENTS.md` was committed in `d026ea5` and satisfies the F01 verification outcome.
- **Outcome:** Future Codex sessions and contributors follow the same small-commit, safety, structure, and verification rules.
- **Work:** Expand `AGENTS.md` with repository layout, documentation precedence, generated/ignored files, naming, command, test, API-safety, and commit conventions. Require milestone-specific reading from the local Next 16 App Router docs, beginning with project structure, layouts/pages, Server and Client Components, data fetching, mutations, error handling, route handlers, authentication, and environment variables.
- **Verification:** A new session can identify the next milestone, permitted files, required local docs, and verification commands without guessing.
- **Commit:** `docs: define repository and agent conventions`
- **Dependencies:** F00.

### F02 — Controlled live-verification procedure

- **Status:** Complete; `docs/API_VERIFICATION.md` and the sanitized 2026-07-31 `GET /categories` evidence satisfy the F02 verification requirements.
- **Outcome:** API observations are repeatable, sanitized, and safe without relying on unavailable external review.
- **Work:** Document the local request procedure, evidence template, redaction checklist, test-account naming, before/after snapshots, cleanup steps, rate limits, and stop conditions. Use Postman, curl, or another already available client; install no application dependency for inspection.
- **Verification:** A dry run against a harmless public GET records method, URL, status, timing, selected safe headers, sanitized body shape, and a `DECISIONS.md` update without storing credentials.
- **Commit:** `docs: add controlled live API verification procedure`
- **Dependencies:** F01.

### F03 — Inspect public taxonomy and brand endpoints

- **Status:** Complete; all seven anonymous taxonomy and brand GETs returned HTTP `200` on 2026-07-31, have sanitized evidence records, and are accounted for in `docs/api/examples/F03_SUMMARY.md`.
- **Outcome:** Seven public GET contracts for categories, subcategories, and brands have sanitized evidence.
- **Work:** Inspect list/detail categories, list/detail subcategories, category subcategories, and list/detail brands. Use IDs returned by their own list endpoints, send no GET body, and record list envelopes, detail shapes, pagination, not-found behavior where safe, and anonymous access status.
- **Verification:** Seven request records exist; every example is sanitized; `API-002`, `API-004`, and relevant query decisions are updated.
- **Commit:** `docs: capture public taxonomy API evidence`
- **Dependencies:** F02.

### F04 — Inspect product list and detail endpoints

- **Status:** Complete; both anonymous product GETs returned HTTP `200` on 2026-07-31, the detail ID matched the first list product `_id`, and both sanitized records are summarized in `docs/api/examples/products/F04_SUMMARY.md`.
- **Outcome:** Base product list/detail shapes and safe identifiers are known.
- **Work:** Inspect `GET /products`, choose a product ID returned by that response, then inspect `GET /products/{id}`. Record status, envelope, fields and types actually observed, pagination, image data, price/totals semantics, and safe not-found behavior without inventing fields.
- **Verification:** Sanitized list/detail evidence exists and product decisions in `DECISIONS.md` reference the captures.
- **Commit:** `docs: capture product API evidence`
- **Dependencies:** F02.

### F04A — Verify public catalog media hosts

- **Status:** Complete; three anonymous, bodyless, no-query reads on `2026-08-08T21:33:34Z` observed only HTTPS media from `ecommerce.routemisr.com` across the documented category, brand, product cover/gallery, and nested product category/brand image roles. No redirect, failed request, invalid JSON, non-HTTPS media, or inconsistent role evidence occurred.
- **Outcome:** C01 has a narrowly evidenced hostname allowlist for public catalog media without retaining complete media URLs or raw responses.
- **Work:** Read only `GET /categories`, `GET /brands`, and `GET /products`; retain only unique media hostname/origin and field-role evidence in `docs/api/examples/F04A_MEDIA_HOSTS.md`. Do not imply that F04A freshly reverified the other six catalog endpoints.
- **Verification:** The three canonical list records and aggregate summary contain no complete media URL/path, catalog identifier, product/customer data, credential, or raw response body; `API-009` and the architecture media boundary approve only HTTPS `ecommerce.routemisr.com` values.
- **Commit:** `docs: verify public catalog media host`
- **Dependencies:** F03, F04.

### F05 — Verify product query behavior

- **Status:** Complete; all nine candidate product query parameters and the four practical combinations have Supported, Unsupported, or documented Unresolved outcomes in `docs/api/examples/products/F05_QUERY_MATRIX.md`.
- **Outcome:** Only working product queries are eligible for UI controls.
- **Work:** Test one query at a time among `limit`, `page`, `keyword`, `sort`, `fields`, `price[gte]`, `price[lte]`, `brand`, and `category[in]`; then test only combinations needed by the approved UI. Record accepted values, invalid behavior, and repeated-category encoding.
- **Verification:** A parameter matrix distinguishes confirmed, unsupported, and unresolved queries; requests contain only collection-listed keys.
- **Commit:** `docs: verify product query contracts`
- **Dependencies:** F04.

### F06 — Create the dedicated test account and verify session acquisition

- **Status:** Complete; on 2026-08-11 a fresh synthetic project-only account was created with `POST /auth/signup` (`201`), correct sign-in and final reacquisition both returned `200` with nonempty top-level tokens, duplicate signup returned `409`, and the one owned-account invalid-password observation returned `401`. Sanitized evidence is recorded in `docs/api/examples/auth/signup.md` and `docs/api/examples/auth/signin.md`; the final token remains only in ignored local storage, and no protected request was made, so `AUTH-002` remains provisional.
- **Outcome:** Signup/sign-in can be tested without personal or collection credentials.
- **Work:** Create a synthetic project-only inbox/account, call signup with fresh values, sign in, record sanitized success/error shapes, and keep the issued token only in a local ignored environment. Record whether user identity or role data accompanies the token.
- **Verification:** The dedicated account remained usable through final sign-in; secret-literal, JWT-pattern, and credential-header scans passed; only the two auth evidence files plus `DECISIONS.md` and `TASKS.md` changed. Token acquisition updates PRD A3 evidence, while PRD A4 remains provisional because F06 intentionally performed no protected probe.
- **Commit:** `docs: verify dedicated test account authentication`
- **Dependencies:** F02.

### F07 — Verify password-recovery contracts

- **Status:** Complete; a fresh dedicated F07 account was created and validated, the controlled reset code was obtained locally, verify-code returned `200`, reset-password returned `200`, and final sign-in with the replacement password returned `200`. Sanitized recovery evidence is recorded in the three auth examples; no reset code, email, password, token, or cookie was committed. Account-enumeration behavior remains unresolved and no invalid/rate-limit probes were performed.
- **Outcome:** Forgot-password, reset-code verification, and password reset have observed transitions and errors.
- **Work:** Use only the dedicated account to exercise the three-step flow. Record delivery behavior, reset-code format/expiry only as observed, proof carried between steps, reset response, rate-limit behavior encountered naturally, and the ability to sign in with the new password.
- **Verification:** Sanitized examples cover forgot-password, reset-code verification, and password reset; the account remains usable after final sign-in; secret scans and diff review pass; no reset code or email is committed. The observed handoff is code-only verification followed by reset with `email` and `newPassword`; no recovery proof field was returned.
- **Commit:** `docs: verify password recovery flow`
- **Dependencies:** F06.

### F08 — Verify profile and password updates

- **Status:** Planned.
- **Outcome:** Update semantics and token behavior are known for the dedicated account.
- **Work:** Snapshot the account, update only its name/email/phone using safe synthetic values, test current/new/confirmation password change, observe whether full bodies or partial updates work, whether tokens rotate, and restore usable test credentials.
- **Verification:** Sanitized success/error evidence exists for both requests; the test account signs in afterward; no claim about session revocation is made without evidence.
- **Commit:** `docs: verify account update contracts`
- **Dependencies:** F06; coordinate with F07 so credentials remain recoverable.

### F09 — Verify wishlist contracts

- **Status:** Planned.
- **Outcome:** Wishlist list/add/remove shapes, duplicate behavior, and delete-ID semantics are known.
- **Work:** Select a product returned by F04, snapshot the dedicated account’s wishlist, add it, list the wishlist, remove only that item, and restore the original state. Record pending-safe mutation behavior and all returned identifier meanings.
- **Verification:** Three sanitized request examples exist; the final wishlist matches the initial snapshot; `WISH-001` is updated.
- **Commit:** `docs: verify wishlist contracts`
- **Dependencies:** F04, F06.

### F10 — Verify cart contracts

- **Status:** Planned.
- **Outcome:** Cart read/add/update/remove/clear behavior is known using only the dedicated account.
- **Work:** Snapshot the cart, add a known product once using only `productId`, inspect the initial line/count behavior, change quantity through `PUT /cart/{id}` with the observed accepted count encoding, remove the created line, and test clear only when the cart contains exclusively test-created lines. Do not repeat POST requests as a quantity mechanism or probe undocumented add-body fields. Record identifiers, bounds, totals, stock errors, and empty shape.
- **Verification:** Five sanitized request examples exist; the add request contains only `productId`; quantity evidence comes from the update request; no pre-existing line is deleted; the final cart is empty or restored to its initial safe state.
- **Commit:** `docs: verify cart contracts`
- **Dependencies:** F04, F06.

### F11 — Verify address contracts

- **Status:** Planned.
- **Outcome:** Address list/detail/add/remove shapes and validation are known without touching another user’s data.
- **Work:** Snapshot the dedicated account’s addresses, add a clearly synthetic address, list and read that returned ID, remove it, and confirm cleanup. Do not test editing because no endpoint exists.
- **Verification:** Four sanitized request examples exist; the created address is removed; `ADDR-001` records observed requiredness and shape.
- **Commit:** `docs: verify address contracts`
- **Dependencies:** F06.

### F12 — Verify checkout and customer-order candidates safely

- **Status:** Conditional.
- **Outcome:** Customer-order endpoints are either safely evidenced or explicitly left unresolved without harmful calls.
- **Work:** First determine whether synthetic order/session creation can avoid real charge or fulfillment. If safe, use only a test-account cart and address to inspect cash order and checkout-session responses. Inspect `GET /orders/user/{id}` only with the dedicated account’s own returned user ID and ordinary authorization. Never substitute another ID. If any safety, identity, or ownership precondition is absent, stop and record the endpoint as conditional.
- **Verification:** Each of the three customer-order candidates has either sanitized own-account evidence or a documented stop reason; no external payment is completed and no other user identifier is requested.
- **Commit:** `docs: record safe checkout and order evidence`
- **Dependencies:** F06, F10, F11; `CHECKOUT-001` safety gate.

### F13 — Review sanitized contracts and release gates

- **Status:** Planned.
- **Outcome:** The completed verification verticals have a final consolidated evidence and release-gate review without delaying unrelated implementation.
- **Work:** After F12 and any enabled O00–O02 work, review all accumulated sanitized examples, update every affected decision, label facts versus observations, remove redundant/personal fields, and identify remaining Ready, Conditional, or Deferred features. Continue updating `DECISIONS.md` after each earlier F milestone; do not wait for F13 to unlock its matching vertical.
- **Verification:** No enabled feature depends on an unresolved response field; all 31 non-admin requests have evidence or an explicit conditional/deferred record; D07, C01, and previously completed verticals did not depend on this final review.
- **Commit:** `docs: consolidate verified API contracts`
- **Dependencies:** F03–F12; O00–O02 only when order history is enabled. This milestone does not gate D07, C01, or an earlier verified feature vertical.

## Release 2 — Design

### D00 — Create the Stitch coverage brief

- **Status:** Artifact present; reopen after material contract or route changes.
- **Outcome:** Stitch generation is constrained by the PRD, route map, verified fields, responsive states, and explicit exclusions.
- **Work:** Map customer routes and required loading/empty/error/success states into a design brief; tag conditional and unsupported capabilities before generation.
- **Verification:** Every designed screen traces to an existing route or is clearly marked reference-only.
- **Commit:** `docs: define Stitch design coverage`
- **Dependencies:** F05 for a new design cycle; existing artifacts may be reviewed against later protected-feature evidence.

### D01 — Generate Google Stitch designs

- **Status:** Artifact present.
- **Outcome:** Desktop/mobile candidates exist for the approved customer experience.
- **Work:** Generate screens using the coverage brief and design system; avoid adding API fields, routes, or admin capabilities that lack evidence.
- **Verification:** Candidate screens cover the brief and visibly distinguish responsive and state variants.
- **Commit:** `design: add Stitch design candidates`
- **Dependencies:** D00.

### D02 — Approve the Stitch visual direction

- **Status:** Artifact present.
- **Outcome:** One visual direction is designated as the implementation source of truth.
- **Work:** Review hierarchy, accessibility risks, cross-screen consistency, unsupported controls, desktop/mobile pairing, and state coverage; record approval and exceptions.
- **Verification:** Approved screenshots are identifiable and rejected alternatives cannot be mistaken for implementation targets.
- **Commit:** `design: approve Stitch screen set`
- **Dependencies:** D01.

### D03 — Export Stitch screenshots and reference code

- **Status:** Complete; filesystem validation on 2026-07-31 found 27 screenshots and 27 HTML exports with 27 matching base filenames and no unmatched files.
- **Outcome:** Project-approved screenshot references and their measurement/reference exports are versioned without adopting generated application architecture.
- **Work:** Export named screenshots and reference HTML/CSS; preserve one-to-one filenames; do not copy generated JavaScript into the app.
- **Verification:** Screenshot and export counts and base names match; pairing does not infer visual approval from exported code, and screenshots remain the primary visual source.
- **Commit:** `design: export approved Stitch references`
- **Dependencies:** D02.

### D04 — Export and localize production assets

- **Status:** Complete — four authorized project-generated static sources were encoded as validated local WebPs, all required responsive browser crops passed on 2026-08-08, and provenance plus final metadata are recorded in `docs/ASSET_MANIFEST.md`.
- **Outcome:** Approved standalone static marketing, decorative, logo, empty-state, and SVG files exist locally without turning API media, code-native interface icons, or unsupported avatars into repository assets.
- **Work:** Maintain `docs/ASSET_MANIFEST.md`, then acquire, name, size, optimize, and license-check only approved standalone static files. Do not copy or localize product, category, brand, cart, wishlist, checkout, or order media; those use verified API response fields in their matching adapters. Do not source profile avatars without a verified field. Interface icons remain future inline SVG React components under `components/icons` and are created only during their matching UI milestone.
- **Verification:** All 69 exported remote references have a classified manifest entry. Every asset marked `Ready` has an existing local approved source, responsive crop, actual dimensions, MIME/format, license/source, and content/decorative classification; no remote Stitch URL, local API-media copy, sample avatar, invented placeholder, or empty asset directory is required. Keep D04 incomplete while a required static role is `Blocked`.
- **Commit:** `design: add approved production assets`
- **Dependencies:** D03, D06; complete before C00.

### D05 — Analyze the approved UI

- **Status:** Complete.
- **Outcome:** Tokens, layout, responsive behavior, reusable components, assets, and inconsistencies are documented.
- **Work:** Treat screenshots as primary, compare exports as reference, and reconcile visible behavior with the PRD and route map.
- **Verification:** All 27 screenshot/export pairs are accounted for and uncertain measurements are labeled.
- **Commit:** `docs: analyze approved Stitch UI`
- **Dependencies:** D03.

### D06 — Create and validate UI_SPEC.md

- **Status:** Complete; `docs/UI_SPEC.md` exists.
- **Outcome:** UI implementation has a screenshot-first component and token specification.
- **Work:** Maintain implementable tokens, component trees, responsive rules, asset requirements, and scope-conflict ledgers.
- **Verification:** Every visible section maps to a reusable component and no unsupported screenshot behavior silently becomes product scope.
- **Commit:** `docs: add screenshot-first UI specification`
- **Dependencies:** D05.

### D07 — Decide application architecture and folder structure

- **Status:** Complete; `docs/ARCHITECTURE.md` defines the root-level App Router structure, maps all 26 approved/conditional routes, and `DECISIONS.md` resolves `ARCH-001` and `ARCH-002`.
- **Outcome:** Route groups, server/client boundaries, API adapters, feature folders, shared UI, validation, session, test, and fixture locations are decision-complete before code moves.
- **Work:** Read the relevant local Next 16 docs and document a concrete folder tree using existing App Router conventions. Keep protected tokens server-confined unless evidence forces a reviewed alternative.
- **Verification:** `DECISIONS.md` resolves `ARCH-001` and `ARCH-002`; every planned route and shared component has one intended home.
- **Commit:** `docs: define application architecture`
- **Dependencies:** F05, D06.

### D08 — Select dependencies

- **Status:** Complete; `docs/DEPENDENCIES.md` records the reviewed runtime and development packages with versions/ranges, compatibility, impact, first use, and rejected alternatives. D08 initially resolved `ARCH-003`, `ARCH-005`, `ARCH-006`, and `ARCH-007`; D09's later audit evidence reopened only `ARCH-006` and `ARCH-007` without invalidating the completed selection milestone. D08A amends `ARCH-007` to approve exact runtime dependency `server-only@0.0.1` for the architecture-required server-only import guard; this amendment is documentation-only, and D09A must install and verify it before D10 resumes.
- **Outcome:** Every proposed package has a concrete need, current compatibility evidence, and a documented alternative.
- **Work:** Audit existing Next/React/Tailwind/TypeScript dependencies; decide runtime validation, forms, testing, and browser-testing packages. Prefer platform/framework capabilities and the smallest dependency set.
- **Verification:** `DECISIONS.md` records package names, versions/ranges, purpose, server/client impact, and rejected alternatives; no package is installed yet.
- **Commit:** `docs: record dependency selections`
- **Dependencies:** D07.

### D09 — Install approved dependencies

- **Status:** Complete; the approved exact upgrade installed `next@16.3.0` and `eslint-config-next@16.3.0`, and the dependency tree shows Next's expected `postcss@8.5.23`, patched transitive `nanoid@3.3.18`, and `sharp@0.35.3`. The standard `npm update nanoid` command changed only the lockfile resolution and left `package.json` unchanged. The production-only audit reports zero vulnerabilities; one development-only high `js-yaml` finding remains explicitly documented. TypeScript, lint, and the network-enabled production build passed. `ARCH-006`/`ARCH-007` are resolved and D10 remains untouched.
- **Outcome:** Only the D08-approved packages are present and the lockfile is reproducible.
- **Work:** Install runtime and development dependencies in separate reviewed commands; do not bundle unrelated code changes.
- **Verification:** Install completes from the lockfile; `npm ls --depth=0`, lint, `npm exec tsc -- --noEmit`, and build pass; the production audit has no high-severity records; any remaining development-only records have an explicit reviewed disposition.
- **Commit:** `build: install approved project dependencies`
- **Dependencies:** D08.

### D09A — Install newly approved server-only dependency

- **Status:** Complete; installed exact runtime dependency `server-only@0.0.1` without changing unrelated direct dependencies. The dependency tree, package manifests, full and production audits, strict TypeScript check, lint, and network-enabled production build passed. Full audit retains only the documented development-only high `js-yaml` finding; production audit reports zero vulnerabilities. D10 remains Planned and unstarted.
- **Outcome:** The architecture-required server-only import guard is available for D10 without adding a direct Nano ID dependency, override, or unrelated package.
- **Verification:** `server-only@0.0.1` is installed under `dependencies`; Next, ESLint config, React, and React DOM remain unchanged; production audit has zero vulnerabilities; TypeScript, lint, and build pass. No test script exists.
- **Commit:** `build: install server-only dependency`
- **Dependencies:** D08A, D09.

### D10 — Configure environments and secret handling

- **Status:** Complete; required server-only environment configuration is validated and documented without adding dependencies or application features.
- **Outcome:** Development, test, preview, and production configuration are explicit and fail safely when missing.
- **Work:** Add `.env.example`, validate `ECOMMERCE_API_BASE_URL` and `APP_ORIGIN` at the server boundary with Zod and `server-only`, document the contract in `docs/ENVIRONMENT.md`, keep test-account credentials out of client bundles, and define the verified API base/return-origin configuration.
- **Verification:** Focused environment validation covers valid values, missing variables, malformed/relative URLs, wrong API host/path, API trailing-slash normalization, origin credentials/path/query/fragment rejection, insecure external HTTP rejection, localhost HTTP acceptance, and safe errors. TypeScript, lint, production build, production audit, `.env.local` ignore behavior, and targeted client-output checks pass. No private environment value appears in client assets.
- **Commit:** `build: configure validated environments`
- **Dependencies:** D07, D09; public API decisions from F03–F05.

## Release 3 — Public catalog

### C00 — Implement design tokens and shared storefront shell

- **Status:** Complete — browser verification passed at 390px, 639px, 768px, 1024px, and 1440px on 2026-08-09 after fixing mobile footer safe-area coverage and applying the 1280px page max-width utility; keyboard menu, navigation semantics, accessibility landmarks/focus behavior, no-overflow, and runtime font-loading checks passed. Vitest (20/20), TypeScript, lint, and production build also passed.
- **Outcome:** The approved typography, colors, spacing, container, header, footer, and responsive shell render once for reuse.
- **Work:** Implement `UI_SPEC.md` tokens and storefront primitives without API data; keep Client Components limited to interactive controls.
- **Verification:** Visual comparison at approved phone/desktop sizes, keyboard navigation, lint, type check, and component tests pass.
- **Commit:** `feat(ui): add storefront design system and shell`
- **Dependencies:** D04, D10.

### C01 — Implement public API transport and adapters

- **Status:** Complete; the nine verified anonymous catalog reads use one server-only transport, Zod response validation, domain adapters, the narrow F04A media allowlist, safe normalized errors, a `10_000` ms timeout, and no retries. Vitest passed 63 tests, TypeScript, lint, and the production build passed on 2026-08-09.
- **Outcome:** Public catalog data crosses one typed server boundary without exposing raw upstream envelopes or unapproved media.
- **Work:** Implemented exact base/path composition, bodyless GET behavior, the F05 product-query allowlist, safe error normalization, operation-specific schemas, domain adapters, and sanitized fixtures for all nine verified public reads. Public reads preserve the existing explicitly uncached policy with `cache: "no-store"`; no remote Stitch URLs or local API-media copies were added.
- **Verification:** Tests cover exact URLs and query serialization, no GET body, success, empty data, malformed payloads, missing/invalid media, not found, redirects, non-2xx, invalid JSON, network/abort/timeout failures, redaction, server-only boundaries, and all nine endpoint paths. Normal tests use mocked fetch and make no live API request.
- **Commit:** `feat(api): add public catalog transport and adapters`
- **Dependencies:** D10, F03–F05, `ARCH-001`, `ARCH-003`.

### C02 — Implement the homepage

- **Status:** Complete; the 2026-08-09 browser gate verified live public catalog data, responsive layouts at 390, 639, 640, 768, 1024, and 1440 pixels, secure Next Image rendering, keyboard/accessibility behavior, and no document-level horizontal overflow.
- **Outcome:** `/` is an explicit responsive storefront using approved sections and verified public data.
- **Work:** Implement static hero/promotion art, API-driven categories/brands/products, benefits, a static `NewsletterPromo`, loading/empty/error states, and route-backed navigation. Preserve newsletter styling and copy without rendering a form, email input, or submit action.
- **Verification:** Homepage tests cover successful and partial API failures, missing media fields, and the absence of newsletter form semantics; visual and keyboard checks match desktop/mobile references; no unsupported route is linked.
- **Commit:** `feat(home): build responsive storefront homepage`
- **Dependencies:** C00, C01.

### C03 — Implement product listing

- **Status:** Complete; the 2026-08-09 browser gate verified live baseline and exact page-2 catalog reads, 2/3/4-column responsive grids at 390, 639, 640, 768, 1024, and 1440 pixels, secure Next Image rendering, breadcrumb/pagination semantics, shell clearance, and no document-level horizontal overflow.
- **Outcome:** `/products` displays the verified product list with loading, empty, error, and ready states.
- **Work:** Add the listing adapter, responsive grid/cards, page heading, basic navigation, and verified pagination only if F05 confirmed it.
- **Verification:** Fixture/route tests cover every state and generated requests use only confirmed query keys.
- **Commit:** `feat(catalog): add product listing`
- **Dependencies:** C00, C01, F04.

### C04 — Implement product detail

- **Status:** Complete; the 2026-08-10 browser gate verified a live five-image product detail, responsive 390/639/640/768/1024/1440 layouts, mobile dot and desktop thumbnail gallery controls, keyboard image selection, secure Next Image media, and a format-valid synthetic upstream not-found response with safe recovery UI.
- **Outcome:** `/products/[productId]` renders only verified product fields and approved media behavior.
- **Work:** Add detail adapter, API-driven gallery, price/content, not-found/error/loading states, and an add-one purchase placeholder for later authenticated work. Mark the screenshot quantity selector deferred; do not render an active product-detail `QuantityStepper` or imply that POST accepts `count`.
- **Verification:** Tests cover valid, missing, malformed, and failed responses; unverified ratings/variants and product-detail quantity controls are absent or clearly deferred.
- **Commit:** `feat(catalog): add product detail`
- **Dependencies:** C00, C01, F04.

### C05 — Implement category directory

- **Status:** Complete; the 2026-08-10 browser gate verified live category data, contained mobile rail behavior, responsive desktop grid behavior, encoded category-detail links, accessible names/focus, secure Next Image media, and intact storefront shell integration at 390/639/640/768/1024/1440px.
- **Outcome:** `/categories` lists verified category data with all standard states.
- **Work:** Add category-list adapter and responsive cards/navigation.
- **Verification:** Route and adapter tests cover success, empty, malformed, and failed responses.
- **Commit:** `feat(catalog): add category directory`
- **Dependencies:** C01, F03.

### C06 — Implement category detail and category subcategories

- **Status:** Complete.
- **Outcome:** `/categories/[categoryId]` composes category detail and scoped subcategories.
- **Work:** Fetch both verified endpoints, handle independent failure/empty states, and link products only if category filter encoding is confirmed.
- **Verification:** Tests cover valid, not-found, empty-subcategory, partial-failure, and filter-link cases. Browser verification confirmed live category identity and category-scoped products, truthful empty-subcategory behavior across all 10 currently rendered categories, synthetic category not-found behavior, and responsive layouts at 390, 639, 640, 768, 1024, and 1440 pixels. No current upstream category exposed a non-empty subcategory collection; non-empty subcategory presentation, semantic links, and encoded future `/subcategories/{id}` href behavior are covered by domain-safe automated tests. This is an upstream data limitation, not a live-link verification claim.
- **Commit:** `feat(catalog): add category detail`
- **Dependencies:** C03, C05, F03, F05 for product filtering.

### C07 — Implement subcategory directory and detail

- **Status:** Complete.
- **Outcome:** `/subcategories` and `/subcategories/[subcategoryId]` render verified data without inventing product association.
- **Work:** Add list/detail adapters and states; include product links only when a verified filter supports them.
- **Verification:** Route tests cover list/detail success, empty, not found, malformed, and failure. Browser verification confirmed the live global empty state at `/subcategories`, responsive and shell behavior at 390, 639, 640, 768, 1024, and 1440 pixels, and synthetic opaque-ID not-found behavior. Current upstream global subcategory data exposed no live ready/detail item; non-empty directory rendering, exactly-once encoded detail links, detail identity, and known error/not-found states are covered by automated tests. No live detail verification is claimed.
- **Commit:** `feat(catalog): add subcategory routes`
- **Dependencies:** C01, F03.

### C08 — Implement brand directory and detail

- **Status:** Complete.
- **Outcome:** `/brands` and `/brands/[brandId]` render verified brand data.
- **Work:** Add list/detail adapters and connect brand product filtering only when F05 confirms serialization.
- **Verification:** Automated tests cover brand ready/empty/error states, exact-once encoded detail and product-filter links, baseline page-two behavior, unsupported query fallback, safe API errors, and not-found handling; GETs send no body. Live browser verification observed the safe unavailable `/brands` state at 390, 639, 640, 768, 1024, and 1440 pixels, with stable shell/footer geometry, mobile navigation through 640, desktop shell from 768, and no document overflow. A synthetic opaque brand ID was classified upstream as unavailable and rendered the safe unavailable detail state. `/products` and `/products?page=2` rendered without environment/runtime errors while the upstream catalog was unavailable. No live brand item was exposed, so live brand count, media, ready directory/detail rendering, live brand links, live `/products?brand=` navigation/results, and live custom not-found behavior are not claimed. Source review verifies the corresponding ready/link/query/not-found branches, server-only C01 access, exact single-scalar `?brand=` handling, and no C09 filter UI.
- **Commit:** `feat(catalog): add brand routes`
- **Dependencies:** C01, F03, F05 for product filtering.

### C09 — Implement verified search, sort, filters, and pagination

- **Status:** Complete.
- **Outcome:** The catalog exposes only controls proven to work and keeps their state in shareable URLs.
- **Work:** Added a finite server-side URL-state parser and exhaustive mapping into the unchanged C01 `ProductQuery` allowlist; added verified sort, price, category, brand, category-plus-sort, category-plus-brand, filter-chip, and responsive filter controls. Search, fields, arbitrary pagination, limit/page-size UI, unsupported combinations, color, sustainability, ratings, and subcategory filtering remain absent.
- **Verification:** `vitest` passed 256 tests across 36 files; TypeScript, lint, and production build passed. Automated coverage includes every supported canonical state, URL-sensitive IDs, repeated ordered categories, malformed/unsupported fallback, option partial failures, clearing/transitions, legal desktop/dialog control transitions, cancel-draft reset, and server-only boundaries. The corrective live browser gate passed at 390, 639, 640, 768, 1024, and 1440 pixels with no overflow: desktop category and brand controls now commit canonical URLs immediately, mobile/tablet selection remains draft-only until Apply and Cancel discards drafts, the sidebar/results columns begin together, and the prior vertical gap is removed. Live Men's Fashion filtering returned 22 matching products before and after hard refresh; live Electronics filtering returned 23 distinct matching products; live brand replacement preserved the selected category in the canonical URL. No browser-direct upstream requests, keyword search, client filtering, or unsupported query behavior were introduced.
- **Commit:** `feat(catalog): add verified catalog controls`
- **Dependencies:** C03, F05.

## Release 4 — Authentication

### A00 — Implement the session boundary

- **Status:** Complete; A00 implemented the server-only AES-GCM session codec, sealed HttpOnly cookie boundary, safe session reads/writes/clears, token-free session summary, provisional protected GET transport, and implemented-route returnTo normalizer. Focused security tests, full validation, public-route regression comparison, and secret scans passed; AUTH-002 remains provisional and no live protected request was made.
- **Outcome:** Tokens, identity, expiry, redirects, and local session clearing follow recorded decisions without leaking to logs or URLs or claiming server-side logout.
- **Work:** Implement the selected server/client session boundary, custom `token` header injection, redaction, invalid-session handling, and local sign-out that clears only the application session. Do not claim token revocation or sign-out from all devices.
- **Verification:** Tests prove protected requests receive the exact header, public requests do not, local sign-out removes application-session access, unsafe return URLs are rejected, and secrets remain server-confined where decided.
- **Commit:** `feat(auth): establish secure session boundary`
- **Dependencies:** D10, F06, `AUTH-006`, `AUTH-007`.

### A01 — Implement the shared auth shell and form primitives

- **Status:** Complete; the approved verification-contract amendment records that A01 owns shared component, accessibility, interaction, responsive-structure, automated-gate, and focused-security verification. Focused component tests, full Vitest, TypeScript, ESLint, production build, unchanged public route classification, diff checks, and secret/scope review passed. A01 owns no reachable route, so its route-level browser gate is **Not Applicable** and no browser pass is claimed. The first mandatory route-level browser verification of the shared shell/primitives belongs to A02 on the real `/sign-up` route at 390, 639, 640, 768, 1024, and 1440 pixels; A03 owns `/sign-in` browser verification against its approved evidence. A02 and A03 remain Planned/unstarted.
- **Outcome:** Auth pages share approved responsive structure, fields, errors, pending states, and accessible announcements.
- **Work:** Build the shared auth route-group layout, auth shell, labeled fields, password reveal, form error/status presentation, submit-pending behavior, and focused component tests. StrengthMeter is deferred while `AUTH-003` remains open. Do not implement the screenshot terms checkbox or Terms/Privacy links without an explicit product/legal requirement and approved destinations. Do not create `/sign-up`, `/sign-in`, aliases, preview/debug routes, fixture routes, actions, API requests, redirects, or session usage.
- **Verification:** Focused component rendering, keyboard interaction, focus/accessibility semantics, field/error associations, validation/error announcement behavior, password visibility, pending-state behavior, responsive structure/style contracts, full automated project gates, and focused diff/security review pass. A01 route-level browser verification is **Not Applicable** because the final A01 tree has no reachable route; this is not a browser pass. No unsupported terms-consent control or placeholder legal link is present.
- **Commit:** `feat(auth): add auth shell and form primitives`
- **Dependencies:** C00, D10, F06.

### A02 — Implement sign-up

- **Status:** Complete.
- **Outcome:** `/sign-up` submits exactly `name`, `email`, `password`, `rePassword`, and `phone`.
- **Work:** Add verified client/server validation, signup adapter, duplicate/error states, session establishment, and safe destination handling. Submit only the five API-backed fields; terms consent remains deferred and is not added to the request.
- **Verification:** Automated checks pass (47 test files, 335 tests, TypeScript, ESLint, production build, and diff check). The adapter serializes exactly the five observed fields, validates only the observed nonempty token, classifies duplicate/rejected/unavailable/invalid responses safely, and never exposes passwords, tokens, or raw upstream bodies. The mandatory browser gate was run manually at 390, 639, 640, 768, 1024, and 1440px on the real route using only a local password-mismatch submission; no `/auth/signup` request was observed. The route has no overflow, exposes the correct responsive copy/link placement, includes phone, and has accessible labels/toggles/focus behavior. No live signup or protected API probe was performed.
- **Commit:** `feat(auth): add sign-up flow`
- **Dependencies:** A00, A01, F06.

### A03 — Implement sign-in

- **Status:** Complete.
- **Outcome:** `/sign-in` establishes a session and continues to a validated destination.
- **Work:** Add sign-in adapter, invalid-credential handling, pending state, and default destination.
- **Verification:** Complete. Final automated gates pass with 51 test files and 347 tests, TypeScript, ESLint, production build, and diff check. The real `/sign-in` route passed the mandatory browser gate at 390, 639, 640, 768, 1024, and 1440px, including responsive shell/copy, field semantics, the single Password label with independent `Forgot Password?` link, counterpart placement, native validation, focus, toggle click behavior, no overflow, and `/sign-up` navigation at 768px. No live sign-in was performed and the browser observed zero `POST /auth/signin` requests; F06 remains the live source for observed 200/401/token evidence. The `/forgot-password` href was verified, but A05 owns its unimplemented route. Pending and server-returned auth/session behavior were intentionally not exercised in the browser and remain covered by deterministic tests. Direct Enter/Space toggle activation was not reliably injectable by the browser driver; native button focus/semantics and deterministic component coverage remain authoritative. A04 remains Planned/unstarted and AUTH-002 remains Provisional.
- **Commit:** `feat(auth): add sign-in flow`
- **Dependencies:** A00, A01, F06.

### A04 — Add protected-route guards and return flow

- **Status:** Complete; amended to infrastructure-only because no A04-owned protected page is reachable yet. `/account/profile` remains owned by A08; wishlist, cart, address, and checkout routes remain owned by later milestones.
- **Outcome:** Establish reusable server-controlled protected-route guard infrastructure and safe return-flow construction for later protected pages.
- **Work:** Add a server-only route guard around `requireSession()` and a standards-based sign-in redirect constructor that delegates to the existing `normalizeReturnTo()` allowlist. The future page supplies its own route-owned canonical destination. Do not create a protected page, route-group guard, proxy/middleware, global session read, protected API request, or speculative auth-entry refactor. Orders navigation remains omitted until O00 passes and O02 implements `/account/orders`.
- **Verification:** PASS. Focused A04/A00/A02/A03 coverage passes (13 files, 83 tests), full Vitest passes (52 files, 359 tests), TypeScript, ESLint, production build, diff check, server-boundary review, and security/scope review pass. The A04 route-level browser gate is **Not Applicable** under this amended contract because no reachable protected route exists; no browser pass is claimed and no live auth or protected API request was made. A05 remains the next planned milestone and AUTH-002 remains Provisional.
- **Commit:** `feat(auth): guard protected customer routes`
- **Dependencies:** A03.

### A05 — Implement forgot password

- **Status:** Complete.
- **Outcome:** `/forgot-password` starts recovery without exposing account existence beyond observed API behavior.
- **Work:** Add the email form, server validation, public adapter, pending state, safe response copy, and navigation back to sign-in. The form does not create a reset-code route or handoff.
- **Verification:** Focused A05 tests pass, together with full Vitest (56 files, 386 tests), TypeScript, ESLint, production build, diff check, server-boundary review, and security/scope review. The adapter sends exactly `{ email }` to the observed endpoint, accepts only the observed 200 schema, maps the observed 404 to the same privacy-preserving confirmation, and maps other failures—including 429—to a generic safe error without exposing upstream content. The mandatory browser gate passed at 390, 639, 640, 768, 1024, and 1440px with no overflow, one accessible email field, native validation, focus/keyboard checks, and working sign-in navigation. No valid live recovery request was submitted; account-enumeration and rate-limit behavior remain unresolved.
- **Commit:** `feat(auth): add forgot password step`
- **Dependencies:** A01, F07.

### A06 — Implement reset-code verification

- **Status:** Complete.
- **Outcome:** `/verify-reset-code` submits the observed reset-code request and presents a safe verification result without inventing code-format rules or client-carried recovery proof.
- **Work:** Add one accessible unconstrained reset-code text input, server validation, adapter, generic failure handling, pending/error/success states, and the route-backed A05 entry link. Do not add resend, countdown, expiry, invalid-code semantics, recovery cookies, URL state, browser storage, application-session proof, or the A07 reset form.
- **Verification:** Tests cover arbitrary nonempty input, missing/non-string/File/blank/whitespace rejection, unchanged forwarding, observed 200 schema, generic handling for all unobserved failures, no raw upstream leakage, single-input accessibility, keyboard/paste/delete behavior, A05 navigation, and direct route access. AUTH-004 remains Provisional; the backend linkage between verification and reset is not resolved by A06 and must be confirmed during A07 planning.
- **Commit:** `feat(auth): add reset code verification`
- **Dependencies:** A05, F07.

### A07 — Implement password reset

- **Status:** Complete.
- **Outcome:** `/reset-password` submits verified email/new-password data after a valid recovery step.
- **Work:** Add guarded reset form, adapter, verified password rules, success handling, and return to sign-in.
- **Verification:** Tests cover valid reset, missing proof, mismatch, backend validation, malformed response, and subsequent sign-in.
- **Commit:** `feat(auth): add password reset`
- **Dependencies:** A06, F07.

### A08 — Implement profile update

- **Status:** Complete.
- **Outcome:** `/account/profile` updates only `name`, `email`, and `phone` from a verified identity source.
- **Work:** Add protected form/adapter and safe reconciliation; omit avatar, country, bio, and other unsupported design fields.
- **Verification:** Tests cover success, full/partial semantics as verified, conflicts, validation, expired auth, and missing initial identity.
- **Commit:** `feat(account): add profile update`
- **Dependencies:** A04, F08, `AUTH-007`.

### A09 — Implement password change

- **Status:** Planned.
- **Outcome:** `/account/security` changes the authenticated test/user password and handles observed token behavior.
- **Work:** Add current/new/confirmation form, adapter, pending state, and session response behavior without promising cross-device logout.
- **Verification:** Tests cover success, wrong current password, mismatch, validation, token rotation if observed, and expired auth.
- **Commit:** `feat(account): add password change`
- **Dependencies:** A04, F08.

## Release 5 — Wishlist and cart

### W01 — Implement wishlist read

- **Status:** Planned.
- **Outcome:** `/wishlist` renders authenticated loading, empty, error, and ready states.
- **Work:** Add wishlist adapter and approved responsive product layout.
- **Verification:** Tests cover anonymous redirect, empty, success, malformed response, network failure, and auth expiry.
- **Commit:** `feat(wishlist): add wishlist page`
- **Dependencies:** A04, C04, F09.

### W02 — Implement wishlist add

- **Status:** Planned.
- **Outcome:** Product list/detail controls add a verified product once with visible pending state.
- **Work:** Add mutation adapter, duplicate behavior, disable repeated clicks, and reconcile from returned/refetched state.
- **Verification:** Tests cover success, duplicate, invalid product, rapid clicks, failure, and auth expiry.
- **Commit:** `feat(wishlist): add product mutation`
- **Dependencies:** W01.

### W03 — Implement wishlist remove

- **Status:** Planned.
- **Outcome:** Wishlist/product controls remove using the verified path identifier.
- **Work:** Add pending removal, rollback/refetch behavior, and safe not-found handling.
- **Verification:** Tests assert exact ID serialization and cover success, failure, idempotent/not-found response, and auth expiry.
- **Commit:** `feat(wishlist): add remove mutation`
- **Dependencies:** W01, `WISH-001` resolved by F09.

### W04 — Implement cart read

- **Status:** Planned.
- **Outcome:** `/cart` renders server-authoritative lines and totals with all standard states.
- **Work:** Add cart adapter, responsive lines, summary, and empty state; omit unverified rewards/tax/shipping promises.
- **Verification:** Tests cover anonymous redirect, empty, success, malformed lines/totals, network failure, and auth expiry.
- **Commit:** `feat(cart): add cart page`
- **Dependencies:** A04, C04, F10.

### W05 — Implement cart add

- **Status:** Planned.
- **Outcome:** Product controls add exactly one item by sending one `POST /cart` request containing only `productId`, with duplicate-submit protection and reconciliation.
- **Work:** Add the one-item mutation adapter, pending feedback, stock/error handling, and cart-count refresh. Disable repeated submission while pending; never issue repeated add requests to emulate a selected quantity.
- **Verification:** Tests assert the exact `{ productId }` body, one request per accepted action, success, invalid product, stock conflict, suppressed rapid clicks, failure, and auth expiry. Product-detail quantity controls remain absent.
- **Commit:** `feat(cart): add product mutation`
- **Dependencies:** W04.

### W06 — Implement cart quantity update

- **Status:** Planned.
- **Outcome:** Cart-line quantity changes use the verified identifier and count encoding; this milestone owns every active `QuantityStepper` in the initial implementation.
- **Work:** Add the bounded stepper to cart lines only, serialize the observed `PUT /cart/{id}` count type, coalesce/disable rapid updates, and reconcile totals.
- **Verification:** Tests cover cart-only rendering, bounds, exact PUT request shape, rapid changes, stock conflict, rollback/refetch, auth expiry, and the absence of repeated POST-based quantity behavior.
- **Commit:** `feat(cart): add quantity updates`
- **Dependencies:** W04, `CART-001` resolved by F10.

### W07 — Implement cart line removal

- **Status:** Planned.
- **Outcome:** A cart line can be removed with safe pending and recovery behavior.
- **Work:** Add exact-ID removal, pending row state, failure recovery, and total reconciliation.
- **Verification:** Tests cover success, not found/idempotency as observed, failure, repeated click, and auth expiry.
- **Commit:** `feat(cart): add line removal`
- **Dependencies:** W04, `CART-001` resolved by F10.

### W08 — Implement clear cart

- **Status:** Planned.
- **Outcome:** Customers can explicitly confirm and clear their own cart.
- **Work:** Add confirmation, pending state, cancel path, clear adapter, and empty-state reconciliation.
- **Verification:** Tests cover cancellation, success, already-empty behavior, failure, repeat submission, and auth expiry.
- **Commit:** `feat(cart): add clear action`
- **Dependencies:** W04.

## Release 6 — Addresses and checkout

### X01 — Implement address list

- **Status:** Planned.
- **Outcome:** `/account/addresses` lists the authenticated customer’s addresses with standard states.
- **Work:** Add address-list adapter and approved cards without edit/default controls.
- **Verification:** Tests cover anonymous redirect, empty, success, malformed response, network failure, and auth expiry.
- **Commit:** `feat(addresses): add address list`
- **Dependencies:** A04, F11.

### X02 — Implement read-only address detail

- **Status:** Planned.
- **Outcome:** `/account/addresses/[addressId]` displays an address owned by the current account.
- **Work:** Add detail adapter, safe route parameter handling, not-found/unauthorized states, and remove navigation where supported.
- **Verification:** Tests cover valid own ID, invalid ID, not found, malformed response, and auth expiry without probing another user.
- **Commit:** `feat(addresses): add address detail`
- **Dependencies:** X01.

### X03 — Implement address add

- **Status:** Planned.
- **Outcome:** `/account/addresses/new` submits exactly `name`, `details`, `phone`, and `city` with verified validation.
- **Work:** Add form/adapter, pending state, error mapping, and list reconciliation.
- **Verification:** Tests cover verified requiredness, backend validation, success, malformed response, repeated submit, and auth expiry.
- **Commit:** `feat(addresses): add address form`
- **Dependencies:** X01, F11.

### X04 — Implement address removal

- **Status:** Planned.
- **Outcome:** Customers can confirm and remove only an address returned for their account.
- **Work:** Add remove confirmation, exact returned ID, pending state, failure recovery, and list reconciliation.
- **Verification:** Tests cover cancellation, success, not found, failure, repeated click, and auth expiry.
- **Commit:** `feat(addresses): add remove action`
- **Dependencies:** X01, F11.

### X05 — Implement checkout preparation

- **Status:** Planned.
- **Outcome:** `/checkout` requires a valid session and non-empty fresh cart, then collects/maps supported shipping fields and payment choice.
- **Work:** Revalidate cart, allow manual or saved address selection using only `details`, `phone`, and `city`, offer Cash or Online, and prevent duplicate submission.
- **Verification:** Tests cover anonymous/missing/stale cart, address mapping, validation, payment choice, auth expiry, and pending behavior.
- **Commit:** `feat(checkout): add checkout preparation`
- **Dependencies:** W08, X03, F12 decisions sufficient for enabled paths.

### X06 — Implement cash checkout

- **Status:** Conditional.
- **Outcome:** A cash order is submitted only when cart-ID and side-effect safety are verified.
- **Work:** Submit the exact verified body/ID, prevent duplicates, handle ambiguous network failures without blind retry, and reconcile cart/order state from returned fields.
- **Verification:** Tests cover success fixture, stock/price change, validation, duplicate prevention, ambiguity, malformed response, and auth expiry; no live production order is created during routine tests.
- **Commit:** `feat(checkout): add cash order flow`
- **Dependencies:** X05, F12, `CHECKOUT-002` resolved.

### X07 — Implement online checkout-session creation

- **Status:** Conditional.
- **Outcome:** A verified safe session URL is created and redirected without open-redirect behavior.
- **Work:** Submit the exact cart/address/return URL, validate the response field and destination allowlist, prevent duplicates, and leave payment outcome unknown.
- **Verification:** Tests cover valid session, rejected return URL, unsafe destination, missing redirect field, network ambiguity, repeated submit, and auth expiry.
- **Commit:** `feat(checkout): add online session flow`
- **Dependencies:** X05, F12, `CHECKOUT-001` and `CHECKOUT-003` sufficiently resolved.

### X08 — Implement neutral online return

- **Status:** Planned after X07.
- **Outcome:** `/checkout/online/return` reconciles supported server state without declaring success from query parameters.
- **Work:** Show neutral loading/result copy, refresh cart and conditional own-order data, and provide retry/shop/order-history navigation only when supported.
- **Verification:** Tests cover provider return/cancel parameters as untrusted input, missing status API, unchanged cart, changed cart, failure, and repeated visits.
- **Commit:** `feat(checkout): add neutral payment return`
- **Dependencies:** X07; O01 only if order history becomes enabled.

## Release 7 — Orders

### O00 — Evaluate the own-account order-history gate

- **Status:** Conditional.
- **Outcome:** The project records whether order history has sufficient authentication, identity, and ownership evidence without cross-user testing.
- **Work:** Review F06/F12 evidence for a trustworthy current-user ID source and own-ID request behavior. Do not request another user ID. If ownership enforcement cannot be established from normal evidence, leave `/account/orders` deferred.
- **Verification:** `ORDER-001` records the evidence, limitation, and Ready/Deferred result.
- **Commit:** `docs: decide customer order history gate`
- **Dependencies:** F12, A00.

### O01 — Implement the order-history adapter

- **Status:** Conditional on O00 Ready.
- **Outcome:** Own-account order history is validated without an order-detail lookup.
- **Work:** Implement exact own-user request construction, runtime validation, safe fields, and loading/empty/error/unauthorized states.
- **Verification:** Adapter tests use sanitized own-account fixtures and reject missing/mismatched identity locally; no test sends another user ID.
- **Commit:** `feat(orders): add customer order adapter`
- **Dependencies:** O00 Ready.

### O02 — Implement the order-history page

- **Status:** Conditional on O01.
- **Outcome:** `/account/orders` shows verified order-history fields and no unsupported tracking/detail actions.
- **Work:** Build the approved list layout, status/total/date fields only when present, and recovery states. Do not invent `/account/orders/[orderId]`.
- **Verification:** Route, responsive, accessibility, loading, empty, success, failure, and unauthorized tests pass.
- **Commit:** `feat(orders): add customer order history`
- **Dependencies:** O01, C00.

## Release 8 — Conditional admin

### ADM00 — Evaluate admin role evidence

- **Status:** Conditional.
- **Outcome:** Admin work is either explicitly authorized by a normally issued role/session or remains deferred.
- **Work:** Review ordinary authentication evidence for a documented role and authorized test account. Do not call admin candidates merely to discover whether data leaks. A customer account is not treated as admin.
- **Verification:** `ADMIN-001` records either verified role evidence and a safe account or the decision to keep both routes absent.
- **Commit:** `docs: decide conditional admin scope`
- **Dependencies:** F06, `AUTH-007`.

### ADM01 — Implement read-only users directory

- **Status:** Deferred unless ADM00 passes.
- **Outcome:** `/admin/users` is role-guarded and renders only approved non-sensitive fields.
- **Work:** Verify the authorized request with the designated account, add adapter/page, omit credential/reset/token material, and keep navigation invisible to non-admins.
- **Verification:** Authorized fixtures and anonymous/customer route tests pass without exposing sensitive data.
- **Commit:** `feat(admin): add read-only users directory`
- **Dependencies:** ADM00 Ready; verified `GET /users` contract.

### ADM02 — Implement read-only all-orders directory

- **Status:** Deferred unless ADM00 passes.
- **Outcome:** `/admin/orders` is role-guarded and renders only approved fields.
- **Work:** Verify the authorized request, add adapter/page, redact customer data from logs/analytics, and add no admin mutation.
- **Verification:** Authorized fixtures and anonymous/customer route tests pass; privacy review approves rendered fields.
- **Commit:** `feat(admin): add read-only orders directory`
- **Dependencies:** ADM00 Ready; verified `GET /orders` contract.

## Release 9 — Testing and deployment

### T00 — Run contract and adapter regression

- **Status:** Planned.
- **Outcome:** Every enabled endpoint adapter accepts sanitized known-good shapes and fails safely on malformed inputs.
- **Work:** Consolidate contract fixtures, serializer cases, redaction cases, and conditional-feature exclusions.
- **Verification:** Unit/contract suite passes and reports coverage for every enabled request.
- **Commit:** `test: complete API contract regression`
- **Dependencies:** All enabled feature milestones.

### T01 — Run customer-flow integration tests

- **Status:** Planned.
- **Outcome:** Catalog, auth, wishlist, cart, address, checkout, and enabled orders work across route boundaries.
- **Work:** Add fixture-backed integration tests for happy paths, recoverable failures, expired sessions, and duplicate-submission protection.
- **Verification:** The integration suite is deterministic and uses no live credentials.
- **Commit:** `test: add customer flow regression`
- **Dependencies:** T00.

### T02 — Complete accessibility QA

- **Status:** Planned.
- **Outcome:** Primary routes meet keyboard, focus, labeling, announcement, contrast, and reduced-motion requirements.
- **Work:** Run automated checks and manual keyboard/screen-reader smoke tests against all primary states.
- **Verification:** No critical/serious automated findings remain and manual results are recorded.
- **Commit:** `fix(a11y): complete accessibility review`
- **Dependencies:** T01.

### T03 — Complete responsive and visual QA

- **Status:** Planned.
- **Outcome:** Approved desktop/mobile screens and inferred tablet behavior are stable without overflow or hidden actions.
- **Work:** Compare primary routes with Stitch references, test intermediate widths, sticky bars, bottom sheets, images, loading/error/empty states, and safe areas.
- **Verification:** Visual snapshots/manual checklist pass at agreed phone, tablet, desktop, and wide sizes.
- **Commit:** `fix(ui): complete responsive visual review`
- **Dependencies:** T01, D04.

### T04 — Complete privacy and security review

- **Status:** Planned.
- **Outcome:** Credentials and customer data remain absent from URLs, logs, analytics, client bundles, fixtures, and error reports.
- **Work:** Review session storage, redirects, headers, CSP/security headers, redaction, dependency risks, admin absence/guards, and payment return behavior.
- **Verification:** Secret scans, client-bundle inspection, authorization tests, unsafe-redirect tests, and redaction tests pass.
- **Commit:** `fix(security): complete privacy and security review`
- **Dependencies:** T01, all enabled conditional features.

### T05 — Complete performance and metadata

- **Status:** Planned.
- **Outcome:** Images, fonts, route metadata, loading behavior, caching, and bundle sizes meet documented budgets.
- **Work:** Apply verified caching strategy, optimize local assets, add route metadata, measure key pages, and remove unused client code/dependencies.
- **Verification:** Production build passes and agreed performance/bundle budgets are recorded and met.
- **Commit:** `perf: finalize metadata and performance`
- **Dependencies:** T03, T04.

### T06 — Validate preview deployment and environment configuration

- **Status:** Planned.
- **Outcome:** Preview deployment uses separate validated configuration and safe third-party API behavior.
- **Work:** Configure preview variables, build/deploy, test direct links/refreshes, inspect headers/log redaction, and run smoke tests without production credentials.
- **Verification:** Preview build and customer smoke suite pass; no private variable appears client-side.
- **Commit:** `build: validate preview deployment`
- **Dependencies:** T02–T05.

### T07 — Release and rollback readiness

- **Status:** Planned.
- **Outcome:** Production release has an explicit go/no-go checklist, smoke test, monitoring boundary, and rollback procedure.
- **Work:** Confirm enabled/conditional/deferred features, production variables, API host, migrations if any, monitoring redaction, rollback version, and post-deploy smoke steps.
- **Verification:** Build/lint/type/test suites pass; production smoke test covers only safe customer flows; rollback procedure is rehearsed or documented.
- **Commit:** `docs: finalize release and rollback checklist`
- **Dependencies:** T06.

## Complete 33-request coverage matrix

The request names and endpoint spellings below are preserved from `API_INVENTORY.md`. Live verification never changes product scope by itself; evidence updates `DECISIONS.md` and unlocks only the mapped implementation milestone.

| # | Request | Method and normalized path | Live-verification milestone | Implementation milestone | Current gate |
|---:|---|---|---|---|---|
| 1 | Get All Categories | `GET /categories` | F03 | C05, C02 | Verified anonymous public read; F03 evidence |
| 2 | Get specific category | `GET /categories/{id}` | F03 | C06 | Verified anonymous public read with list-derived ID; F03 evidence |
| 3 | Get All SubCategories | `GET /subcategories` | F03 | C07 | Verified anonymous public read; F03 evidence |
| 4 | Get specific SubCategory | `GET /subcategories/{id}` | F03 | C07 | Verified anonymous public read with list-derived ID; F03 evidence |
| 5 | Get All SubCategories On Category | `GET /categories/{id}/subcategories` | F03 | C06 | Verified anonymous public read with category-list-derived ID; F03 evidence |
| 6 | Get All Brands | `GET /brands` | F03 | C08, C02 | Verified anonymous public read; F03 evidence |
| 7 | Get specific brand | `GET /brands/{id}` | F03 | C08 | Verified anonymous public read with list-derived ID; F03 evidence |
| 8 | Get All Products | `GET /products` | F04, F05 | C03, C02, C09 | Verified anonymous base read and classified query behavior; F04/F05 evidence |
| 9 | Get specific Product | `GET /products/{id}` | F04 | C04 | Verified anonymous read with list-derived ID; F04 evidence |
| 10 | Signup | `POST /auth/signup` | F06 | A02 | Dedicated test account required |
| 11 | signin | `POST /auth/signin` | F06 | A03 | Dedicated test account required |
| 12 | Forgot Password | `POST /auth/forgotPasswords` | F07 | A05 | Dedicated inbox/account required |
| 13 | Verify Reset Code | `POST /auth/verifyResetCode` | F07 | A06 | Dedicated inbox/account required |
| 14 | Update Logged user password | `PUT /users/changeMyPassword` | F08 | A09 | Dedicated test account/token required |
| 15 | Reset Password | `PUT /auth/resetPassword` | F07 | A07 | Verified own recovery flow required |
| 16 | Update Logged user data | `PUT /users/updateMe` | F08 | A08 | Dedicated test account/token required |
| 17 | Get All Users | `GET /users` | ADM00 | ADM01 | Deferred pending explicit admin role evidence |
| 18 | Add product to wishlist | `POST /wishlist` | F09 | W02 | Dedicated test account/token required |
| 19 | Remove product from wishlist | `DELETE /wishlist/{id}` | F09 | W03 | Own test-created wishlist item only |
| 20 | Get logged user wishlist | `GET /wishlist` | F09 | W01 | Dedicated test account/token required |
| 21 | Add address | `POST /addresses` | F11 | X03 | Synthetic own address only |
| 22 | Remove address | `DELETE /addresses/{id}` | F11 | X04 | Own test-created address only |
| 23 | Get specific address | `GET /addresses/{id}` | F11 | X02 | Own returned address ID only |
| 24 | Get logged user addresses | `GET /addresses` | F11 | X01 | Dedicated test account/token required |
| 25 | Add Product To Cart | `POST /cart` | F10 | W05 | Dedicated test account/token required |
| 26 | Update cart product quantity | `PUT /cart/{id}` | F10 | W06 | Own returned cart identifier only |
| 27 | Get Logged user cart | `GET /cart` | F10 | W04 | Dedicated test account/token required |
| 28 | Remove specific cart Item | `DELETE /cart/{id}` | F10 | W07 | Own returned cart identifier only |
| 29 | Clear user cart | `DELETE /cart` | F10 | W08 | Clear only test-created/known-safe cart state |
| 30 | Create Cash Order | `POST /orders/{id}` | F12 | X06 | Conditional on non-production side-effect safety |
| 31 | getAllOrders | `GET /orders` | ADM00 | ADM02 | Deferred pending explicit admin role evidence |
| 32 | getUserOrders | `GET /orders/user/{id}` | F12, O00 | O01, O02 | Own user ID only; conditional ownership gate |
| 33 | Checkout session | `POST /orders/checkout-session/{id}` | F12 | X07, X08 | Conditional on safe session/redirect evidence |
