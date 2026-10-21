# Hạt Lành — Patterns & Conventions

## 1. Component Patterns

### Server vs Client Split

Mặc định Server Component. Chỉ `"use client"` khi cần interactivity (event handlers, hooks, browser APIs).

| Server Components | Client Components |
|---|---|
| Pages, section components, `ProductCard` | `Header`, `Footer`, `ShopProvider`, `CartDrawer` |
| `ProductsSection`, `JournalSection` | `AddToCartButton`, `AdminShell`, `OrderManager` |
| Admin pages (fetch data, pass props) | Checkout, order tracking, contact form |

**Data handoff pattern:** Server page fetches → passes `initialX` props → Client component manages local state.

```
Server Page (fetch data) → <ClientComponent initialData={data} />
```

### Naming

- Components: **PascalCase** files and exports — `ProductCard.tsx`, `AdminShell.tsx`
- Routes: **kebab-case** directories, Vietnamese URL slugs — `san-pham`, `goc-song-lanh`
- Lib files: **kebab-case** — `admin-store.ts`, `request-security.ts`

### File Organization

```
components/
  layout/       — Header, Footer (site-wide shell)
  sections/     — Homepage sections (HeroSection, ProductsSection, ...)
  commerce/     — Cart, checkout, product cards
  admin/        — Admin panel components
  ui/           — Reusable primitives (ButtonLink)
```

## 2. Data Flow

### Public Read Path

```
Neon DB → admin-store.ts (Drizzle + "use cache") → Server Component → HTML/props
```

All public reads cached with `cacheTag("hat-lanh-store")` + `cacheLife("max")`.

### Admin Read Path

```
DB → readAdminStore(permission) → requireAdminSession() check → Server Page → Client Component
```

### Mutation Path

```
Client fetch("/api/...") → API route validates → admin-store CRUD function → Drizzle query → invalidateStore() → cache busted
```

`invalidateStore()` calls `revalidateTag("hat-lanh-store", { expire: 0 })` + `revalidatePath()` for specific routes.

### Cart (Client-only)

- `ShopProvider` uses `useSyncExternalStore` with `localStorage` backing (`"hat-lanh-cart-v1"`).
- Last order saved to `sessionStorage` (`"hat-lanh-last-order-v1"`).
- Manual pub/sub: `cartListeners` Set, `subscribeToCart()`, `updateCart()`.

### Type Mapping

Drizzle row types → app domain types via explicit mappers in `admin-store.ts`:

- `toProduct()` — Drizzle row → `Product` interface
- `toArticle()` — Drizzle row → `Article` interface
- `toOrder()` — Drizzle row + order_items → `Order` interface (reconstructs nested `customer` object)

## 3. API Route Patterns

### Validation Pipeline (every API route)

```
1. verifyJsonRequest(request, maxBytes)   — Content-Type + Content-Length
2. verifySameOrigin(request)              — Origin header check
3. takeRateLimit(key, limit, windowMs)    — In-memory sliding window
4. request.json() in try/catch            — Parse body
5. Field-level validation                 — Specific constraints
6. Business logic call                    — Store functions
7. noStoreJson(data, { status })          — Cache-Control: no-store
```

### Rate Limits

| Endpoint | Limit | Window |
|---|---|---|
| Orders (per IP) | 12 | 10 min |
| Orders (per customer) | 5 | 30 min |
| Contact | 5 | 15 min |
| Admin login | 5 | 15 min |
| Order lookup | 10 | 10 min |

Keys hashed with SHA-256 via `anonymizeRateLimitKey()`.

### Admin API Auth

```
authorizeAdminRequest(request, permission?, requireCsrf?)
→ { ok: true, session } | { ok: false, response }
```

- Write endpoints always pass `requireCsrf: true`.
- CSRF: `X-CSRF-Token` header must match `session.csrfToken`.
- All CRUD through single `/api/admin/data` with `resource` discriminator.

### Error Responses

Vietnamese messages. Status codes: 400 (parse), 401 (auth), 403 (origin/permission), 409 (idempotency), 413 (size), 415 (content-type), 422 (validation), 429 (rate limit), 502/503 (external/internal).

## 4. Styling Patterns

### Design Tokens (`globals.css`)

```
Colors: ink (#213728), forest (#25452f), sage (#798b6c), cream (#f8f4ea),
        paper (#fffcf6), sand (#ede4d5), wheat (#c69a62), body (#4d564b),
        muted (#697366), border (#dcd8ca), error (#a23d35)
Fonts:  --font-display (Lora), --font-body (Be Vietnam Pro)
Radii:  sm (8px), md (14px), lg (24px), pill (999px)
```

### CSS Custom Properties

```css
--container-max: 1320px
--page-gutter: clamp(20px, 4vw, 64px)
--section-space: clamp(64px, 9vw, 144px)
--header-height: 80px (desktop) / 68px (mobile)
```

### Container Pattern

```tsx
style={{ width: "min(calc(100% - 2 * var(--page-gutter)), var(--container-max))" }}
```

Applied inline on wrapper divs — not a utility class.

### Section Header Pattern

```tsx
<p className="text-sage text-[12px] font-semibold uppercase tracking-[0.14em] mb-3">Label</p>
<h2 className="text-ink leading-[...] tracking-[-0.025em] font-medium"
    style={{ fontFamily: "var(--font-display)", fontSize: "clamp(...)" }}>Title</h2>
```

