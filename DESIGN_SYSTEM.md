# 🎨 Mina Design System - 2025 Bold Retro

> A comprehensive design system following 2025 trends: Bold Typography, Retro Maximalism, Kinetic Animations

---

## 📐 Design Principles

### 1. **Bold & Unapologetic**
- Large, chunky typography dominates
- High contrast ratios (90:10 dark to accent)
- Text as visual element, not just content

### 2. **Retro Futurism**
- 80s/90s nostalgia meets modern functionality
- Neon accents on dark backgrounds
- Grainy textures & glitch effects (subtle)

### 3. **Kinetic & Alive**
- Every element has subtle motion
- Smooth, intentional animations (no jarring)
- Interactive feedback on all actions

### 4. **Maximalist with Purpose**
- Rich visual layers but organized
- Gradients with depth
- Strategic color splashes guide attention

---

## 🎨 Color Palette

### **Primary Dark Backgrounds**
```css
--bg-primary: #050a17      /* Deep space blue */
--bg-secondary: #0a0f1f    /* Slightly lighter */
--bg-tertiary: #0d1325     /* Modal/card backgrounds */
```

### **Neon Accents (Retro)**
```css
--neon-purple: #8B5CF6     /* Primary CTA */
--neon-cyan: #06B6D4       /* Secondary actions */
--neon-pink: #EC4899       /* Alerts/highlights */
--neon-amber: #F59E0B      /* Warnings/attention */
--neon-green: #10B981      /* Success states */
```

### **Gradient Overlays**
```css
--gradient-retro: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)
--gradient-cyber: linear-gradient(135deg, #06B6D4 0%, #8B5CF6 100%)
--gradient-sunset: linear-gradient(135deg, #F59E0B 0%, #EC4899 100%)
--gradient-matrix: linear-gradient(135deg, #10B981 0%, #06B6D4 100%)
```

### **Text Colors**
```css
--text-primary: #FFFFFF         /* Main content */
--text-secondary: rgba(255,255,255,0.7)  /* Body text */
--text-tertiary: rgba(255,255,255,0.5)   /* Muted text */
--text-accent: #8B5CF6          /* Links, highlights */
```

---

## 🔤 Typography System

### **Font Stack**
```css
Primary: 'Inter Variable', system-ui, sans-serif
Headings: 'Space Grotesk', 'Inter', sans-serif  /* Bold, geometric */
Display: 'Clash Display', 'Space Grotesk', sans-serif  /* Extra bold for heroes */
```

### **Type Scale (Bold & Large)**
```css
--text-xs: 0.75rem      /* 12px - tiny labels */
--text-sm: 0.875rem     /* 14px - body small */
--text-base: 1rem       /* 16px - body text */
--text-lg: 1.25rem      /* 20px - emphasized */
--text-xl: 1.5rem       /* 24px - subheadings */
--text-2xl: 2rem        /* 32px - headings */
--text-3xl: 2.5rem      /* 40px - page titles */
--text-4xl: 3rem        /* 48px - hero text */
--text-5xl: 4rem        /* 64px - display large */
--text-6xl: 5rem        /* 80px - mega display */
```

### **Font Weights**
```css
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700      /* Use frequently */
--font-black: 900     /* Display text only */
```

### **Line Heights (Tight for bold text)**
```css
--leading-tight: 1.1    /* Display text */
--leading-snug: 1.3     /* Headings */
--leading-normal: 1.5   /* Body text */
--leading-relaxed: 1.7  /* Long-form content */
```

---

## 🎭 Spacing System (Consistent Rhythm)

### **Base Unit: 4px (0.25rem)**
```css
--space-1: 0.25rem    /* 4px */
--space-2: 0.5rem     /* 8px */
--space-3: 0.75rem    /* 12px */
--space-4: 1rem       /* 16px - base */
--space-5: 1.25rem    /* 20px */
--space-6: 1.5rem     /* 24px */
--space-8: 2rem       /* 32px */
--space-10: 2.5rem    /* 40px */
--space-12: 3rem      /* 48px */
--space-16: 4rem      /* 64px */
--space-20: 5rem      /* 80px */
--space-24: 6rem      /* 96px */
```

### **Component Spacing Rules**
- **Micro**: 4-8px (buttons, icons)
- **Small**: 12-16px (cards, list items)
- **Medium**: 24-32px (sections within components)
- **Large**: 48-64px (major sections)
- **XLarge**: 80-96px (page sections)

---

## 🎬 Animation Library (GSAP)

### **Timing Functions**
```javascript
// All animations use GSAP's ease functions
ease.power2.out     // Most UI elements (default)
ease.power3.out     // Larger movements
ease.elastic.out    // Playful micro-interactions
ease.back.out       // Buttons, cards
ease.expo.inOut     // Page transitions
```

### **Standard Durations**
```javascript
const DURATION = {
  instant: 0.15,    // Icon changes, tooltips
  fast: 0.3,        // Buttons, hover states
  normal: 0.5,      // Cards, modals
  slow: 0.8,        // Page transitions
  lazy: 1.2,        // Hero animations
}
```

### **Animation Patterns**

#### **1. Fade In Up (Default Enter)**
```javascript
gsap.fromTo(element,
  { opacity: 0, y: 20 },
  { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
)
```

