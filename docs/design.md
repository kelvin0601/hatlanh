# HẠT LÀNH — Website Design System

> Version: 1.0 · Status: Proposed design baseline · Scope: responsive e-commerce website, starting with Homepage  
> Design direction: **Modern Organic × Cinematic Commerce × Mindful Living**  
> Brand line: **Gieo hạt lành, dưỡng thân tâm.**
> **Mobile-first companion:** [`design-mobile.md`](./design-mobile.md). Design at 390px first, validate 320px, then enhance for tablet/desktop. Its mobile typography and layout requirements take precedence where they differ.

## 1. Product and experience principles

Hạt Lành sells **natural mixed-grain cereals**, not only rice. The brand is inspired by Vietnamese countryside, gratitude, calm and care, expressed inclusively without religious iconography or claims of spiritual/medical treatment.

1. **Commerce first, storytelling throughout.** Shopping must remain accessible at any scroll position via header navigation/cart and clear product CTAs.
2. **Calm, not empty.** Use generous negative space and concise copy; maintain useful product details.
3. **Nature without nostalgia overload.** Contemporary editorial compositions, genuine ingredient imagery, subtle rustic textures.
4. **Video as atmosphere.** Autoplay muted loops; scroll changes sections, **not video playback progress**.
5. **Truthful by design.** Ingredient names, benefits, provenance, reviews, prices, certifications, and preservative claims require verification before publication.

### Visual reference

- **Approved hero image (art direction):** `a_wide_cinematic_ultra_detailed_food_photography.png` (wide image of mixed grains falling into a ceramic bowl against sunlit countryside; no baked-in text).
- **Layout reference:** `a_tall_elegant_modern_organic_e_commerce_landing.png` (hero → ingredients → brand story → products → mindful moment → trust → editorial → footer).
- Treat generated imagery as **concept artwork**, not proof of actual ingredients, suppliers, packaging, reviews, or product attributes.

## 2. Brand colors

| Token | HEX | Usage |
|---|---|---|
| `--color-ink` | `#213728` | Main headings, dark text |
| `--color-forest` | `#25452F` | Primary buttons, dark surfaces |
| `--color-forest-hover` | `#183522` | Primary button hover |
| `--color-sage` | `#798B6C` | Decorative accents, secondary brand tone |
| `--color-cream` | `#F8F4EA` | Primary page background |
| `--color-paper` | `#FFFCF6` | Cards and elevated panels |
| `--color-sand` | `#EDE4D5` | Alternate section background |
| `--color-wheat` | `#C69A62` | Small warm highlights |
| `--color-body` | `#4D564B` | Body text |
| `--color-muted` | `#697366` | Secondary text (verify contrast per usage) |
| `--color-border` | `#DCD8CA` | Dividers and borders |
| `--color-error` | `#A23D35` | Validation errors |
| `--color-white` | `#FFFFFF` | Text on dark surfaces |

**Usage:** roughly 65% cream/paper, 20% photography, 10% forest/sage, 5% warm accents. Avoid large blocks of saturated green and orange. Never rely on color alone to convey status.

## 3. Typography

- **Display/headings:** `Lora`, serif; Vietnamese glyph coverage required; fallback `Georgia, serif`.
- **UI/body:** `Be Vietnam Pro`, sans-serif; fallback `Arial, sans-serif`.
- Use only **two font families**. Avoid script fonts for body copy; if used decoratively, use sparingly in artwork only.
- **Weights:** display 400/500; headings 500/600; body 400/500; UI/buttons 500/600.

| Role | Desktop | Mobile | Line-height | Letter spacing |
|---|---|---|---|---|
| Hero H1 | `clamp(3.5rem, 5.6vw, 6rem)` | `clamp(2.375rem, 11.3vw, 3rem)` | 1.08 | -0.035em |
| Section H2 | `clamp(2.5rem, 4vw, 4.25rem)` | `clamp(1.875rem, 8.5vw, 2.25rem)` | 1.13 | -0.025em |
| H3 | `1.75rem` | `1.375rem` | 1.25 | -0.015em |
| H4 / card title | `1.125rem` | `1.125rem` | 1.35 | -0.01em |
| Lead paragraph | `1.125rem` | `1.125rem` | 1.7 | 0 |
| Body | `1rem` | `1.0625rem` (16px at ≤359px) | 1.65 | 0 |
| Small | `0.875rem` | `0.875rem` (minimum) | 1.5 | 0 |
| Eyebrow | `0.75rem` | `0.875rem` | 1.4 | 0.14em uppercase |
| Price | `1.125rem` | `1.25rem` | 1.3 | 0 |

