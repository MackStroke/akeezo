# AKEEZO Design System & Color Palette Specification

This document defines the official visual design system, color palette, typography, and component styling rules for **AKEEZO — Healthcare Journey Platform**.

![Color Palette](file:///C:/Users/Mackstroke/.gemini/antigravity/brain/c3b6f838-f9c2-48b1-9d54-276ff3930b92/.user_uploaded/media_1789243162717.png)

---

## 1. Primary Brand Color Swatches

The brand identity is built around 4 primary core colors:

| Swatch | Color Name | Hex Code | HSL / RGB | Primary Role |
| :--- | :--- | :--- | :--- | :--- |
| ![#1D265D](https://placehold.co/24x24/1D265D/1D265D.png) | **Midnight Navy** | `#1D265D` | `hsl(232, 52%, 24%)` | Primary Brand Anchor, Utility Bar, Hero Background, Card Headers |
| ![#52A5E9](https://placehold.co/24x24/52A5E9/52A5E9.png) | **Sky Blue Accent** | `#52A5E9` | `hsl(207, 77%, 62%)` | Primary Interactive Accent, Call-to-Action, Focus Rings, Active States |
| ![#FFFFFF](https://placehold.co/24x24/FFFFFF/FFFFFF.png) | **Pure White** | `#FFFFFF` | `hsl(0, 0%, 100%)` | Clean Surface Background, Card Fill, Light Text on Dark Bands |
| ![#262626](https://placehold.co/24x24/262626/262626.png) | **Charcoal Ink** | `#262626` | `hsl(0, 0%, 15%)` | Primary Headings, High-Contrast Body Copy, Dark Neutral Ink |

---

## 2. Derived Color Scales: Tints, Tones & Shades

To support full UI depth, accessibility compliance (WCAG AA), interactive states, and elevation layers, the design system expands the 4 core swatches into systematic Tints (lightened), Tones (desaturated/greyed), and Shades (darkened).

### A. Midnight Navy (`#1D265D`) Scale

- **Deep Shade (`#0E1434`)**: Used for Dark Mode root background and deepest shadow backdrops.
- **Base Brand (`#1D265D`)**: Used for Hero Band, Top Utility Bar (`bg-navy`), and Primary Brand Badges.
- **Medium Shade (`#2C387D`)**: Used for hover states on navy buttons and active header dropdowns.
- **Tone (`#485493`)**: Used for secondary borders, subheaders, and muted navigation links.
- **Light Tint (`#D4DAEC`)**: Used for subtle dividers, card borders in navy themes.
- **Softest Tint (`#F0F3FA`)**: Used for light section backgrounds and subtle highlighted cards.

### B. Sky Blue (`#52A5E9`) Scale

- **Deep Shade (`#2B78BD`)**: Hover state for primary buttons, active tab indicators.
- **Base Accent (`#52A5E9`)**: Primary button fill, links, active tab underlines, focus rings.
- **Light Accent (`#7BC0F3`)**: Hover state for dark mode buttons and interactive elements.
- **Tone (`#478CBD`)**: Muted icon highlights and subtle badge text.
- **Light Tint (`#D4ECFB`)**: Badge background fill, search input focus highlights.
- **Softest Tint (`#EBF5FD`)**: Active tab background, light card accent fill, notification highlights.

### C. Charcoal Ink (`#262626`) Scale

- **Deepest Ink (`#171717`)**: Main title headings (`h1`, `h2`, `h3`).
- **Base Body Text (`#262626`)**: Standard body copy, labels, table data text.
- **Muted Text Tone (`#595959`)**: Subtitles, table captions, helper captions.
- **Subtle Border (`#E2E8F0`)**: Input borders, table divider rules, card borders.
- **Subtle Surface (`#F8FAFC`)**: Sunk sections, FAQ item background, search bar container.

### D. Emergency Functional Color (Mandatory Rule)

- **Emergency Red (`#D92D20`)**: Reserved EXCLUSIVELY for 24/7 medical emergency buttons, ambulance indicators, and emergency alerts. Never used for general decorative elements.

---

## 3. UI Token Mapping & CSS Variables

```css
:root {
  /* Surface & Base Layout */
  --background: #ffffff;
  --foreground: #262626;
  --ink-strong: #171717;

  /* Cards & Popovers */
  --card: #ffffff;
  --card-foreground: #262626;
  --popover: #ffffff;
  --popover-foreground: #262626;

  /* Brand Primary & Interactive */
  --primary: #52A5E9;
  --primary-foreground: #ffffff;

  /* Secondary & Accent Surfaces */
  --secondary: #EBF5FD;
  --secondary-foreground: #1D265D;
  --accent: #EBF5FD;
  --accent-foreground: #1D265D;

  /* Muted Text & Elements */
  --muted: #F4F6F9;
  --muted-foreground: #595959;

  /* Borders & Focus Rings */
  --border: #E2E8F0;
  --rule: #E2E8F0;
  --input: #CBD5E1;
  --ring: #52A5E9;

  /* Hero & Utility Navigation */
  --hero-band: #1D265D;
  --navy: #1D265D;
  --navy-foreground: #ffffff;

  /* Button Gradients */
  --cta-from: #52A5E9;
  --cta-to: #1D265D;
  --cta-from-hover: #3B8ED4;
  --cta-to-hover: #131A43;

  /* Emergency Affordances (Strictly Preserved) */
  --emergency: #d92d20;
  --emergency-strong: #a32118;
  --emergency-surface: #fdf2f1;
  --emergency-ink: #99201a;
}
```

### Dark Mode (`@media (prefers-color-scheme: dark)`)

```css
@media (prefers-color-scheme: dark) {
  :root {
    --background: #0E1434;
    --foreground: #F1F5F9;
    --ink-strong: #ffffff;

    --card: #131A43;
    --card-foreground: #F1F5F9;
    --popover: #131A43;
    --popover-foreground: #F1F5F9;

    --primary: #52A5E9;
    --primary-foreground: #0E1434;

    --secondary: #1D265D;
    --secondary-foreground: #92C6F2;
    --accent: #1D265D;
    --accent-foreground: #92C6F2;

    --muted: #182252;
    --muted-foreground: #94A3B8;

    --border: #253275;
    --rule: #253275;
    --input: #3A4B92;
    --ring: #52A5E9;

    --hero-band: #0E1434;
    --navy: #090D26;
    --navy-foreground: #ffffff;

    --cta-from: #52A5E9;
    --cta-to: #2B78BD;
  }
}
```

---

## 4. Design Guidelines & Component Application

1. **Header & Utility Strip**:
   - The top utility bar uses Midnight Navy (`#1D265D`) with white copy and glass pill selectors (`bg-white/15 hover:bg-white/25`).
2. **Hero Band**:
   - Deep Midnight Navy (`#1D265D`) background displaying crisp White text (`#FFFFFF`) to achieve maximum WCAG AA contrast (13.2:1 ratio).
3. **Primary Call-To-Action (Search & Enquire)**:
   - MakeMyTrip-inspired gradient pill CTA transitioning from Sky Blue (`#52A5E9`) to Midnight Navy (`#1D265D`).
4. **Cards & Content Tables**:
   - Clean White background (`#FFFFFF`) with subtle border (`#E2E8F0`) and Charcoal Ink (`#262626`) body text.
5. **Tabs & Badges**:
   - Active state features Sky Blue (`#52A5E9`) underline and soft tint background (`#EBF5FD`).
