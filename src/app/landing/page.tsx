/**
 * 🍎 Landing Page Example
 * Demonstrates Apple Liquid Glass components in a real application
 */

'use client';

import { useState } from 'react';
import {
  GlassButton,
  GlassPanel,
  GlassCard,
  GlassInput,
  GlassBadge,
  GlassModal,
  GlassNavBar,
  GlassSection,
  GlassHero,
  GlassGrid,
} from '@/components/glass/GlassComponents';

export default function LandingPage() {
  const [isSignUpOpen, setSignUpOpen] = useState(false);
  const [email, setEmail] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary">
      {/* Navigation */}
      <GlassNavBar>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-semibold text-white/95">Mina</h1>
            <nav className="hidden md:flex gap-6">
              <a
                href="#features"
                className="text-[15px] text-white/70 hover:text-white/95 transition-colors duration-200"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-[15px] text-white/70 hover:text-white/95 transition-colors duration-200"
              >
                How It Works
              </a>
              <a
                href="#pricing"
                className="text-[15px] text-white/70 hover:text-white/95 transition-colors duration-200"
              >
                Pricing
              </a>
            </nav>
          </div>

          <div className="flex gap-3">
            <GlassButton variant="glass" color="blue">
              Sign In
            </GlassButton>
            <GlassButton
              variant="filled"
              color="blue"
              onClick={() => setSignUpOpen(true)}
            >
              Get Started
            </GlassButton>
          </div>
        </div>
      </GlassNavBar>

      {/* Hero Section */}
      <GlassHero
        title={
          <>
            Your AI Voice Assistant
            <br />
            with{' '}
            <span className="bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">
              Personality
            </span>
          </>
        }
        subtitle="Have natural conversations with an AI that understands context, remembers your preferences, and adapts to your style."
        cta={
          <>
            <GlassButton
              variant="filled"
              color="blue"
              onClick={() => setSignUpOpen(true)}
            >
              Start Free Trial
            </GlassButton>
            <GlassButton variant="glass" color="purple">
              Watch Demo
            </GlassButton>
          </>
        }
        background={
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-blue/20 rounded-full blur-3xl animate-float-gentle" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-purple/20 rounded-full blur-3xl animate-float-gentle" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-teal/10 rounded-full blur-3xl" />
          </div>
        }
      />

      {/* Features Section */}
      <GlassSection id="features">
        <div className="text-center mb-12">
          <GlassBadge color="blue" className="mb-4">
            Features
          </GlassBadge>
          <h2 className="text-4xl font-semibold text-white/95 mb-4">
            Everything You Need
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Powerful features designed to make your AI conversations natural,
            productive, and enjoyable.
          </p>
        </div>

        <GlassGrid cols={3}>
          <GlassCard>
            <div className="text-4xl mb-4">🎙️</div>
            <h3 className="text-xl font-semibold text-white/95 mb-2">
              Voice Conversations
            </h3>
            <p className="text-[15px] text-white/70 mb-4">
              Speak naturally and get instant voice responses. Just like talking to
              a real assistant.
            </p>
            <GlassBadge color="blue">Core Feature</GlassBadge>
          </GlassCard>

          <GlassCard>
            <div className="text-4xl mb-4">🧠</div>
            <h3 className="text-xl font-semibold text-white/95 mb-2">
              Context Awareness
            </h3>
            <p className="text-[15px] text-white/70 mb-4">
              Mina remembers your conversation history and preferences for truly
              personalized interactions.
            </p>
            <GlassBadge color="purple">AI Powered</GlassBadge>
          </GlassCard>

          <GlassCard>
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold text-white/95 mb-2">
              Lightning Fast
            </h3>
            <p className="text-[15px] text-white/70 mb-4">
              Get responses in milliseconds. No waiting, no loading screens.
            </p>
            <GlassBadge color="teal">Performance</GlassBadge>
          </GlassCard>

          <GlassCard>
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold text-white/95 mb-2">
              Customizable Personality
            </h3>
            <p className="text-[15px] text-white/70 mb-4">
              Choose from different voice styles and personalities to match your
              preferences.
            </p>
            <GlassBadge color="pink">Personalization</GlassBadge>
          </GlassCard>

          <GlassCard>
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold text-white/95 mb-2">
              Privacy First
            </h3>
            <p className="text-[15px] text-white/70 mb-4">
              Your conversations are encrypted and never used for training. Your
              data stays yours.
            </p>
            <GlassBadge color="green">Secure</GlassBadge>
          </GlassCard>

          <GlassCard>
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-semibold text-white/95 mb-2">
              Cross-Platform
            </h3>
            <p className="text-[15px] text-white/70 mb-4">
              Access Mina from any device - desktop, mobile, or tablet. Seamlessly
              synced.
            </p>
            <GlassBadge color="orange">Universal</GlassBadge>
          </GlassCard>
        </GlassGrid>
      </GlassSection>

      {/* How It Works */}
      <GlassSection id="how-it-works" className="bg-bg-secondary/30">
        <div className="text-center mb-12">
          <GlassBadge color="purple" className="mb-4">
            How It Works
          </GlassBadge>
          <h2 className="text-4xl font-semibold text-white/95 mb-4">
            Simple & Intuitive
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Get started in minutes. No complex setup or training required.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          <GlassPanel level={2}>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent-blue flex items-center justify-center text-white font-semibold">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white/95 mb-2">
                  Create Your Account
                </h3>
                <p className="text-[15px] text-white/70">
                  Sign up with your email in seconds. No credit card required for
                  the free trial.
                </p>
              </div>
            </div>
          </GlassPanel>

          <GlassPanel level={2}>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent-purple flex items-center justify-center text-white font-semibold">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white/95 mb-2">
                  Choose Your Voice Style
                </h3>
                <p className="text-[15px] text-white/70">
                  Select from a variety of voice styles and personalities to match
                  your preferences.
                </p>
              </div>
            </div>
          </GlassPanel>

          <GlassPanel level={2}>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent-teal flex items-center justify-center text-white font-semibold">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white/95 mb-2">
                  Start Talking
                </h3>
                <p className="text-[15px] text-white/70">
                  That&apos;s it! Start having natural conversations with your AI
                  assistant right away.
                </p>
              </div>
            </div>
          </GlassPanel>
        </div>
      </GlassSection>

      {/* CTA Section */}
      <GlassSection>
        <GlassPanel level={3} className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-semibold text-white/95 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-white/70 mb-8">
            Join thousands of users who are already having better conversations
            with AI.
          </p>

          <div className="flex gap-4 justify-center mb-6">
            <GlassButton
              variant="filled"
              color="blue"
              onClick={() => setSignUpOpen(true)}
            >
              Start Free Trial
            </GlassButton>
            <GlassButton variant="glass" color="blue">
              Schedule Demo
            </GlassButton>
          </div>

          <p className="text-sm text-white/50">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </GlassPanel>
      </GlassSection>

      {/* Footer */}
      <GlassSection className="border-t border-white/10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h3 className="text-xl font-semibold text-white/95 mb-2">Mina</h3>
            <p className="text-sm text-white/60">
              Your AI voice assistant with personality
            </p>
          </div>

          <div className="flex gap-8">
            <a
              href="#"
              className="text-sm text-white/60 hover:text-white/95 transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-sm text-white/60 hover:text-white/95 transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-sm text-white/60 hover:text-white/95 transition-colors"
            >
              Contact
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-sm text-white/50">
            © 2025 Mina. Built with{' '}
            <span className="bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent font-semibold">
              Apple Liquid Glass
            </span>
          </p>
        </div>
      </GlassSection>

      {/* Sign Up Modal */}
      <GlassModal
        isOpen={isSignUpOpen}
        onClose={() => setSignUpOpen(false)}
        title="Start Your Free Trial"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-[15px] text-white/80">
            Create your account and start having better conversations with AI.
          </p>

          <GlassInput
            placeholder="Your name"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <GlassInput
            placeholder="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <GlassInput placeholder="Create password" type="password" />

          <div className="flex items-start gap-2 pt-2">
            <input
              type="checkbox"
              id="terms"
              className="mt-1 rounded border-white/20 bg-glass-thin"
            />
            <label htmlFor="terms" className="text-sm text-white/70">
              I agree to the Terms of Service and Privacy Policy
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <GlassButton
              variant="filled"
              color="blue"
              onClick={() => setSignUpOpen(false)}
            >
              Create Account
            </GlassButton>
            <GlassButton variant="glass" onClick={() => setSignUpOpen(false)}>
              Cancel
            </GlassButton>
          </div>

          <p className="text-xs text-white/50 text-center pt-2">
            No credit card required • 14-day free trial
          </p>
        </div>
      </GlassModal>
    </div>
  );
}