For Vietnamese uppercase eyebrow labels, verify accents remain readable. Prefer sentence case for paragraphs and navigation. Keep body line lengths around **55–70 characters**, story paragraphs max-width **42rem**.

## 4. Spacing, grid and layout

**Base unit:** 4px. Use the following spacing scale consistently:

`4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 120, 160px`.

| Element | Desktop | Tablet | Mobile |
|---|---|---|---|
| Max content width | `1320px` | fluid | fluid |
| Page gutter | `clamp(24px, 4vw, 64px)` | `32px` | `20px` (16px on very small screens) |
| Section vertical padding | `112–160px` | `80–112px` | `64–88px` |
| Grid | 12 columns | 8 columns | 4 columns |
| Grid gap | `24px` | `20px` | `16px` |
| Header height | `80px` | `72px` | `64px` |
| Hero min-height | `min(820px, 90svh)` | `75svh` | `min(760px, 85svh)` |
| Text-to-CTA spacing | `32px` | `24px` | `24px` |

**Breakpoints (CSS min-width):** `640px` small tablet; `768px` tablet; `1024px` desktop; `1280px` wide desktop; `1536px` extra-wide. Start mobile-first. Avoid horizontal overflow.

### Composition rules

- Alternate cinematic edge-to-edge sections with quieter cream editorial sections.
- On desktop, hero copy occupies ~40–45% of width and media focal point ~55–60%; ensure video has a safe text zone.
- Asymmetry is encouraged for editorial/story sections, but maintain a consistent alignment grid.
- Use large photos/videos selectively; avoid making every section full-screen.
- Avoid repeated decorative waves at every section boundary. Use whitespace or occasional soft image masks instead.

## 5. Shape, surfaces and elevation

| Token | Value | Use |
|---|---|---|
| `--radius-sm` | `8px` | Chips, compact inputs |
| `--radius-md` | `14px` | Product images, cards |
| `--radius-lg` | `24px` | Editorial media blocks |
| `--radius-pill` | `999px` | Buttons and badges |
| `--shadow-soft` | `0 12px 36px rgba(33,55,40,.08)` | Hover elevation only |

Prefer **thin borders and negative space** over heavy card shadows. Organic curves can appear in photography masks, not every component.

## 6. Components

### Header

- Desktop: logo left; links `Trang chủ / Sản phẩm / Câu chuyện / Góc sống lành / Liên hệ`; search and cart; optional prominent `Mua ngay` button.
- Sticky after initial scroll; cream translucent surface with readable text and subtle border. Never obscure video text.
- Mobile: logo, cart, menu. Drawer includes product categories and customer support.
- Header and cart must remain functional independent of videos.

### Buttons

- **Primary:** forest background, white text, 48–52px height desktop, min 48px mobile; 20–28px horizontal padding; pill radius.
- **Secondary:** transparent or paper background, 1px forest border, forest text.
- **Text link:** underlined or arrow affordance, visible focus state.
- Hover: subtle color/arrow movement (150–220ms), no dramatic scaling.
- Minimum interactive target **44×44px**; visible keyboard focus ring.

### Product cards

- Clean paper background; media aspect ratio **4:5** or **1:1** consistently within a grid.
- Product name (max 2 lines), short verified descriptor, **price in VND**, net weight, optional verified rating, and clear `Thêm vào giỏ` action.
- Desktop grid: 4 cards; tablet 2–3; mobile **1 or 1.15-card horizontal carousel by default**; use 2 only when all labels, price and CTA remain legible.
- Hover: small image zoom (`scale(1.025)`) and soft elevation; never hide essential information behind hover.
- Product imagery must be consistent in crop, lighting and packaging accuracy.
- Display ingredients/allergens and full nutritional information on product detail pages, not overloaded cards.

### Ingredient showcase

