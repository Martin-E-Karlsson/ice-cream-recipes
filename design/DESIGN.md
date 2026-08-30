# Ninja Creami Recipe Site — Design Document

**Direction:** Creamery Counter · **Author:** Martin Karlsson · **Course:** Webbutveckling, Labb 1

This document is the single source of truth for visual decisions. If the CSS and this
document disagree, one of them is wrong — fix it, don't work around it.

---

## 1. Brand

A **fan-made community recipe site** for Ninja Creami owners. It is not an official
SharkNinja property and must never present itself as one.

- Site name: *(TBD — pick something that is clearly yours, e.g. "Spin Cycle", "The Pint Club", "Creami Counter")*
- **There is no shop.** Dropped 27 Aug — it earned no grade points and carried the
  trademark risk. See §13.
- Tone: warm, practical, a friend who owns the machine. Not corporate, not cutesy.
- Language: English throughout.

---

## 2. Colour

All values below were checked against WCAG 2.1. Ratios are text-on-background.

### Light theme

| Token | Value | Use | Contrast |
|---|---|---|---|
| `--color-bg` | `#FFFDF9` | Page background (cream paper) | — |
| `--color-surface` | `#FFFFFF` | Cards, form fields | — |
| `--color-surface-alt` | `#F6EFE4` | Banded sections, table stripes | — |
| `--color-text` | `#2A2321` | Body and headings | **15.19:1** on bg (AAA) |
| `--color-text-muted` | `#5F5049` | Meta text, captions, credits | **7.57:1** on bg (AAA) |
| `--color-accent` | `#9C4718` | Links, primary buttons, active nav | **6.21:1** on bg (AA) |
| `--color-accent-soft` | `#F3E2D6` | Accent-tinted backgrounds | — |
| `--color-on-accent` | `#FFFFFF` | Text on an accent-filled button | **6.31:1** on accent (AA) |
| `--color-secondary` | `#4F6B36` | Pistachio **text**, category labels | **5.92:1** on bg (AA) |
| `--color-secondary-soft` | `#DDE8CE` | Category chip backgrounds | text on it **12.13:1** (AAA) |
| `--color-border` | `#E4DACC` | Hairlines, card edges | decorative only |

### Dark theme

| Token | Value | Use | Contrast |
|---|---|---|---|
| `--color-bg` | `#1C1714` | Page background (warm near-black) | — |
| `--color-surface` | `#262019` | Cards, form fields | — |
| `--color-surface-alt` | `#2F2720` | Banded sections | — |
| `--color-text` | `#EDE6DE` | Body and headings | **14.36:1** on bg (AAA) |
| `--color-text-muted` | `#B3A79C` | Meta text, captions | **7.55:1** on bg (AAA) |
| `--color-accent` | `#FFAB73` | Links, active nav, button fills | **9.58:1** on bg (AAA) |
| `--color-accent-soft` | `#3A2A1E` | Accent-tinted backgrounds | — |
| `--color-on-accent` | `#1C1714` | Text on an accent-filled button | **9.58:1** on accent (AAA) |
| `--color-secondary` | `#A7C98B` | Pistachio text, category labels | **9.62:1** on bg (AAA) |
| `--color-secondary-soft` | `#2E3A26` | Category chip backgrounds | — |
| `--color-border` | `#3A322B` | Hairlines, card edges | decorative only |

### Rules

1. **No hex codes anywhere in the stylesheet except in the two token blocks.**
   Every other rule uses `var(--color-…)`. This is what makes dark mode a 10-line change.
2. **`#7BA05B` (raw pistachio) is banned as a text colour.** It measures 2.94:1 on cream
   and fails AA. Use `--color-secondary` for pistachio text and
   `--color-secondary-soft` for pistachio fills.
3. Token names are **semantic, never literal**. `--color-surface`, not `--cream`.
   A literal name becomes a lie the moment the dark theme loads.
