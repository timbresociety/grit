# Grit Labs Brand System

> Editions-Style Editorial Design Language

## Typography

### Font Stack
- **Headlines**: Cormorant Garamond (serif) — elegant, high-contrast editorial feel
- **Body/UI**: DM Sans — clean, modern, highly legible

### Type Scale
| Element | Size | Weight | Usage |
|---------|------|--------|-------|
| H1 | `clamp(3rem, 8vw, 7rem)` | 400 | Hero headlines |
| H2 | `clamp(2rem, 5vw, 4rem)` | 500 | Section titles |
| H3 | `clamp(1.5rem, 3vw, 2.5rem)` | 500 | Chapter headings |
| Body | 16px / 1.6 | 400 | Paragraphs |
| Label | 11px / 0.15em tracking | 500 | Section labels, uppercase |
| Chapter | 14px | 400 | Chapter numbers |

---

## Color Palette

### Core Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--color-background` | `#FAF9F7` | Paper-like off-white base |
| `--color-foreground` | `#1A1A1A` | Charcoal ink text |
| `--color-muted` | `#6B6B6B` | Secondary text |
| `--color-muted-light` | `#9A9A9A` | Tertiary text |

### Accent Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--color-accent-jewel` | `#1E3A5F` | Deep sapphire — CTAs, icons, links |
| `--color-accent-warm` | `#C17F59` | Terracotta — subtle highlights |

### Surface Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--color-surface` | `#FFFFFF` | Card/panel backgrounds |
| `--color-border` | `rgba(26,26,26,0.12)` | Hairline borders |
| `--color-border-strong` | `rgba(26,26,26,0.25)` | Hover/active borders |

---

## Surfaces & Panels

### Framed Panel (`.panel`)
```css
background: var(--color-surface);
border: 1px solid var(--color-border);
border-radius: 8px;
box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03);
```

### Hover State (`.panel-hover`)
- Border darkens to `--color-border-strong`
- Box shadow increases
- Transform: `translateY(-2px)`

---

## Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `--gutter` | `clamp(1.5rem, 5vw, 6rem)` | Container side padding |
| `--section-gap` | `clamp(4rem, 10vh, 8rem)` | Between sections |

---

## Motion

### Principles
1. **Subtle, not flashy** — motion enhances, never distracts
2. **transforms + opacity only** — for performance
3. **Respect `prefers-reduced-motion`** — all animations disabled

### Timing
| Token | Value |
|-------|-------|
| `--duration-fast` | 150ms |
| `--duration-normal` | 300ms |
| `--duration-slow` | 500ms |
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` |

### Patterns
- **Section entrance**: fade + translateY(20px)
- **Card stagger**: 50ms delay per card
- **Parallax**: background layers only, max 30px amplitude
- **Hover**: 2-4px lift, border emphasis

---

## Components

### Buttons
- **Primary** (`.btn-primary`): Dark bg, light text, uppercase tracking
- **Secondary** (`.btn-secondary`): Transparent bg, border, uppercase tracking

### Labels
- **Section Label** (`.label`): 11px, uppercase, wide tracking, muted color
- **Chapter Number** (`.chapter-number`): Serif, muted, used for "Chapter 01" etc.

---

## Accessibility

- Focus rings: 2px solid `--color-accent-jewel`, 3px offset
- Color contrast: All text meets WCAG AA (4.5:1 minimum)
- `prefers-reduced-motion`: All animations disabled
- Keyboard navigation: All interactive elements focusable
