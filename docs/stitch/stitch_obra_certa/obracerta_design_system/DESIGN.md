---
name: ObraCerta Design System
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#43474f'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#747780'
  outline-variant: '#c3c6d0'
  surface-tint: '#3e5f92'
  primary: '#001939'
  on-primary: '#ffffff'
  primary-container: '#002d5e'
  on-primary-container: '#7696cd'
  inverse-primary: '#a9c7ff'
  secondary: '#a04100'
  on-secondary: '#ffffff'
  secondary-container: '#fe6b00'
  on-secondary-container: '#572000'
  tertiary: '#011f05'
  on-tertiary: '#ffffff'
  tertiary-container: '#163418'
  on-tertiary-container: '#7c9e78'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#a9c7ff'
  on-primary-fixed: '#001b3d'
  on-primary-fixed-variant: '#244779'
  secondary-fixed: '#ffdbcc'
  secondary-fixed-dim: '#ffb693'
  on-secondary-fixed: '#351000'
  on-secondary-fixed-variant: '#7a3000'
  tertiary-fixed: '#c7ecc2'
  tertiary-fixed-dim: '#acd0a7'
  on-tertiary-fixed: '#032107'
  on-tertiary-fixed-variant: '#2f4e2f'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-bold:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  button-text:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  margin-mobile: 16px
  gutter-mobile: 12px
  touch-target-min: 48px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 24px
---

## Brand & Style
The design system is engineered for the high-pressure, high-glare environment of construction sites. The brand personality is authoritative, resilient, and utilitarian. It prioritizes functional clarity over aesthetic flourish, ensuring that a project manager or laborer can extract critical information at a glance under direct sunlight.

The style is **Corporate / Modern** with a lean toward **High-Contrast**. It utilizes heavy-weight typography and a rigid grid to evoke a sense of structural integrity. Every interface element is sized for tactile reliability, accommodating one-handed use and gloved interactions.

## Colors
The palette is optimized for maximum outdoor legibility. 

- **Primary (Deep Navy):** Used for headers, navigation, and primary branding to establish trust and stability.
- **Accent (Safety Orange):** Reserved strictly for primary calls to action (CTAs) and critical status indicators. This mimics the high-visibility gear found on-site.
- **Neutros:** We use a pure white background (#FFFFFF) to maximize contrast against black text (#1A1A1A) for body content.
- **Feedback:** Success, Error, and Warning colors follow standard safety protocols (Green/Red/Yellow) but use slightly darkened shades to maintain contrast ratios above 4.5:1.

## Typography
This design system utilizes **Inter** for its exceptional legibility and systematic weight distribution. 

- **Hierarchy:** Use Bold (700) for all headings to ensure they remain readable even when screen brightness is lowered or glare is present.
- **Body Text:** Never drop below 16px for primary information to ensure accessibility in motion.
- **Labels:** Use Semibold (600) with a slight letter spacing for data labels (e.g., "PO#", "Status", "Quantity") to distinguish them from user input and values.

## Layout & Spacing
The layout follows a **Fluid Grid** model with a heavy emphasis on vertical stacking for mobile efficiency.

- **Mobile First:** A 4-column grid is used for mobile (375px+), scaling to 8 columns for tablets.
- **Touch Targets:** All interactive elements must adhere to a minimum 48x48px tap area.
- **Rhythm:** An 8px linear scale governs all spacing. Use `stack-md` (16px) for standard grouping and `stack-lg` (24px) to separate distinct logical sections or cards.
- **Safe Zones:** Maintain a 16px outer margin on all mobile screens to prevent content from being obscured by rugged phone cases.

## Elevation & Depth
To maintain high contrast and outdoor visibility, this design system avoids complex shadows and blurs which wash out under bright light.

- **Low-Contrast Outlines:** Use 1px solid borders (#E0E0E0) for cards and containers instead of shadows.
- **Tonal Layers:** Use light grey (#F5F5F5) backgrounds to distinguish the "page" from "card" surfaces (#FFFFFF).
- **Active States:** When an element is pressed, use a subtle 2px inset border or a 5% dark overlay rather than a shadow "lift" effect.

## Shapes
The shape language is **Soft** (roundedness: 1). 

- **Standard Elements:** Buttons and Input fields use a 0.25rem (4px) corner radius, providing a professional look that still feels modern.
- **Cards:** Large containers use `rounded-lg` (0.5rem / 8px) to softly frame content without wasting screen real estate.
- **Status Pills:** Use fully rounded (pill) shapes for status indicators (e.g., "In Progress", "Completed") to clearly differentiate them from buttons.

## Components
- **Buttons:** Primary buttons use the Accent Orange background with White text. They must span the full width of the container on mobile for easy thumb access.
- **Inputs:** Use "Floating Labels" or permanently visible top-aligned labels in Bold. Text fields must have a 1px solid border (#1A1A1A) to ensure the hit area is unmistakable.
- **Cards:** Cards should be white-backed with a 1px #E0E0E0 border. Padding within cards is fixed at 16px.
- **Lists:** Data lists use "Divided Rows" (1px horizontal lines). Each row should have a minimum height of 64px to ensure tap accuracy for list items.
- **Progress Bars:** Use thick (8px+) bars. The track should be Light Grey (#E0E0E0) and the fill should be Primary Navy or Success Green.
- **Alerts:** Critical errors use a thick 4px left-border of the Error Red color to draw immediate visual attention without needing to read the text first.