4. Borders and dividers are exempt from the 4.5:1 text rule, but any control whose
   *boundary* carries meaning (an input outline, a focus ring) needs at least 3:1.
5. **Re-check every pair you invent** at <https://webaim.org/resources/contrastchecker/>
   and log the result in the VG description document. Both themes.

---

## 3. Typography

Two families, loaded from Google Fonts.

| Role | Family | Fallback stack |
|---|---|---|
| Display / headings | **Fraunces** | `'Fraunces', Georgia, 'Times New Roman', serif` |
| Body / UI | **Nunito** | `'Nunito', 'Segoe UI', Helvetica, Arial, sans-serif` |

Serif for headings, sans for body — the pairing the course material recommends.
Never introduce a third family.

### Scale

Base is `16px` on `<html>`. All sizes in `rem` so they scale from one root value.

| Element | Mobile | Tablet (≥768px) | Desktop (≥1024px) |
|---|---|---|---|
| `h1` | `2rem` | `2.5rem` | `3rem` |
| `h2` | `1.5rem` | `1.75rem` | `2rem` |
| `h3` | `1.25rem` | `1.25rem` | `1.375rem` |
| body `p` | `1rem` | `1rem` | `1.0625rem` |
| small / meta | `0.875rem` | `0.875rem` | `0.875rem` |

> Note: the `cssgrid-responsive-jerry` example in the course material *shrinks* fonts on
> desktop. That is unusual and I'd argue it's a mistake in the example. Growing them is
> the conventional choice and easier to defend. What matters for VG is that your own
> media queries **change** them — which the table above does, at both breakpoints.

### Rules

- `line-height: 1.6` for body text, `1.2` for headings.
- Body copy is capped at `65ch` — the optimal line length from the dag-2 lecture.
- `font-weight`: headings 700, body 400, emphasis 600. Fraunces is variable; don't
  use more than two weights from it.
- Use `em` for padding inside buttons and chips so the padding follows the text size.
  Use `rem` everywhere else. Use `px` only for hairline borders.

---

## 4. Spacing

One scale, four-pixel base. Nothing outside it.

| Token | Value | Typical use |
|---|---|---|
| `--space-xs` | `0.25rem` | Icon gaps |
| `--space-s` | `0.5rem` | Chip padding, tight stacks |
| `--space-m` | `1rem` | Default gap, card padding (mobile) |
| `--space-l` | `1.5rem` | Card padding (desktop), grid gap |
| `--space-xl` | `2rem` | Section spacing (mobile) |
| `--space-2xl` | `3rem` | Section spacing (desktop) |

Other tokens: `--radius: 0.75rem` (cards, buttons), `--radius-pill: 999px` (chips),
`--shadow-card: 0 2px 8px rgba(42, 35, 33, 0.10)`.
In dark mode shadows read as noise — swap `--shadow-card` for a `1px solid var(--color-border)`
outline instead of a drop shadow.

---

## 5. Breakpoints

Mobile-first. Base styles are the phone layout; every media query is `min-width`.

| Name | Query | Layout |
|---|---|---|
| Mobile | *(no query — the base)* | 1 column |
| Tablet | `@media screen and (min-width: 768px)` | 2 columns, nav goes inline |
| Desktop | `@media screen and (min-width: 1024px)` | 3 columns, max-width container, logo left / nav right |

Content container: `max-width: 1100px; margin-inline: auto;` from the desktop
breakpoint upward. Side padding is `--space-m` on mobile, `--space-xl` from tablet.

---

## 6. Layout

Page frame uses **CSS Grid** with named areas; the nav and card rows use **Flexbox**.

```
"header"
"main-content"
"footer"
```

| Page | Mobile | Tablet | Desktop |
|---|---|---|---|
| `index.html` | Hero → suggestion card → recipe grid 1-col | grid 2-col | grid 3-col |
| `recipes.html` | Filter chips wrap → grid 1-col | grid 2-col | grid 3-col |
| `recipe.html` | Image → meta → video → ingredients → steps → rating | 2-col: ingredients beside steps | 2-col with wider steps column |
| `join.html` | Single-column form | Form centred, `max-width: 32rem` | same |