#### **2. Scale Bounce (Buttons)**
```javascript
gsap.fromTo(button,
  { scale: 0.95 },
  { scale: 1, duration: 0.3, ease: 'back.out(1.7)' }
)
```

#### **3. Kinetic Typography (Text Reveal)**
```javascript
gsap.fromTo(text.children,
  { opacity: 0, y: 50, rotateX: -90 },
  { opacity: 1, y: 0, rotateX: 0, stagger: 0.05, duration: 0.8, ease: 'power3.out' }
)
```

#### **4. Neon Glow Pulse (Accent Elements)**
```javascript
gsap.to(element, {
  boxShadow: '0 0 20px rgba(139, 92, 246, 0.8)',
  duration: 1.5,
  repeat: -1,
  yoyo: true,
  ease: 'sine.inOut'
})
```

#### **5. Glitch Effect (On Hover)**
```javascript
gsap.to(element, {
  x: gsap.utils.random(-2, 2),
  duration: 0.05,
  repeat: 3,
  yoyo: true,
  ease: 'power1.inOut'
})
```

---

## 🧩 Component Guidelines

### **Buttons**
```tsx
// Primary CTA
className="
  px-6 py-3
  bg-gradient-to-r from-purple-500 to-pink-500
  text-white font-bold text-lg
  rounded-full
  transform transition-all duration-300
  hover:scale-105 hover:shadow-[0_0_20px_rgba(139,92,246,0.6)]
  active:scale-95
"

// Secondary
className="
  px-6 py-3
  border-2 border-purple-500
  text-purple-400 font-semibold
  rounded-full
  hover:bg-purple-500/10
  transition-all duration-300
"

// Ghost
className="
  px-4 py-2
  text-white/70 font-medium
  hover:text-white hover:bg-white/5
  rounded-lg transition-all duration-300
"
```

### **Cards**
```tsx
className="
  p-6
  bg-[#0d1325] border border-white/10
  rounded-2xl
  hover:border-purple-500/50
  transform transition-all duration-500
  hover:translate-y-[-4px]
  hover:shadow-[0_20px_50px_rgba(139,92,246,0.3)]
"
```

### **Inputs**
```tsx
className="
  w-full px-4 py-3
  bg-white/5 border border-white/20
  text-white placeholder:text-white/40
  rounded-xl
  focus:border-purple-500 focus:bg-white/10
  focus:outline-none focus:ring-2 focus:ring-purple-500/50
  transition-all duration-300
"
```

### **Modals**
```tsx
// Backdrop
className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"

// Modal Container
className="
  max-w-lg w-full
  bg-[#0d1325] border border-white/20
  rounded-3xl p-8
  shadow-[0_50px_100px_rgba(0,0,0,0.8)]
"
```

---

## 📱 Responsive Breakpoints

```javascript
const breakpoints = {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet portrait
  lg: '1024px',  // Tablet landscape / Small desktop
  xl: '1280px',  // Desktop
  '2xl': '1536px' // Large desktop
}
```

### **Usage**
```tsx
// Mobile-first approach
className="
  text-2xl        /* Mobile */
  md:text-4xl     /* Tablet+ */
  lg:text-5xl     /* Desktop+ */

  px-4            /* Mobile */
  md:px-8         /* Tablet+ */
  lg:px-16        /* Desktop+ */
"
```

---

## ✨ Effects Library

### **Glass Morphism (Subtle)**
```css
background: rgba(255, 255, 255, 0.05);
backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.1);
```

### **Neon Border Glow**
```css
border: 2px solid #8B5CF6;
box-shadow:
  0 0 10px rgba(139, 92, 246, 0.5),
  inset 0 0 10px rgba(139, 92, 246, 0.2);
```

### **Retro Grain Overlay (Optional)**
```css
background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><filter id="noise"><feTurbulence baseFrequency="0.9"/></filter><rect width="100%" height="100%" filter="url(%23noise)" opacity="0.05"/></svg>');
```

### **Gradient Text**
```css
background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
```

---

## 🎯 Layout Patterns

### **Hero Section**
```tsx
<section className="min-h-screen flex items-center justify-center px-4 py-20">
  <div className="max-w-6xl mx-auto text-center">
    <h1 className="text-6xl md:text-7xl lg:text-8xl font-black">
      <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        Bold Title
      </span>
    </h1>
    <p className="text-xl md:text-2xl text-white/70 mt-6 max-w-2xl mx-auto">
      Supporting text here
    </p>
  </div>
</section>
```

### **Grid Layout (Cards)**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Cards here */}
</div>
```

---

## 🔧 Implementation Checklist

- [ ] Install custom fonts (Space Grotesk, Inter Variable)
- [ ] Extend Tailwind config with design tokens
- [ ] Create GSAP animation utilities (`src/animations/`)
- [ ] Build reusable component library
- [ ] Document component usage examples
- [ ] Set up Storybook (optional)
- [ ] Create design review process

---

## 📚 Resources

- **Fonts**: Google Fonts (Inter, Space Grotesk)
- **Icons**: Heroicons, Lucide Icons
- **Animations**: GSAP 3.x
- **Inspiration**: Dribbble (search "retro web 2025")

---

**Last Updated**: November 2025
**Version**: 1.0.0
