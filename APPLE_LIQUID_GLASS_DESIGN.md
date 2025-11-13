# 🍎 Apple Liquid Glass Design System

> Premium glassmorphism inspired by Apple's 2025 design language

---

## 🎨 Design Philosophy

### **Core Principles**

1. **Depth & Layering** - Elements float in space with clear hierarchy
2. **Adaptive Materials** - Glass responds to background, light, and context
3. **Refined Minimalism** - Less is more, every pixel matters
4. **Spatial Awareness** - Clear separation through depth, not borders
5. **Accessibility First** - Beautiful AND usable

---

## 🌈 Color Palette

### **Backgrounds (Soft & Muted)**
```css
/* Not pure black - soft, rich darks */
--bg-primary: #0a0e1a        /* Deep navy blue */
--bg-secondary: #12151f      /* Slightly lighter */
--bg-tertiary: #1a1d29       /* Modals, cards */

/* Light mode alternatives */
--bg-light-primary: #f5f5f7   /* Apple gray */
--bg-light-secondary: #fafafa
--bg-light-tertiary: #ffffff
```

### **Glass Materials**
```css
/* Frosted glass overlays */
--glass-ultra-thin: rgba(255, 255, 255, 0.05)
--glass-thin: rgba(255, 255, 255, 0.08)
--glass-regular: rgba(255, 255, 255, 0.12)
--glass-thick: rgba(255, 255, 255, 0.18)

/* Dark glass (for light backgrounds) */
--glass-dark-thin: rgba(0, 0, 0, 0.05)
--glass-dark-regular: rgba(0, 0, 0, 0.08)
```

### **Accent Colors (Soft & Premium)**
```css
--accent-blue: #007AFF        /* iOS blue */
--accent-teal: #30D5C8        /* Cool teal */
--accent-purple: #AF52DE      /* Soft purple */
--accent-pink: #FF375F        /* Warm pink */
--accent-orange: #FF9500      /* Vibrant orange */
--accent-green: #34C759       /* Success green */
```

### **Text Colors**
```css
/* Dark mode */
--text-primary: rgba(255, 255, 255, 0.95)
--text-secondary: rgba(255, 255, 255, 0.75)
--text-tertiary: rgba(255, 255, 255, 0.55)
--text-quaternary: rgba(255, 255, 255, 0.35)

/* Light mode */
--text-light-primary: rgba(0, 0, 0, 0.9)
--text-light-secondary: rgba(0, 0, 0, 0.7)
--text-light-tertiary: rgba(0, 0, 0, 0.5)
```

---

## 🔤 Typography (San Francisco Style)

### **Font Stack**
```css
/* Primary: System fonts (Apple-like) */
font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text',
             system-ui, sans-serif;

/* For web: Use Inter as SF Pro alternative */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
```

### **Type Scale (Refined & Precise)**
```css
--text-xs: 11px / 0.6875rem    /* Fine print */
--text-sm: 13px / 0.8125rem    /* Body small */
--text-base: 15px / 0.9375rem  /* Body text */
--text-lg: 17px / 1.0625rem    /* Emphasized */
--text-xl: 20px / 1.25rem      /* Subheadings */
--text-2xl: 24px / 1.5rem      /* Section titles */
--text-3xl: 28px / 1.75rem     /* Page titles */
--text-4xl: 34px / 2.125rem    /* Display small */
--text-5xl: 40px / 2.5rem      /* Display medium */
--text-6xl: 48px / 3rem        /* Display large */
--text-7xl: 64px / 4rem        /* Hero */
```

### **Font Weights (Apple Uses: 400, 500, 600, 700)**
```css
--font-normal: 400    /* Regular text */
--font-medium: 500    /* Slightly emphasized */
--font-semibold: 600  /* Headings */
--font-bold: 700      /* Strong emphasis */
```

### **Line Heights (Tight & Clean)**
```css
--leading-tight: 1.2   /* Display text */
--leading-snug: 1.3    /* Headings */
--leading-normal: 1.5  /* Body text */
--leading-relaxed: 1.6 /* Long-form */
```

### **Letter Spacing**
```css
--tracking-tight: -0.02em   /* Large headlines */
--tracking-normal: 0        /* Body text */
--tracking-wide: 0.02em     /* Small text */
```