### Responsive

Mobile-first. Tailwind `md:` and `lg:` breakpoints. `clamp()` for fluid typography/spacing. `clsx()` for conditional classes.

### Admin Styling Isolation

```css
body:has(.admin-root) [data-site-header] { display: none }
body:has(.admin-root) [data-site-footer] { display: none }
```

## 5. Security Patterns

### CSRF

- Token: `HMAC-SHA256("csrf:" + sessionToken, secret)`.
- Sent to client via `AdminShell` prop → React context.
- Client sends as `X-CSRF-Token` header on all mutations.

### Password Security

- **KDF:** Scrypt (N=32768, r=8, p=1, 64-byte output).
- **Storage:** `scrypt$32768$salt$hash`.
- **Comparison:** Timing-safe via `timingSafeEqual` on SHA-256 digests.
- **Strength:** 12+ chars, uppercase + lowercase + digit + special char.
- **Legacy migration:** Old 3-part hashes re-hashed at higher cost on successful login.

### Session Tokens

- 32 random bytes, base64url-encoded.
- Stored as HMAC hash in DB. 8-hour TTL.
- Cookie: `__Host-hat_lanh_session` (production) / `hat_lanh_session` (dev).
- HttpOnly, SameSite=Strict, Secure (production).

### Content Security Policy

Set in `next.config.ts`: `default-src 'self'`, no external scripts/connections, `frame-ancestors 'none'`, HSTS in production.

### Idempotency

Orders use client-generated UUID. Server checks for existing order with same key; if customer/total differs → 409 conflict.

## 6. Caching Patterns

### `"use cache"` Directive

All public read functions in `admin-store.ts`:

```ts
async function getStoreProducts() {
  "use cache";
  cacheLife("max");
  cacheTag("hat-lanh-store");
  // ... Drizzle query
}
```

### Invalidation

- Mutations → `revalidateTag("hat-lanh-store", { expire: 0 })`.
- Route-specific: `revalidatePath("/san-pham")`, `revalidatePath("/goc-song-lanh")`.

### API Responses

`noStoreJson()` → `Cache-Control: no-store, max-age=0` + `Pragma: no-cache`.

## 7. Commerce Patterns

### Checkout Flow

```
1. Client form + idempotency key (crypto.randomUUID())
2. POST /api/orders → validate → resolve cart vs DB catalog → calculate totals
3. reserveOrder() — idempotent insert
4. sendOrderEmails() via Resend
5. Client: save to sessionStorage → clear cart → redirect /dat-hang-thanh-cong
```

### Order ID Format

`HL{YYMMDD}-{6 hex uppercase}` — ví dụ `HL261021-A3B4C5`

### Pricing

- All prices in VND as integers.
- Free shipping: ≥ 300,000₫. Shipping fee: 20,000₫.
- Format: `Intl.NumberFormat("vi-VN")` + `₫`.

### Payment

- `cod` — thanh toán khi nhận hàng.
- `bank` — chuyển khoản (manual follow-up).

## 8. Admin Patterns

### Auth Flow

```
Bootstrap: first login with env vars → creates owner account
Login:     POST /api/admin/session → set HttpOnly cookie → redirect
Session:   requireAdminSession(permission?) → redirect if invalid
Logout:    DELETE /api/admin/session (CSRF required) → clear cookie
```

### RBAC

| Role | catalog:write | content:write | orders:read | orders:write | staff:manage |
|---|---|---|---|---|---|
| owner | ✓ | ✓ | ✓ | ✓ | ✓ |
| admin | ✓ | ✓ | ✓ | ✓ | |
| editor | ✓ | ✓ | | | |
| fulfillment | | | ✓ | ✓ | |

### Admin CRUD Pattern

Single endpoint `/api/admin/data` — `resource` field discriminates `products`/`articles`/`orders`.

```
GET    — read all (filtered by role permissions)
POST   — create product or article
PATCH  — update product, article, or order status
DELETE — delete product or article
```

## 9. SEO Patterns

- Every page: `metadata` or `generateMetadata()`. Title: `"Page | Hạt Lành — Ngũ cốc thiên nhiên"`.
- OpenGraph + Twitter Card on all pages.
- Product/article pages: JSON-LD structured data (`Product`/`Article` schema).
- `generateStaticParams()` for product + article detail pages.
- Dynamic `sitemap.ts` queries DB. `robots.ts` allows all crawlers.
- Semantic HTML: `<article>`, `<section>`, `<nav>`, `<main>`, `<aside>` + ARIA attributes.
- Single `<h1>` per page. Correct heading hierarchy (h1 → h2 → h3).

## 10. Database Patterns

### Stack

Drizzle ORM + `@neondatabase/serverless` (HTTP driver) + Neon PostgreSQL.

### Schema

6 tables: `products`, `articles`, `orders`, `order_items`, `admin_users`, `admin_sessions` + 5 pgEnums.

### Connection

Single stateless `db` instance via neon-http driver. No connection pool management needed.

### Migrations

`drizzle-kit push` for schema sync. Config uses `DIRECT_DATABASE_URL` (non-pooled).

### NPM Scripts

```
npm run db:push      — push schema to database
npm run db:generate  — generate migration files
npm run db:studio    — Drizzle Studio UI
npm run db:seed      — seed initial data
```