- Grid of distinct grain/bean/seed macro photos on light backgrounds; use **actual recipe ingredients only**.
- Each item: image, ingredient name, optional factual one-line description.
- Hover movement minimal. Do not imply all ingredients originate from the same field or farmer.

### Forms

- Inputs 48–52px height; radius 12px or pill for newsletter; always visible label and error/help states.
- Newsletter opt-in must be explicit; no prechecked marketing consent.

## 7. Homepage information architecture

| Order | Section | Visual pattern | Goal | Motion |
|---|---|---|---|---|
| 01 | **Hero — Từ muôn hạt thiên nhiên, đến những ngày an nhiên** | Full-bleed cinematic media, left-aligned text overlay, primary shop CTA | Brand + immediate shopping entry | Muted autoplay loop |
| 02 | **Muôn hạt, một sự hài hòa** | Airy ingredient grid / editorial collage on cream | Show multi-ingredient reality | Lightweight fade/reveal |
| 03 | **Chuyện từ quê nhà** | Wide countryside documentary image/video + concise story | Emotional brand connection | Autoplay on viewport, optional |
| 04 | **Ngũ cốc Hạt Lành** | Product grid with prices, weights, cart buttons | Conversion | Static photos + hover |
| 05 | **Một chút an yên** | Large lifestyle breakfast media + short reflection | Mindful-living identity | Autoplay on viewport, optional |
| 06 | **Điều Hạt Lành trân trọng** | 3–4 concise trust pillars | Confidence | Static icons |
| 07 | **Góc sống lành** | 2–3 editorial articles / recipes | Education + SEO | Gentle reveal |
| 08 | **Newsletter + Footer** | Dark forest banner and functional footer | Retention + support | Minimal |

**Optional:** customer reviews only when genuine and authorized. Do not add invented testimonials, star counts, prices, or provenance.

### Hero content layout

- Desktop: text within left **35–45%**, media focus right; use a gradient overlay on text area for reliable contrast.
- Mobile: use a **stacked layout with HTML copy above a separate mobile crop/poster** by default. Keep text off the moving grains; see `design-mobile.md`.
- Hero headline is HTML, **never embedded in AI video**.
- CTAs: `Khám phá sản phẩm` (primary), `Câu chuyện Hạt Lành` (secondary).
- Do not place unverified `100% tự nhiên`, `không chất bảo quản`, or health claims in trust strips.

## 8. Video / motion system

### Video policy

- **Autoplay, muted, playsInline, loop** for decorative videos; user scrolling does **not** scrub playback.
- Recommended maximum **3 video locations**: hero (priority), brand story, mindful breakfast. All other sections primarily static.
- Hero clip target **6–10 seconds**; secondary loops **5–8 seconds**, with seamless or unobtrusive transitions.
- Use optimized MP4/H.264 as broad compatibility baseline; WebM alternative when supported; export appropriate desktop/mobile renditions.
- Include `poster` for every video. Lazy-load non-hero video and pause it when outside viewport using `IntersectionObserver`.
- Respect `prefers-reduced-motion`: show still poster / avoid autoplay when reduction requested.
- Never autoplay sound; if editorial video needs audio, make it user-initiated with explicit controls.
- Do not put navigation, prices, or essential copy into video pixels.
- Keep visual continuity in warmth, lighting, material, ingredient shapes and pace across AI clips.

### Motion tokens

| Motion | Duration | Easing |
|---|---|---|
| Micro-interaction | `160ms` | `ease-out` |
| Card hover | `220ms` | `cubic-bezier(.2,.8,.2,1)` |
| Scroll reveal | `450–700ms` | `cubic-bezier(.2,.8,.2,1)` |
| Overlay/drawer | `240–320ms` | `ease-in-out` |

Use scroll-triggered reveals **sparingly**; no forced scroll-jacking, aggressive parallax or delayed access to products. Prefer transform/opacity animations. For reduced motion, remove nonessential animations.

## 9. Imagery and AI generation art direction

**Keywords:** cinematic food photography, Vietnamese countryside, mixed grains, handmade ceramic, linen, warm sunrise, authentic textures, soft haze, shallow depth of field, premium organic editorial.