---

## 7. Components

**Header / nav.** Logo (text is fine) + links + theme toggle button.
Mobile: `flex-direction: column`, links full width, centred, `--space-s` padding.
Tablet: `flex-direction: row`, links centred in a single line.
Desktop: `justify-content: space-between`, logo left, links + toggle right.
Current page link carries `aria-current="page"` and renders in `--color-accent` with a
2px underline. Lives once in `components/header.html`.

**Recipe card.** Image (16:9, `object-fit: cover`), category chip, title (`h3`), one-line
summary, and a meta row of freeze time + spin cycle. Whole card is a link. Background
`--color-surface`, `--radius`, `--shadow-card`. On hover: lift 2px and deepen the shadow;
never change the text colour on hover alone.

**Category chip.** `--color-secondary-soft` background, `--color-secondary` text,
`--radius-pill`, `0.25em 0.75em` padding, `0.875rem`, uppercase, `letter-spacing: 0.04em`.

**Spec row.** Freeze time and spin cycle as small `--color-text-muted` items separated by
a middot. On the recipe page these become a definition list.

**Video block.** `<iframe>` wrapped in a container with `width: 100%` and a fixed
`aspect-ratio`, so it scales without letterboxing. **Only rendered when the recipe has a
`youtubeId`** — no empty frame, no empty heading. Always give the iframe a `title`.

**Button.** Primary: `--color-accent` fill, `--color-on-accent` text, `--radius`,
`0.6em 1.4em` padding. Secondary: transparent fill, 2px `--color-accent` border,
`--color-accent` text. Every interactive element gets a visible `:focus-visible` outline —
`2px solid --color-accent`, `2px` offset. Do not remove the focus ring.

**Form field.** Label above input, always a real `<label for>`. Input on
`--color-surface` with a `--color-border` outline; on focus the border becomes
`--color-accent`. Error state: `2px` red border plus a message in a `<p>` directly below
the field, linked with `aria-describedby`. Error text colour: `#B3261E` (light) /
`#F2B8B5` (dark) — **check both before use**. Errors appear on submit, and clear as the
user corrects the field.

**Footer.** Site name, a "fan project, not affiliated with SharkNinja" line, credits for
photos and YouTube channels, and the course/assignment note.

---

## 8. Theme switching

- The theme lives as `data-theme="light" | "dark"` on the `<html>` element.
- The toggle is a `<button>` in the header with `aria-pressed`, never a link.
- Order in `style.css` is fixed and must not be rearranged:
  1. `:root { }` — the complete light palette
  2. `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { } }`
  3. `[data-theme="dark"] { }`
  `:root` and `[data-theme="dark"]` have identical specificity, so **source order alone**
  makes an explicit user choice win. Moving block 3 above block 1 silently breaks it.
- Chosen theme persists in `localStorage` under the key `theme`.
- **Known flaw to document for VG:** the theme script runs after the header loads, so a
  dark-mode visitor sees a light flash on first paint. The fix is a small blocking script
  in `<head>` that sets the attribute before the body renders. Note it, don't hide it.

---

## 9. Imagery

- Recipes with a video: use the YouTube thumbnail
  (`https://img.youtube.com/vi/<id>/maxresdefault.jpg`), **downloaded into `img/`** so the
  site works offline and in the presentation video.
- Recipes without a video: free stock photography (Unsplash / Pexels) as a placeholder,
  or your own photos where you have them.
- Every image carries an `alt` describing the dish, not the file. Decorative images get `alt=""`.
- Every stock photo and every embedded channel is credited — in the recipe's
  `imageCredit` / `credit` fields and again in the footer.
- Target under 300 KB per image, 1600px wide max. Your artist assignment shipped
  1.5 MB PNGs; that will be visible as lag on camera.
