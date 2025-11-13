/**
 * 🎨 Design System Demo Page
 * Showcases all components and animations from the 2025 Bold Retro design system
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { kineticTypography, staggeredReveal } from '@/animations/designSystem';
import {
  ButtonPrimary,
  ButtonSecondary,
  ButtonGhost,
  Card,
  GlassCard,
  Input,
  TextArea,
  Badge,
  GradientText,
  Section,
  HeroSection,
  Notification,
  Modal,
  Grid,
} from '@/components/design-system/ComponentLibrary';

export default function DesignDemoPage() {
  const [isModalOpen, setModalOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  // Animate on mount
  useEffect(() => {
    if (heroRef.current) {
      const title = heroRef.current.querySelector('h1');
      if (title) {
        kineticTypography(title.children, { stagger: 0.03 });
      }
    }

    if (cardsRef.current) {
      const cards = cardsRef.current.querySelectorAll('.demo-card');
      staggeredReveal(cards, { stagger: 0.1 });
    }
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary text-white">
      {/* Hero Section */}
      <div ref={heroRef}>
        <HeroSection
          title={
            <>
              <GradientText gradient="retro">Bold</GradientText>
              {' & '}
              <GradientText gradient="cyber">Retro</GradientText>
              <br />
              Design System
            </>
          }
          subtitle="Following 2025 trends: Kinetic typography, vibrant gradients, and playful interactions"
          cta={
            <>
              <ButtonPrimary onClick={() => setModalOpen(true)}>
                Open Modal
              </ButtonPrimary>
              <ButtonSecondary>Learn More</ButtonSecondary>
            </>
          }
        />
      </div>

      {/* Buttons Section */}
      <Section>
        <h2 className="text-4xl font-bold mb-8">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <ButtonPrimary>Primary CTA</ButtonPrimary>
          <ButtonSecondary>Secondary</ButtonSecondary>
          <ButtonGhost>Ghost Button</ButtonGhost>
          <ButtonPrimary disabled>Disabled</ButtonPrimary>
        </div>
      </Section>

      {/* Cards Section */}
      <Section className="bg-bg-secondary">
        <h2 className="text-4xl font-bold mb-8">Cards & Layouts</h2>
        <div ref={cardsRef}>
          <Grid cols={3}>
            <Card className="demo-card">
              <h3 className="text-2xl font-bold mb-2">Standard Card</h3>
              <p className="text-white/70">
                With hover effect and neon glow on interaction
              </p>
            </Card>
            <Card className="demo-card" hover={false}>
              <h3 className="text-2xl font-bold mb-2">Static Card</h3>
              <p className="text-white/70">No hover effects applied</p>
            </Card>
            <GlassCard className="demo-card">
              <h3 className="text-2xl font-bold mb-2">Glass Card</h3>
              <p className="text-white/70">Frosted glass morphism effect</p>
            </GlassCard>
          </Grid>
        </div>
      </Section>

      {/* Typography Section */}
      <Section>
        <h2 className="text-4xl font-bold mb-8">Typography</h2>
        <div className="space-y-4">
          <h1 className="text-6xl font-black">
            <GradientText>Display Extra Large</GradientText>
          </h1>
          <h2 className="text-5xl font-bold">Heading 2</h2>
          <h3 className="text-4xl font-bold">Heading 3</h3>
          <h4 className="text-3xl font-semibold">Heading 4</h4>
          <p className="text-xl text-white/70">
            Body text with regular weight and good readability. This is how
            paragraph text looks in the design system.
          </p>
          <p className="text-sm text-white/50">Small helper text</p>
        </div>
      </Section>

      {/* Forms Section */}
      <Section className="bg-bg-secondary">
        <h2 className="text-4xl font-bold mb-8">Form Inputs</h2>
        <div className="max-w-2xl space-y-4">
          <Input placeholder="Enter your email..." />
          <Input placeholder="Password" type="password" />
          <TextArea placeholder="Write your message..." rows={4} />
          <ButtonPrimary>Submit Form</ButtonPrimary>
        </div>
      </Section>

      {/* Badges Section */}
      <Section>
        <h2 className="text-4xl font-bold mb-8">Badges & Labels</h2>
        <div className="flex flex-wrap gap-3">
          <Badge variant="purple">New</Badge>
          <Badge variant="cyan">Beta</Badge>
          <Badge variant="pink">Featured</Badge>
          <Badge variant="amber">Warning</Badge>
          <Badge variant="green">Success</Badge>
        </div>
      </Section>

      {/* Notifications Section */}
      <Section className="bg-bg-secondary">
        <h2 className="text-4xl font-bold mb-8">Notifications</h2>
        <div className="max-w-2xl space-y-4">
          <Notification type="success">
            ✓ Your changes have been saved successfully!
          </Notification>
          <Notification type="error">
            ✗ Something went wrong. Please try again.
          </Notification>
          <Notification type="warning">
            ⚠ Your trial will expire in 3 days
          </Notification>
          <Notification type="info">
            ℹ New features available! Check them out.
          </Notification>
        </div>
      </Section>

      {/* Colors Section */}
      <Section>
        <h2 className="text-4xl font-bold mb-8">Color Palette</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { name: 'Purple', class: 'bg-neon-purple' },
            { name: 'Cyan', class: 'bg-neon-cyan' },
            { name: 'Pink', class: 'bg-neon-pink' },
            { name: 'Amber', class: 'bg-neon-amber' },
            { name: 'Green', class: 'bg-neon-green' },
          ].map((color) => (
            <div key={color.name}>
              <div className={`${color.class} h-24 rounded-xl mb-2`} />
              <p className="text-sm text-white/70">{color.name}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Gradients Section */}
      <Section className="bg-bg-secondary">
        <h2 className="text-4xl font-bold mb-8">Gradient Backgrounds</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'Retro', class: 'bg-gradient-retro' },
            { name: 'Cyber', class: 'bg-gradient-cyber' },
            { name: 'Sunset', class: 'bg-gradient-sunset' },
            { name: 'Matrix', class: 'bg-gradient-matrix' },
          ].map((gradient) => (
            <div
              key={gradient.name}
              className={`${gradient.class} h-32 rounded-2xl flex items-center justify-center`}
            >
              <p className="text-2xl font-bold text-white">{gradient.name}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Animations Info */}
      <Section>
        <h2 className="text-4xl font-bold mb-8">Animations</h2>
        <Card>
          <h3 className="text-2xl font-bold mb-4">GSAP Animation Library</h3>
          <p className="text-white/70 mb-4">
            All components use GSAP for smooth, performant animations. Check
            <code className="mx-1 px-2 py-1 bg-white/10 rounded">
              src/animations/designSystem.ts
            </code>
            for the complete animation library.
          </p>
          <ul className="space-y-2 text-white/70">
            <li>• Kinetic Typography (hero reveals)</li>
            <li>• Fade In Up (default entrance)</li>
            <li>• Staggered Reveals (lists & grids)</li>
            <li>• Neon Glow Pulse (attention)</li>
            <li>• Glitch Effects (retro hover)</li>
            <li>• Page Transitions</li>
          </ul>
        </Card>
      </Section>

      {/* Modal Demo */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Example Modal"
      >
        <p className="text-white/70 mb-6">
          This is an example modal using the design system. It features a
          backdrop blur, smooth entrance animation, and follows the bold retro
          aesthetic.
        </p>
        <div className="flex gap-3">
          <ButtonPrimary onClick={() => setModalOpen(false)}>
            Confirm
          </ButtonPrimary>
          <ButtonGhost onClick={() => setModalOpen(false)}>Cancel</ButtonGhost>
        </div>
      </Modal>

      {/* Footer */}
      <Section className="border-t border-white/10 text-center">
        <p className="text-white/50">
          Built with{' '}
          <GradientText gradient="retro">2025 Bold Retro</GradientText> Design
          System
        </p>
        <p className="text-sm text-white/40 mt-2">
          Tailwind CSS • GSAP • Next.js
        </p>
      </Section>
    </div>
  );
}