---

## 🪟 Glass Material System

### **Material Hierarchy**

#### **Level 1: Ultra Thin (Subtle Overlay)**
```css
background: rgba(255, 255, 255, 0.05);
backdrop-filter: blur(20px) saturate(180%);
border: 1px solid rgba(255, 255, 255, 0.1);
```
**Use for:** Tooltips, badges, subtle overlays

#### **Level 2: Thin (Standard Panel)**
```css
background: rgba(255, 255, 255, 0.08);
backdrop-filter: blur(40px) saturate(180%);
border: 1px solid rgba(255, 255, 255, 0.12);
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
```
**Use for:** Cards, sidebars, navigation bars

#### **Level 3: Regular (Elevated Panel)**
```css
background: rgba(255, 255, 255, 0.12);
backdrop-filter: blur(60px) saturate(180%);
border: 1px solid rgba(255, 255, 255, 0.15);
box-shadow: 0 16px 64px rgba(0, 0, 0, 0.16);
```
**Use for:** Modals, popovers, floating elements

#### **Level 4: Thick (Maximum Emphasis)**
```css
background: rgba(255, 255, 255, 0.18);
backdrop-filter: blur(80px) saturate(200%);
border: 1px solid rgba(255, 255, 255, 0.2);
box-shadow: 0 24px 96px rgba(0, 0, 0, 0.2);
```
**Use for:** App windows, full-screen overlays

---

## 🎯 Component Styles

### **Buttons**

#### **Primary (Filled)**
```css
background: linear-gradient(180deg, #007AFF 0%, #0051D5 100%);
color: white;
padding: 10px 20px;
border-radius: 10px;
font-weight: 600;
box-shadow: 0 2px 8px rgba(0, 122, 255, 0.3);
transition: all 0.2s ease;

/* Hover */
box-shadow: 0 4px 16px rgba(0, 122, 255, 0.4);
transform: translateY(-1px);
```

#### **Secondary (Glass)**
```css
background: rgba(255, 255, 255, 0.08);
backdrop-filter: blur(20px) saturate(180%);
color: rgba(255, 255, 255, 0.9);
padding: 10px 20px;
border-radius: 10px;
border: 1px solid rgba(255, 255, 255, 0.12);
font-weight: 600;
transition: all 0.2s ease;

/* Hover */
background: rgba(255, 255, 255, 0.12);
border-color: rgba(255, 255, 255, 0.18);
```

#### **Tertiary (Minimal)**
```css
background: transparent;
color: #007AFF;
padding: 10px 20px;
border-radius: 10px;
font-weight: 600;
transition: all 0.2s ease;

/* Hover */
background: rgba(0, 122, 255, 0.1);
```

### **Cards (Glass Panels)**
```css
background: rgba(255, 255, 255, 0.08);
backdrop-filter: blur(40px) saturate(180%);
border: 1px solid rgba(255, 255, 255, 0.12);
border-radius: 16px;
padding: 20px;
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

/* Hover */
background: rgba(255, 255, 255, 0.12);
box-shadow: 0 16px 64px rgba(0, 0, 0, 0.16);
transform: translateY(-4px);
```

### **Inputs**
```css
background: rgba(255, 255, 255, 0.06);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: 10px;
padding: 12px 16px;
color: rgba(255, 255, 255, 0.9);
font-size: 15px;
transition: all 0.2s ease;

/* Focus */
background: rgba(255, 255, 255, 0.08);
border-color: #007AFF;
box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.1);
outline: none;

/* Placeholder */
color: rgba(255, 255, 255, 0.4);
```

### **Modals / Dialogs**
```css
/* Backdrop */
background: rgba(0, 0, 0, 0.7);
backdrop-filter: blur(20px);

/* Modal */
background: rgba(26, 29, 41, 0.95);
backdrop-filter: blur(80px) saturate(200%);
border: 1px solid rgba(255, 255, 255, 0.15);
border-radius: 20px;
padding: 32px;
box-shadow: 0 24px 96px rgba(0, 0, 0, 0.3);
```

### **Navigation Bars**
```css
background: rgba(255, 255, 255, 0.08);
backdrop-filter: blur(40px) saturate(180%);
border-bottom: 1px solid rgba(255, 255, 255, 0.08);
padding: 16px 24px;
```