- Aspect ratio 16:9 for cards, handled with `object-fit: cover` so mixed sources still align.

---

## 10. Accessibility & quality gate

Nothing ships until all of these pass:

- [ ] Every colour pair checked at WebAIM, both themes, results logged
- [ ] `html` has `lang="en"`; every page has a unique `<title>`
- [ ] One `<h1>` per page, heading levels never skipped
- [ ] Semantic structure: `header`, `nav`, `main`, `article`, `section`, `footer`
- [ ] Every image has a considered `alt`
- [ ] Every form control has a `<label for>`
- [ ] Visible focus ring on every interactive element
- [ ] Text from the URL or a user is written with `textContent`, never `innerHTML`
- [ ] W3C validator clean: <https://validator.w3.org/>
- [ ] Tested in Chrome **and** Firefox, at 375 / 768 / 1440 px

---

## 11. Naming conventions

- Files and folders: lowercase, hyphenated — `vanilla-protein.jpg`, `recipe.html`.
- CSS classes: lowercase hyphenated, describing the thing — `.recipe-card`,
  `.recipe-card__title`, `.chip--secondary`. Pick one convention and hold it.
- IDs only where JavaScript or a `for` attribute needs one.
- JS: `camelCase`. Element references prefixed `el` (`elRecipeList`) — the convention
  used in your course material. **Always declare with `const` or `let`.**
- JSON keys: `camelCase`, matching the JS that reads them.

---

## 12. Still open

- [ ] Site name (repo is `ice-cream-recipes`; the displayed name is still undecided)
- [ ] The six recipes and their three categories
- [ ] Logo treatment — styled text is fine and fast; an SVG is nicer if time allows

---

## 13. Revision 2 — 27 August

### Shop: removed
Cut entirely. It was worth zero grade points and it was the part of the site most likely to
read as an imitation of a real retailer. The time it frees is **not** spare — it is consumed
by the features added below, and by the VG document and video.

### Identity: a profile, not a login
There is no server, so there is no authentication. Storing a password in `localStorage`
would be security theatre and contradicts the XSS lecture from dag 2.

- `join.html` keeps the full four-field sign-up form — email, username, password, repeat
  password — with real JS validation on every field. **This is the graded form.**
- On successful validation the form shows a confirmation and saves **only the username**.
  The password is validated, then discarded. Never written to storage, never logged.
- The header shows the username and a "Sign out" button when a profile exists, and a
  "Sign up" link when it does not.
- `localStorage` keys: `profileName`, `favouriteCategory`, `recentRecipes` (array of ids,
  newest first, capped at 6), `theme`, `unitSystem`.
- Every read from `localStorage` must survive the value being absent or malformed. Wrap
  `JSON.parse` in a `try/catch` — a user with old data must not get a blank page.

### Start page: responsive grid
Recommendations render as a CSS Grid: 1 column mobile, 2 at tablet, 3 at desktop. This is
the headline VG criterion and the grid is where it is demonstrated. A horizontal scroller
looks identical at every width and proves nothing.

Optional second row: "Recently viewed", from `recentRecipes`. Only render the heading when
the array is non-empty.

### Ingredients: both unit systems in the JSON
Each ingredient carries a metric and an imperial string; the toggle swaps which renders.
No conversion maths, no rounding problems — at the cost of writing each line twice.

```json
"ingredients": [
  { "metric": "240 ml whole milk", "imperial": "1 cup whole milk" },
  { "metric": "30 g caster sugar", "imperial": "2 tbsp caster sugar" }
]
```

The chosen system saves to `localStorage` under `unitSystem` and applies on every recipe
page. Label the control as a real `<fieldset>` with two radios, not a bare button.

### Comments
Session-only by default — the G criterion explicitly says entered data need not be
persisted. State this on the page ("comments are not saved") rather than letting a grader
discover it. Persisting them to `localStorage` is a bonus, only if everything else is done.
