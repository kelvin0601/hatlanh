# AN VỊ — Mobile-First Design Specification

> Version 1.1 · Companion to `design.md` · Primary design viewport: **390 × 844 CSS px**. Validate 320, 360, 375, 390, 414, 430 px and tablets.  
> Design direction: **Modern Organic × Cinematic Commerce × Mindful Living**. Mobile is the **source of truth**, desktop is progressive enhancement.

## 1. Non-negotiable mobile principles

1. **Readable by default:** body **16px minimum**, long-form body **17px preferred**, supporting labels **14px minimum**. No 11–12px eyebrow labels, fine print or tiny price labels. Text must remain usable at 200% browser zoom.
2. **Buy without scrolling through the story:** cart always accessible from header; primary product CTA in hero; featured products appear by section 4.
3. **Media never competes with copy:** dedicated mobile video crop/poster; use a **stacked hero** (copy first, cinematic media second) rather than tiny white text on a busy video.
4. **One clear focus per screen:** avoid cramped 4-column ingredient/product grids, floating decorative labels and simultaneous animations.
5. **No scroll-controlled video:** videos autoplay muted when visible, pause offscreen; provide still poster and reduced-motion fallback.
6. **Ground every claim:** use real ingredients, products, prices, certifications and reviews only after verification.

## 2. Mobile type scale (CSS px)

| Role | 320–359px | 360–430px | Line height | Weight / notes |
|---|---:|---:|---:|---|
| Hero H1 | 38 | 44–48 | 1.12 | Lora 500; 3–5 short lines |
| Section H2 | 30 | 34–36 | 1.18 | Lora 500 |
| H3 | 24 | 26 | 1.25 | Lora 500 |
| Product/card title | 17 | 18 | 1.35 | Be Vietnam Pro 600 |
| Lead paragraph | 17 | 18 | 1.65 | Be Vietnam Pro 400 |
| Body / story | 16 | 17 | 1.65 | Be Vietnam Pro 400 |
| Button / nav / input | 16 | 16 | 1.4 | Be Vietnam Pro 600 / 500 |
| Price | 18 | 20 | 1.3 | Be Vietnam Pro 700 |
| Secondary / caption / eyebrow | 14 | 14 | 1.5 | Be Vietnam Pro 500; no forced tracking that harms Vietnamese accents |

- No visible text below **14px**, including badges, product weights, consent and footer links. Prefer 16px for interactive text.
- Headings use `text-wrap: balance` where supported; body uses normal wrapping; no forced uppercase on long Vietnamese phrases.
- Body copy width should not exceed ~38 characters per line on mobile when a narrower editorial column is possible.
- Use `rem` and user font scaling, never lock text size with transforms or fixed-height text boxes.

## 3. Spacing and layout tokens

| Token / component | 320–359px | 360–430px |
|---|---:|---:|
| Page horizontal gutter | 16px | 20px |
| Header height | 64px | 68px |
| Section vertical padding | 56px | 72px |
| Large storytelling section padding | 72px | 88px |
| Stack gap | 16px | 20px |
| Heading → paragraph | 12px | 16px |
| Paragraph → CTA | 24px | 28px |
| Card internal padding | 16px | 16–20px |
| Grid gap | 12px | 16px |
| Button height | 52px | 52px |
| Input height | 52px | 52px |
| Touch target minimum | 44×44px | 44×44px |
| Image/card radius | 14px | 16px |

- One-column editorial layout; only **two columns** for short ingredient tiles at 360px+.
- Product cards should be **one per row** at 320–359px; at 360–430px prefer a **1.15-card horizontal carousel** with snap, or one-column cards. Use 2 columns only if names, price, weight and CTA stay comfortably legible.
- Avoid full-viewport height for content-heavy sections. Use `min-height` rather than fixed height; allow copy to grow.
- Respect `env(safe-area-inset-bottom)` for fixed actions and iPhone home indicator.

## 4. Mobile homepage wireframe (top → bottom)

```text
┌────────────────────────────────┐
│  LOGO               CART  MENU │  sticky 68px
├────────────────────────────────┤
│  NGŨ CỐC THIÊN NHIÊN          │
│  Từ muôn hạt thiên nhiên,      │
│  đến những ngày an nhiên.      │  H1 44–48px
│                                │
│  2–3 lines brand introduction  │  17px
│  [ Khám phá sản phẩm      → ]  │  full-width CTA
│  Câu chuyện An Vị       ↗   │  text link
│                                │
│ ┌────────────────────────────┐ │
│ │                            │ │
│ │  CINEMATIC VIDEO / POSTER  │ │  4:5 or 5:6 crop
│ │  mixed grains + bowl       │ │  autoplay, muted
│ │                            │ │
│ └────────────────────────────┘ │
├────────────────────────────────┤
│  MUÔN HẠT, MỘT SỰ HÀI HÒA     │
│  Intro + ingredient tiles      │
│  [oats] [beans]               │
│  [seeds][other]               │
├────────────────────────────────┤
│  CHUYỆN TỪ QUÊ NHÀ            │
│  Wide 4:5 story video / image  │
│  H2 + 2–3 short lines + link   │
├────────────────────────────────┤
│  NGŨ CỐC AN VỊ             │
│  [ PRODUCT CARD → ]            │
│  [ swipe next → ]              │
│  All products link             │
├────────────────────────────────┤
│  MỘT CHÚT AN YÊN              │
│  Calm breakfast video / image  │
│  H2 + short reflection + CTA   │
├────────────────────────────────┤
│  ĐIỀU AN VỊ TRÂN TRỌNG     │
│  3 simple stacked values       │
├────────────────────────────────┤
│  GÓC SỐNG LÀNH                │
│  2 article cards               │
├────────────────────────────────┤
│  NEWSLETTER                   │
│  Label + email + button        │
├────────────────────────────────┤
│  FOOTER                       │
│  Accordion navigation          │
│  Support / policy / contact    │
└────────────────────────────────┘
```