**Hero:** wide 16:9 or 21:9, several distinct grain types falling into a bowl on the **right**, spacious calmer **left** for HTML overlay, subtle rural background. No baked-in text, logos, icons, fake packaging or UI.

**Product photography:** consistent clean studio background, actual product packshots; separate lifestyle imagery from commerce images.

**Brand story:** documentary-style agricultural imagery; do not imply AI-created people are actual suppliers. Replace illustrative material with verified photography as the brand develops.

**Avoid:** giant single rice stalk as sole brand symbol, plastic-looking grains, impossible food anatomy, excessive flying particles over text, spiritual iconography, over-saturated neon, fabricated badges/certifications.

## 10. Accessibility, performance and SEO

- Target **WCAG 2.2 AA**: text contrast ≥4.5:1 for regular text, ≥3:1 for large text/UI where applicable. Check contrast on top of changing video frames; use fixed overlays when needed.
- Semantic heading order (`h1` once), alt text for informative images, empty alt for decorative images; decorative video `aria-hidden`.
- Keyboard-accessible menus, drawers, gallery controls, cart and checkout; clear focus and validation states.
- Maintain readable type at 320px; avoid text smaller than 14px for meaningful UI, and require 16–17px mobile body and 16px inputs; no visible text below 14px. See `design-mobile.md`.
- Prioritize hero **poster** and font loading. Avoid large video blocking LCP; monitor real-device Core Web Vitals (LCP, INP, CLS).
- Reserve media aspect ratios to avoid layout shifts; responsive `srcset`, lazy-load below-the-fold images, and preload only critical assets.
- Use structured product data only when real product fields are available; indexable HTML copy for all key brand/product text.

## 11. CSS tokens (starter)

```css
:root {
  --color-ink: #213728;
  --color-forest: #25452f;
  --color-forest-hover: #183522;
  --color-sage: #798b6c;
  --color-cream: #f8f4ea;
  --color-paper: #fffcf6;
  --color-sand: #ede4d5;
  --color-wheat: #c69a62;
  --color-body: #4d564b;
  --color-muted: #697366;
  --color-border: #dcd8ca;
  --color-error: #a23d35;
  --color-white: #fff;

  --font-display: 'Lora', Georgia, serif;
  --font-body: 'Be Vietnam Pro', Arial, sans-serif;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;
  --space-30: 120px;
  --space-40: 160px;

  --container-max: 1320px;
  --page-gutter: clamp(20px, 4vw, 64px);
  --section-space: clamp(64px, 9vw, 144px);
  --header-height: 80px;
  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 24px;
  --radius-pill: 999px;
  --shadow-soft: 0 12px 36px rgba(33, 55, 40, 0.08);
  --ease-organic: cubic-bezier(.2, .8, .2, 1);
}

@media (max-width: 767px) {
  :root {
    --page-gutter: 20px;
    --header-height: 68px;
    --section-space: 72px;
  }
}

body {
  background: var(--color-cream);
  color: var(--color-body);
  font-family: var(--font-body);
}

h1, h2, h3, h4 {
  color: var(--color-ink);
  font-family: var(--font-display);
}

.container {
  width: min(calc(100% - 2 * var(--page-gutter)), var(--container-max));
  margin-inline: auto;
}

.section { padding-block: var(--section-space); }

:focus-visible {
  outline: 3px solid var(--color-wheat);
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 12. Implementation checklist

- [ ] Load Vietnamese-supporting font files with `font-display: swap`.
- [ ] Apply tokens to header, hero, sections, product cards and footer.
- [ ] Test hero desktop/mobile crops and headline contrast over **every** video frame.
- [ ] Build poster fallback and reduced-motion experience before shipping videos.
- [ ] Validate real product ingredient lists, allergens, weight, pricing, origin, and claims.
- [ ] Test keyboard navigation, mobile cart, product CTA, checkout and form errors.
- [ ] Optimize videos on slow mobile networks and measure Core Web Vitals.
- [ ] Replace placeholder testimonials, badges and packaging with real assets/data.

---

**Decision log:** Initial release focuses **only on mixed-grain cereals**. Brand story conveys naturalness, gratitude, care and calm **implicitly**, accessible to customers of any faith or none. AI video is **autoplay**, not scroll-controlled. Website must remain usable and shoppable without video playback.
