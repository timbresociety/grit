# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Project Overview

Grit Labs is a premium portfolio/agency website built with Next.js 16 (App Router) and React 19. The site uses an editorial/magazine-style design language with scroll-driven animations and a Renaissance-meets-modern aesthetic.

## Commands

```bash
npm run dev       # Start development server (localhost:3000)
npm run build     # Production build
npm run lint      # Run ESLint
npm start         # Serve production build
```

No test framework is configured.

## Architecture

### Provider Hierarchy

The app wraps content in three providers (see `src/app/layout.tsx`):
1. **PerformanceGate** - Detects low-power mode and reduced motion preferences
2. **MotionProvider** - Initializes Lenis smooth scrolling + GSAP ScrollTrigger
3. **HeroLoadingProvider** - Manages hero section loading animation phases

### State Management

Zustand store at `src/store/useStore.ts` manages:
- **UI state**: menu open/close
- **Performance state**: low power mode, reduced motion detection
- **Motion state**: scroll lock, smooth scroll toggle, active section tracking

### Key Component Patterns

- **PinnedSection** (`src/components/ui/PinnedSection.tsx`) - Sections that stick during scroll with GSAP ScrollTrigger
- **EditorialLayout** (`src/components/ui/EditorialLayout.tsx`) - Master layout wrapper providing editorial context
- **ScrollVideoBackground** - Fixed background using prerendered WebP frames (in `/public/frames_webp/`)

### Directory Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── work/[slug]/        # Dynamic work detail pages
├── components/
│   ├── sections/           # Page sections (Hero, Services, Process, etc.)
│   ├── ui/                 # Reusable UI components
│   ├── providers/          # React context providers
│   └── debug/              # Development debugging tools
├── contexts/               # React contexts (HeroLoadingContext)
├── hooks/                  # Custom hooks (useHeroMouseTracker, useFocusTrap)
├── store/                  # Zustand store
├── lib/                    # Utilities (cn() for Tailwind class merging)
└── work/                   # Work case study markdown files
```

## Animation Stack

Three animation libraries work together:
- **GSAP + ScrollTrigger** - Scroll-based pinning and timeline animations
- **Framer Motion** - Component-level animations and gestures
- **Lenis** - Smooth scrolling (integrated with GSAP via MotionProvider)

Lottie animations are stored in `/public/animations/` and rendered via `LottieIcon` component.

## Design System

See `BrandSystem.md` for complete design documentation.

**Typography**: Cormorant Garamond (headlines), DM Sans (body/UI)

**Color tokens** (defined in `globals.css`):
- `--color-background`: #FAF9F7 (paper white)
- `--color-foreground`: #1A1A1A (charcoal ink)
- `--color-accent-jewel`: #1E3A5F (deep sapphire)
- `--color-accent-warm`: #C17F59 (terracotta)

**Class utilities**: Use `cn()` from `src/lib/utils.ts` for Tailwind class merging.

## Motion Guidelines

- All animations must respect `prefers-reduced-motion`
- Use `transform` + `opacity` only for performance
- Standard easing: `cubic-bezier(0.16, 1, 0.3, 1)`
- Durations: 150ms (fast), 300ms (normal), 500ms (slow)
