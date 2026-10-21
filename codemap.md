# An Vị — Codemap

## Root Config

| File | Purpose |
|---|---|
| `package.json` | Next.js 16, React 19, Drizzle ORM, @neondatabase/serverless, clsx, lucide-react |
| `tsconfig.json` | TS strict, `@/*` → `./src/*`, bundler moduleResolution |
| `next.config.ts` | CSP headers, SEO redirects, `cacheComponents`, `partialPrefetching`, turbopack |
| `drizzle.config.ts` | Schema at `./src/lib/schema.ts`, output `./drizzle/`, uses `DIRECT_DATABASE_URL` |
| `eslint.config.mjs` | ESLint 9 flat config + eslint-config-next |
| `.env.example` | Template: DATABASE_URL, DIRECT_DATABASE_URL, RESEND_API_KEY, ADMIN_* vars |
| `.github/workflows/ci.yml` | Lint → type-check → build on PR; db push on main merge |
| `scripts/seed.ts` | Seeds products + articles into Neon PostgreSQL |

---

## `src/lib/` — Core Libraries

| File | Key Exports | Description |
|---|---|---|
| `db.ts` | `db` | Drizzle ORM instance via neon-http driver |
| `schema.ts` | `products`, `articles`, `orders`, `orderItems`, `adminUsers`, `adminSessions` + 5 enums | Drizzle PostgreSQL schema, 6 tables |
| `admin-store.ts` | `readStore`, `getStoreProducts`, `getStoreArticles`, `getStoreProductBySlug`, `getStoreArticleBySlug`, `findOrderForCustomer`, `reserveOrder`, `updateOrderEmailStatus`, `createProduct`, `updateProduct`, `deleteProduct`, `createArticle`, `updateArticle`, `deleteArticle`, `updateOrderStatus`, `productSlugExists`, `articleSlugExists`; type `StoreData` | Central data access layer — all Drizzle queries, `"use cache"` + `cacheTag` |
| `admin-auth-store.ts` | `loginAdmin`, `findAdminSession`, `logoutAdmin`, `listAdminUsers`, `createAdminUser`, `updateAdminUser`, `hashAdminPassword`, `isStrongAdminPassword`, `isAdminAuthConfigured`; type `AdminUserDto` | Admin auth: scrypt passwords, HMAC session tokens, bootstrap owner |
| `admin-auth.ts` | `getAdminCookieName`, `getAdminSession`, `requireAdminSession`, `authorizeAdminRequest`, `isAdminConfigured` | Server-only: cookie sessions, permission redirects, CSRF checks |
| `admin-permissions.ts` | `AdminRole`, `AdminPermission`, `ADMIN_ROLE_LABELS`, `isAdminRole`, `hasPermission` | RBAC: 4 roles, 5 permissions |
| `commerce.ts` | `resolveCart`, `calculateOrder`, `getPaymentLabel`, `getPaymentStatusLabel`; types `CartLine`, `CheckoutCustomer`, `PaymentMethod`, `PaymentStatus`, `OrderStatus`, `OrderItem`, `Order`, `OrderTrackingDto` | Commerce logic and type definitions |
| `products.ts` | `Product` (type), `products` (seed array), `getProductBySlug`, `formatPrice` | Product type + hardcoded seed (used for `generateStaticParams`) |
| `articles.ts` | `Article` (type), `articles` (seed array), `getArticleBySlug` | Article type + hardcoded seed |
| `policies.ts` | `Policy` (type), `policies` (array), `getPolicyBySlug` | Static policy pages (shipping, returns, etc.) |
| `email.ts` | `sendOrderEmails`, `sendContactEmail` | Resend API: order confirmation + admin notification + contact emails |
| `request-security.ts` | `getClientAddress`, `anonymizeRateLimitKey`, `takeRateLimit`, `verifyJsonRequest`, `verifySameOrigin`, `noStoreJson` | Rate limiting, origin checks, JSON size guards |

### Dependency Graph

```
admin-store.ts → db.ts → schema.ts
admin-store.ts → admin-auth.ts → admin-auth-store.ts → db.ts
commerce.ts → products.ts
email.ts → commerce.ts, products.ts
```

---

## `src/app/` — Routes

### Public Pages

| Route | File | Rendering | Description |
|---|---|---|---|
| `/` | `page.tsx` | Static (SSG) | Homepage: Hero, Ingredients, Products, Story, Mindful, Values, Journal, Testimonials, Newsletter |
| `/san-pham` | `san-pham/page.tsx` | Static + cache | Product listing, `getStoreProducts()` |
| `/san-pham/[slug]` | `san-pham/[slug]/page.tsx` | SSG + PPR | Product detail, JSON-LD, related products |
| `/goc-song-lanh` | `goc-song-lanh/page.tsx` | Static + cache | Blog listing, `getStoreArticles()` |
| `/goc-song-lanh/[slug]` | `goc-song-lanh/[slug]/page.tsx` | SSG + PPR | Article detail, JSON-LD |
| `/cau-chuyen` | `cau-chuyen/page.tsx` | Static | Brand story |
| `/tu-nong-trai` | `tu-nong-trai/page.tsx` | Static | Farm origin |
| `/lien-he` | `lien-he/page.tsx` | Client | Contact form → `/api/contact` |
| `/chinh-sach/[slug]` | `chinh-sach/[slug]/page.tsx` | SSG | Policy pages from `policies.ts` |
| `/gio-hang` | `gio-hang/page.tsx` | Client | Shopping cart (ShopProvider context) |
| `/thanh-toan` | `thanh-toan/page.tsx` | Client | Checkout form → `/api/orders` |
| `/tra-cuu-don-hang` | `tra-cuu-don-hang/page.tsx` | Client | Order lookup → `/api/orders/lookup` |
| `/dat-hang-thanh-cong` | `dat-hang-thanh-cong/page.tsx` | Static shell | Order success (reads sessionStorage) |

