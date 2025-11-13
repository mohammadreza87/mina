/**
 * 🍎 Apple Liquid Glass Demo Page
 * Showcases all glass components following Apple&apos;s 2025 design language
 */

'use client';

import { useState } from 'react';
import {
  GlassButton,
  GlassPanel,
  GlassCard,
  GlassInput,
  GlassTextArea,
  GlassBadge,
  GlassNotification,
  GlassModal,
  GlassNavBar,
  GlassSection,
  GlassHero,
  GlassGrid,
} from '@/components/glass/GlassComponents';

export default function GlassDemoPage() {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary">
      {/* Navigation */}
      <GlassNavBar>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-white/95">Apple Liquid Glass</h1>
          <div className="flex gap-3">
            <GlassButton variant="glass" color="blue">
              Sign In
            </GlassButton>
            <GlassButton variant="filled" color="blue">
              Get Started
            </GlassButton>
          </div>
        </div>
      </GlassNavBar>

      {/* Hero Section */}
      <GlassHero
        title={
          <>
            Welcome to{' '}
            <span className="bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">
              Liquid Glass
            </span>
          </>
        }
        subtitle="Premium glassmorphism components inspired by Apple&apos;s 2025 design language. Refined, minimal, and beautiful."
        cta={
          <>
            <GlassButton onClick={() => setModalOpen(true)} color="blue">
              Open Modal
            </GlassButton>
            <GlassButton variant="glass" color="purple">
              Learn More
            </GlassButton>
          </>
        }
        background={
          <div className="absolute inset-0 overflow-hidden">
            {/* Gradient orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-blue/20 rounded-full blur-3xl animate-float-gentle" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-purple/20 rounded-full blur-3xl animate-float-gentle" />
          </div>
        }
      />

      {/* Buttons Section */}
      <GlassSection>
        <h2 className="text-3xl font-semibold text-white/95 mb-6">Buttons</h2>
        <div className="space-y-6">
          <div>
            <p className="text-sm text-white/60 mb-3">Filled Variants</p>
            <div className="flex flex-wrap gap-3">
              <GlassButton variant="filled" color="blue">
                iOS Blue
              </GlassButton>
              <GlassButton variant="filled" color="purple">
                Soft Purple
              </GlassButton>
              <GlassButton variant="filled" color="pink">
                Warm Pink
              </GlassButton>
              <GlassButton variant="filled" color="teal">
                Cool Teal
              </GlassButton>
              <GlassButton variant="filled" color="blue" disabled>
                Disabled
              </GlassButton>
            </div>
          </div>

          <div>
            <p className="text-sm text-white/60 mb-3">Glass Variants</p>
            <div className="flex flex-wrap gap-3">
              <GlassButton variant="glass">Glass Button</GlassButton>
              <GlassButton variant="glass">Secondary Action</GlassButton>
              <GlassButton variant="glass" disabled>
                Disabled
              </GlassButton>
            </div>
          </div>

          <div>
            <p className="text-sm text-white/60 mb-3">Minimal Variants</p>
            <div className="flex flex-wrap gap-3">
              <GlassButton variant="minimal" color="blue">
                Link Style
              </GlassButton>
              <GlassButton variant="minimal" color="purple">
                Tertiary
              </GlassButton>
              <GlassButton variant="minimal" color="pink">
                Subtle Action
              </GlassButton>
            </div>
          </div>
        </div>
      </GlassSection>

      {/* Panels & Cards */}
      <GlassSection className="bg-bg-secondary/30">
        <h2 className="text-3xl font-semibold text-white/95 mb-6">Panels & Cards</h2>
        <GlassGrid cols={3}>
          <GlassPanel level={1}>
            <h3 className="text-lg font-semibold text-white/95 mb-2">Ultra Thin Glass</h3>
            <p className="text-[15px] text-white/70">
              Level 1 - Subtle overlay with minimal blur. Perfect for tooltips and badges.
            </p>
          </GlassPanel>

          <GlassPanel level={2}>
            <h3 className="text-lg font-semibold text-white/95 mb-2">Thin Glass</h3>
            <p className="text-[15px] text-white/70">
              Level 2 - Standard panel. Great for cards, sidebars, and navigation.
            </p>
          </GlassPanel>

          <GlassPanel level={3}>
            <h3 className="text-lg font-semibold text-white/95 mb-2">Regular Glass</h3>
            <p className="text-[15px] text-white/70">
              Level 3 - Elevated panel. Ideal for modals and floating elements.
            </p>
          </GlassPanel>

          <GlassPanel level={4}>
            <h3 className="text-lg font-semibold text-white/95 mb-2">Thick Glass</h3>
            <p className="text-[15px] text-white/70">
              Level 4 - Maximum emphasis. Use for app windows and overlays.
            </p>
          </GlassPanel>

          <GlassCard hover={false}>
            <h3 className="text-lg font-semibold text-white/95 mb-2">Static Card</h3>
            <p className="text-[15px] text-white/70">
              No hover effects. Use for informational content.
            </p>
          </GlassCard>

          <GlassCard>
            <h3 className="text-lg font-semibold text-white/95 mb-2">Interactive Card</h3>
            <p className="text-[15px] text-white/70">
              Hover to see smooth transition and lift effect.
            </p>
          </GlassCard>
        </GlassGrid>
      </GlassSection>

      {/* Form Inputs */}
      <GlassSection>
        <h2 className="text-3xl font-semibold text-white/95 mb-6">Form Inputs</h2>
        <div className="max-w-2xl space-y-4">
          <GlassInput placeholder="Email address" type="email" />
          <GlassInput placeholder="Password" type="password" />
          <GlassInput placeholder="Search..." type="search" />
          <GlassTextArea placeholder="Write your message here..." rows={4} />
          <div className="flex gap-3">
            <GlassButton variant="filled" color="blue">
              Submit
            </GlassButton>
            <GlassButton variant="glass">Cancel</GlassButton>
          </div>
        </div>
      </GlassSection>

      {/* Badges */}
      <GlassSection className="bg-bg-secondary/30">
        <h2 className="text-3xl font-semibold text-white/95 mb-6">Badges</h2>
        <div className="flex flex-wrap gap-3">
          <GlassBadge color="blue">New</GlassBadge>
          <GlassBadge color="purple">Beta</GlassBadge>
          <GlassBadge color="pink">Featured</GlassBadge>
          <GlassBadge color="teal">Updated</GlassBadge>
          <GlassBadge color="green">Success</GlassBadge>
          <GlassBadge color="orange">Warning</GlassBadge>
        </div>
      </GlassSection>

      {/* Notifications */}
      <GlassSection>
        <h2 className="text-3xl font-semibold text-white/95 mb-6">Notifications</h2>
        <div className="max-w-2xl space-y-4">
          <GlassNotification type="success">
            Your changes have been saved successfully.
          </GlassNotification>
          <GlassNotification type="error">
            Something went wrong. Please try again.
          </GlassNotification>
          <GlassNotification type="warning">
            Your trial will expire in 3 days.
          </GlassNotification>
          <GlassNotification type="info">
            New features are now available. Check them out!
          </GlassNotification>
        </div>
      </GlassSection>

      {/* Color Palette */}
      <GlassSection className="bg-bg-secondary/30">
        <h2 className="text-3xl font-semibold text-white/95 mb-6">Color Palette</h2>
        <GlassGrid cols={3}>
          <GlassPanel level={2}>
            <div className="w-16 h-16 rounded-xl bg-accent-blue mb-3" />
            <h4 className="text-sm font-semibold text-white/95">iOS Blue</h4>
            <p className="text-xs text-white/60">#007AFF</p>
          </GlassPanel>

          <GlassPanel level={2}>
            <div className="w-16 h-16 rounded-xl bg-accent-purple mb-3" />
            <h4 className="text-sm font-semibold text-white/95">Soft Purple</h4>
            <p className="text-xs text-white/60">#AF52DE</p>
          </GlassPanel>

          <GlassPanel level={2}>
            <div className="w-16 h-16 rounded-xl bg-accent-pink mb-3" />
            <h4 className="text-sm font-semibold text-white/95">Warm Pink</h4>
            <p className="text-xs text-white/60">#FF375F</p>
          </GlassPanel>

          <GlassPanel level={2}>
            <div className="w-16 h-16 rounded-xl bg-accent-teal mb-3" />
            <h4 className="text-sm font-semibold text-white/95">Cool Teal</h4>
            <p className="text-xs text-white/60">#30D5C8</p>
          </GlassPanel>

          <GlassPanel level={2}>
            <div className="w-16 h-16 rounded-xl bg-accent-green mb-3" />
            <h4 className="text-sm font-semibold text-white/95">Success Green</h4>
            <p className="text-xs text-white/60">#34C759</p>
          </GlassPanel>

          <GlassPanel level={2}>
            <div className="w-16 h-16 rounded-xl bg-accent-orange mb-3" />
            <h4 className="text-sm font-semibold text-white/95">Vibrant Orange</h4>
            <p className="text-xs text-white/60">#FF9500</p>
          </GlassPanel>
        </GlassGrid>
      </GlassSection>

      {/* Design Principles */}
      <GlassSection>
        <h2 className="text-3xl font-semibold text-white/95 mb-6">Design Principles</h2>
        <GlassGrid cols={2}>
          <GlassCard>
            <h3 className="text-xl font-semibold text-white/95 mb-3">
              Depth & Layering
            </h3>
            <p className="text-[15px] text-white/70 mb-4">
              Elements float in space with clear hierarchy. Glass materials create
              separation through depth, not borders.
            </p>
            <GlassBadge color="blue">Core Principle</GlassBadge>
          </GlassCard>

          <GlassCard>
            <h3 className="text-xl font-semibold text-white/95 mb-3">
              Adaptive Materials
            </h3>
            <p className="text-[15px] text-white/70 mb-4">
              Glass responds to background, light, and context. Frosted effects use
              real backdrop-filter for authentic depth.
            </p>
            <GlassBadge color="purple">Core Principle</GlassBadge>
          </GlassCard>

          <GlassCard>
            <h3 className="text-xl font-semibold text-white/95 mb-3">
              Refined Minimalism
            </h3>
            <p className="text-[15px] text-white/70 mb-4">
              Less is more. Every pixel matters. Generous spacing, subtle borders,
              and thoughtful typography create breathing room.
            </p>
            <GlassBadge color="pink">Core Principle</GlassBadge>
          </GlassCard>

          <GlassCard>
            <h3 className="text-xl font-semibold text-white/95 mb-3">
              Smooth Interactions
            </h3>
            <p className="text-[15px] text-white/70 mb-4">
              Quick transitions (200-300ms) with Apple&apos;s signature easing curves.
              Subtle hover effects that feel responsive, not jarring.
            </p>
            <GlassBadge color="teal">Core Principle</GlassBadge>
          </GlassCard>
        </GlassGrid>
      </GlassSection>

      {/* Implementation Details */}
      <GlassSection className="bg-bg-secondary/30">
        <h2 className="text-3xl font-semibold text-white/95 mb-6">
          Implementation Details
        </h2>
        <GlassPanel level={3}>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-white/95 mb-2">
                Typography
              </h4>
              <p className="text-[15px] text-white/70">
                Apple-precise type scale: 11px, 13px, 15px, 17px, 20px, 24px. Uses
                Inter font as SF Pro alternative with tight tracking on large text.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white/95 mb-2">
                Glass Materials
              </h4>
              <p className="text-[15px] text-white/70">
                4 levels of opacity (0.05 to 0.18) with backdrop-blur and
                backdrop-saturate for authentic frosted glass effect.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white/95 mb-2">Shadows</h4>
              <p className="text-[15px] text-white/70">
                Soft, large spread shadows (0 8px 32px) with low opacity. Colored
                shadows for accent buttons.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white/95 mb-2">
                Animations
              </h4>
              <p className="text-[15px] text-white/70">
                Quick durations (200-300ms) with cubic-bezier(0.4, 0, 0.2, 1)
                easing. Subtle scale and translate transforms.
              </p>
            </div>
          </div>
        </GlassPanel>
      </GlassSection>

      {/* Footer */}
      <GlassSection className="border-t border-white/10 text-center">
        <p className="text-white/60">
          Built with{' '}
          <span className="bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent font-semibold">
            Apple Liquid Glass
          </span>{' '}
          Design System
        </p>
        <p className="text-sm text-white/50 mt-2">
          Tailwind CSS • Next.js • Inspired by iOS 26 & visionOS 26
        </p>
      </GlassSection>

      {/* Modal Demo */}
      <GlassModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Apple Liquid Glass Modal"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-[15px] text-white/80">
            This modal demonstrates the premium glassmorphism effect with backdrop
            blur, smooth entrance animation, and refined Apple aesthetics.
          </p>

          <GlassInput placeholder="Enter your email..." type="email" />

          <GlassNotification type="info">
            All interactions follow Apple&apos;s Human Interface Guidelines
          </GlassNotification>

          <div className="flex gap-3 pt-4">
            <GlassButton
              variant="filled"
              color="blue"
              onClick={() => setModalOpen(false)}
            >
              Confirm
            </GlassButton>
            <GlassButton variant="glass" onClick={() => setModalOpen(false)}>
              Cancel
            </GlassButton>
          </div>
        </div>
      </GlassModal>
    </div>
  );
}