---

## ✨ Shadow System (Soft & Layered)

```css
/* Apple-style shadows - soft, large spread */
--shadow-xs: 0 1px 3px rgba(0, 0, 0, 0.08);
--shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.1);
--shadow-md: 0 8px 32px rgba(0, 0, 0, 0.12);
--shadow-lg: 0 16px 64px rgba(0, 0, 0, 0.16);
--shadow-xl: 0 24px 96px rgba(0, 0, 0, 0.2);
--shadow-2xl: 0 32px 128px rgba(0, 0, 0, 0.24);

/* Colored shadows for buttons */
--shadow-blue: 0 4px 16px rgba(0, 122, 255, 0.3);
--shadow-purple: 0 4px 16px rgba(175, 82, 222, 0.3);
--shadow-pink: 0 4px 16px rgba(255, 55, 95, 0.3);
```

---

## 📐 Spacing System (Apple's 8pt Grid)

```css
--space-0: 0px
--space-1: 2px
--space-2: 4px
--space-3: 8px     /* Base unit */
--space-4: 12px
--space-5: 16px
--space-6: 20px
--space-7: 24px
--space-8: 32px
--space-9: 40px
--space-10: 48px
--space-11: 64px
--space-12: 80px
--space-13: 96px
```

---

## 🎬 Animation Principles

### **Timing Functions (Smooth & Natural)**
```css
--ease-in: cubic-bezier(0.4, 0, 1, 1)
--ease-out: cubic-bezier(0, 0, 0.2, 1)
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)  /* Most common */
--ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275)
```

### **Durations (Quick & Responsive)**
```css
--duration-instant: 100ms   /* Micro-interactions */
--duration-fast: 200ms      /* Hover, focus */
--duration-normal: 300ms    /* Most animations */
--duration-slow: 400ms      /* Modals, transitions */
--duration-lazy: 600ms      /* Page transitions */
```

### **Animation Patterns**

#### **Fade In + Scale (Default)**
```css
@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

#### **Slide Up (Sheets, Modals)**
```css
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## 📱 Border Radius System

```css
/* Apple loves generous, consistent radii */
--radius-xs: 4px
--radius-sm: 8px
--radius-md: 10px    /* Buttons, inputs */
--radius-lg: 12px    /* Cards */
--radius-xl: 16px    /* Large cards */
--radius-2xl: 20px   /* Modals */
--radius-3xl: 24px   /* Full-screen panels */
--radius-full: 9999px /* Pills, circles */
```

---

## 🎯 Usage Guidelines

### **DO ✅**
- Use frosted glass for panels, cards, and navigation
- Keep backgrounds vibrant to show glass effect
- Use soft shadows for depth
- Maintain generous padding (16px+)
- Use smooth transitions (300ms)
- Keep borders thin (1px) and subtle
- Use backdrop-filter for real blur

### **DON'T ❌**
- Don't use pure black backgrounds
- Don't stack too many glass layers (max 3-4)
- Don't use harsh borders (keep them subtle)
- Don't forget backdrop-filter (essential for glass)
- Don't overuse blur (affects performance)
- Don't compromise readability for aesthetics

---

## 🌓 Dark & Light Mode

### **Dark Mode (Default)**
- Backgrounds: Dark navy blues (#0a0e1a)
- Glass: White with low opacity (0.05-0.18)
- Text: White with high opacity (0.95)
- Accents: Full saturation

### **Light Mode**
- Backgrounds: Light grays (#f5f5f7)
- Glass: Black with low opacity (0.05-0.12)
- Text: Black with high opacity (0.9)
- Accents: Slightly desaturated

---

## 🛠️ Implementation Checklist

- [ ] Update Tailwind config with glass utilities
- [ ] Create reusable glass components
- [ ] Add backdrop-filter polyfill (Safari)
- [ ] Test on different backgrounds
- [ ] Ensure text readability
- [ ] Optimize blur performance
- [ ] Add smooth transitions
- [ ] Test light/dark modes

---

**Inspired by:** Apple iOS 26, macOS Sequoia, visionOS 26
**Version:** 1.0.0
**Last Updated:** November 2025