### Section-specific rules

**Header:** logo 120–144px wide; cart and menu icons each 44×44px; no desktop nav squeezed onto mobile. Drawer opens from right or bottom, focus trapped, dismissible, background scroll locked.

**Hero:** prioritize text **above** media so copy is never covered by flying grains. Background cream; H1 dark forest. Video 4:5 or 5:6 crop, object-position tuned to keep bowl and multiple ingredient types visible. Keep first CTA above video on 390px devices when practical, without squeezing copy. Video has no baked-in text or controls. On narrow screens, avoid forced `100svh` hero.

**Ingredients:** two-column image tiles with ingredient name at 16px, optional verified description 14px. On 320px, retain two columns only if no text truncation; otherwise one column.

**Story:** video/image first, then editorial heading and short story; no overlaid long copy. Link to full brand story.

**Products:** show actual packshot, product name, net weight, price, full-width `Thêm vào giỏ` button; carousel may use swipe but also visible previous/next controls. No hover-only actions. Avoid fake ratings.

**Mindful moment:** quiet 4:5 video or still; 1 headline, 1 short paragraph, 1 CTA. No distracting particles or autoplay audio.

**Values:** 3 stacked rows with icon (24px), title (17px), explanation (16px). Do not publish unverified health/preservation claims.

**Journal:** two vertically stacked cards with readable 17px titles and 14px metadata.

**Footer:** accordion groups with 48px row height; newsletter email field 16px to avoid iOS focus zoom; privacy/consent links 14px minimum.

## 5. Mobile video and performance

- Prepare **separate mobile source and poster**: recommended master composition **1080×1350 (4:5)** or **1080×1296 (5:6)**; actual encoded resolution/bitrate should be reduced for mobile delivery.
- Hero poster loads immediately; video starts only when allowed and appropriate. Use `muted`, `playsInline`, `loop`; `preload="none"` for below-the-fold videos.
- Pause out-of-view videos and never play multiple decorative videos at once when avoidable.
- Under `prefers-reduced-motion: reduce`, display poster instead of autoplay. Respect data-saver preferences where possible.
- Keep core text, buttons and shopping functionality fully available before video loads or if playback fails.
- Use AVIF/WebP posters, responsive image sizes, reserve media dimensions to prevent layout shift.

## 6. Accessibility and conversion checklist

- [ ] Body ≥16px, captions ≥14px, product price ≥18px, input/button labels ≥16px.
- [ ] Tap targets ≥44×44px with ≥8px separation when practical.
- [ ] Primary CTA and cart accessible immediately; no full-screen cinematic intro blocking purchase.
- [ ] Product name, weight, price and add-to-cart visible without hover.
- [ ] Contrast tested over all media frames; preferably text on solid cream surfaces.
- [ ] No horizontal overflow at 320px, 360px, 390px, 430px or 200% zoom.
- [ ] Menu, carousel, cart and checkout keyboard/screen-reader operable.
- [ ] `prefers-reduced-motion` and low-bandwidth fallbacks tested on real phones.
- [ ] Mobile checkout inputs are 16px+, with appropriate keyboard types.

## 7. Mobile-first CSS starter

```css
:root {
  --mobile-gutter: 20px;
  --mobile-section-space: 72px;
  --mobile-header-height: 68px;
  --font-body-mobile: 17px;
  --font-caption-mobile: 14px;
  --font-price-mobile: 20px;
}

html { font-size: 100%; }
body { font-size: var(--font-body-mobile); line-height: 1.65; }
.site-header { min-height: var(--mobile-header-height); }
.page-container { width: calc(100% - 2 * var(--mobile-gutter)); margin-inline: auto; }
.section { padding-block: var(--mobile-section-space); }
.hero { display: grid; gap: 32px; }
.hero__title { font-size: clamp(38px, 11.3vw, 48px); line-height: 1.12; letter-spacing: -0.025em; }
.section__title { font-size: clamp(30px, 8.5vw, 36px); line-height: 1.18; }
.hero__media { aspect-ratio: 4 / 5; overflow: hidden; border-radius: 16px; }
.hero__media video, .hero__media img { width: 100%; height: 100%; object-fit: cover; }
.button { min-height: 52px; font-size: 16px; padding: 12px 24px; }
.caption, .eyebrow, .metadata { font-size: 14px; line-height: 1.5; }
.product__title { font-size: 18px; line-height: 1.35; }
.product__price { font-size: var(--font-price-mobile); font-weight: 700; }
.product-list { display: grid; grid-auto-flow: column; grid-auto-columns: minmax(0, 86%); overflow-x: auto; gap: 16px; scroll-snap-type: x mandatory; }
.product-list > * { scroll-snap-align: start; }
input, select, textarea { font-size: 16px; min-height: 52px; }

@media (max-width: 359px) {
  :root { --mobile-gutter: 16px; --mobile-section-space: 56px; --font-body-mobile: 16px; }
  .product-list { grid-auto-columns: 94%; }
}
@media (min-width: 768px) {
  :root { --mobile-section-space: 96px; }
  .hero { grid-template-columns: 1fr 1.15fr; align-items: center; }
  .hero__media { aspect-ratio: 5 / 4; }
  .product-list { grid-auto-flow: row; grid-template-columns: repeat(3, minmax(0, 1fr)); overflow: visible; }
}
@media (min-width: 1024px) {
  .product-list { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}
```

## 8. Handoff rule

**Always implement the mobile layout first at 390px, verify 320px, then scale up at 768px and 1024px.** If any older value in `design.md` makes mobile text smaller than the minima above, **this mobile specification takes precedence**.