### Admin Pages

| Route | File | Description |
|---|---|---|
| `/admin/login` | `admin/login/page.tsx` | Login form → `AdminLoginForm` |
| `/admin` | `admin/(secure)/page.tsx` | Dashboard: stats (products, orders, articles, revenue) |
| `/admin/san-pham` | `admin/(secure)/san-pham/page.tsx` | Product CRUD → `ProductManager` |
| `/admin/bai-viet` | `admin/(secure)/bai-viet/page.tsx` | Article CRUD → `ArticleManager` |
| `/admin/don-hang` | `admin/(secure)/don-hang/page.tsx` | Order management → `OrderManager` |
| `/admin/nhan-su` | `admin/(secure)/nhan-su/page.tsx` | Staff management → `UserManager` |

Layout: `admin/(secure)/layout.tsx` wraps with `AdminShell`, calls `requireAdminSession()`.

### API Routes

| Endpoint | Methods | Description |
|---|---|---|
| `/api/orders` | POST | Create order (idempotency, rate limiting, email) |
| `/api/orders/lookup` | POST | Customer order lookup (ID + phone) |
| `/api/contact` | POST | Contact form → email via Resend |
| `/api/admin/data` | GET, POST, PATCH, DELETE | Admin CRUD for products/articles/orders |
| `/api/admin/session` | POST, DELETE | Admin login + logout |
| `/api/admin/users` | GET, POST, PATCH | List/create/update admin users |

### SEO & Meta

| File | Description |
|---|---|
| `layout.tsx` | Root: metadata, fonts (Lora + Be Vietnam Pro), `ShopProvider`, Header/Footer |
| `robots.ts` | Allows all crawlers, sitemap at `/sitemap.xml` |
| `sitemap.ts` | Dynamic — queries DB for products + articles slugs |
| `globals.css` | Tailwind + design tokens (colors, fonts, radii, spacing) |

---

## `src/components/` — UI Components

### `layout/`

| File | Client | Description |
|---|---|---|
| `Header.tsx` | Yes | Sticky header: logo, nav, cart badge, mobile menu |
| `Footer.tsx` | Yes | Footer: nav columns, newsletter CTA, copyright |

### `sections/` — Homepage

| File | Client | Description |
|---|---|---|
| `HeroSection.tsx` | Yes | Hero with video background, CTA buttons |
| `IngredientsSection.tsx` | No | Ingredient cards grid |
| `ProductsSection.tsx` | No (async) | Product cards, `getStoreProducts()` |
| `StorySection.tsx` | No | Brand story with images |
| `MindfulSection.tsx` | No | Mindful eating philosophy |
| `ValuesSection.tsx` | No | Brand values grid |
| `JournalSection.tsx` | No (async) | Recent articles, `getStoreArticles()` |
| `TestimonialsSection.tsx` | No | Customer testimonials |
| `NewsletterSection.tsx` | Yes | Email signup form |

### `commerce/`

| File | Client | Description |
|---|---|---|
| `ShopProvider.tsx` | Yes | Cart context (localStorage), `useShop()` hook, `readLastOrder()` |
| `ProductCard.tsx` | No | Product card (image, name, price, add-to-cart) |
| `AddToCartButton.tsx` | Yes | Add to cart with quantity selector |
| `CartDrawer.tsx` | Yes | Slide-over cart drawer |
| `OrderSuccessContent.tsx` | Yes | Reads last order from sessionStorage |

### `admin/`

| File | Client | Description |
|---|---|---|
| `AdminShell.tsx` | Yes | Admin layout: sidebar nav, `useAdminSession()` context |
| `AdminLoginForm.tsx` | Yes | Login form → `/api/admin/session` |
| `ProductManager.tsx` | Yes | Product CRUD table + form |
| `ArticleManager.tsx` | Yes | Article CRUD table + form |
| `OrderManager.tsx` | Yes | Order list with status/payment filters |
| `UserManager.tsx` | Yes | Staff list with create/edit/toggle |

### `ui/`

| File | Client | Description |
|---|---|---|
| `ButtonLink.tsx` | No | Polymorphic button/link with variants |

---

## `public/` — Static Assets

| Directory | Contents |
|---|---|
| `images/01_hero/` | Hero banners: desktop, detail, mobile |
| `images/02_ingredients/` | 8 ingredient photos (almonds, cashews, chia, oats, ...) |
| `images/03_story/` | Farm/story images (farmer, fields, village, banner) |
| `images/04_products/` | Product photos (4 variants HD), cereal bowls, packaging |
| `images/05_lifestyle/` | Lifestyle photos (breakfast, meditation, morning, reading) |
| `images/07_blog/` | Blog thumbnails (cooking, knowledge, recipe, story) |
| `images/08_backgrounds/` | Textures (cream, fields, paper, sage) |
| `images/09_icons/` | SVG icons (arrow, cart, heart, leaf, menu, package, search, shield) |
| `images/10_decor/` | Decorative (leaf, nuts) |
| `videos/` | `hero.mp4` — hero background video |
