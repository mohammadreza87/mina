/**
 * 🍎 Authentication Page
 * Beautiful responsive sign-in/sign-up with Apple Liquid Glass design
 */

'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  GlassPanel,
  GlassInput,
  GlassNotification,
  GlassButton,
} from '@/components/glass/GlassComponents';

type AuthMode = 'signin' | 'signup';

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (mode === 'signup' && !name) {
      setError('Please enter your name');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'signup') {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name }),
        });

        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          throw new Error(body.error || 'Failed to create account');
        }

        setSuccess('Account created! Signing you in...');
      }

      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        const message =
          result.error === 'CredentialsSignin' ? 'Invalid email or password' : result.error;
        throw new Error(message);
      }

      setSuccess('Signed in successfully!');
      router.push('/');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Authentication failed';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      await signIn('google', { callbackUrl: '/' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleAuth = () => {
    console.log('Apple auth');
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary">
      {/* Decorative background - fixed positioning with lower z-index */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute -top-20 -left-20 w-72 h-72 md:w-96 md:h-96 bg-accent-blue/20 rounded-full blur-3xl"
          style={{ animation: 'float-gentle 8s ease-in-out infinite' }}
        />
        <div
          className="absolute -bottom-20 -right-20 w-72 h-72 md:w-96 md:h-96 bg-accent-purple/20 rounded-full blur-3xl"
          style={{ animation: 'float-gentle 8s ease-in-out infinite 2s' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] md:w-[700px] md:h-[700px] bg-accent-teal/10 rounded-full blur-3xl"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 md:p-6">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-white/95 mb-3 tracking-tight">
              Mina
            </h1>
            <p className="text-sm sm:text-[15px] text-white/70">
              Your AI voice assistant with personality
            </p>
          </div>

          {/* Auth Panel */}
          <GlassPanel level={3} className="p-6 md:p-8" hover={false}>
            {/* Mode Toggle */}
            <div className="flex gap-2 mb-8 p-1 bg-glass-ultra-thin rounded-lg">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setError('');
                  setSuccess('');
                }}
                className={`
                  flex-1 py-2.5 rounded-lg text-[15px] font-semibold
                  transition-all duration-200 ease-apple
                  ${
                    mode === 'signin'
                      ? 'bg-glass-regular text-white/95 shadow-sm'
                      : 'text-white/60 hover:text-white/90'
                  }
                `}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setError('');
                  setSuccess('');
                }}
                className={`
                  flex-1 py-2.5 rounded-lg text-[15px] font-semibold
                  transition-all duration-200 ease-apple
                  ${
                    mode === 'signup'
                      ? 'bg-glass-regular text-white/95 shadow-sm'
                      : 'text-white/60 hover:text-white/90'
                  }
                `}
              >
                Sign Up
              </button>
            </div>

            {/* OAuth Buttons */}
            <div className="space-y-3 mb-6">
              {/* Apple Sign In */}
              <button
                type="button"
                onClick={handleAppleAuth}
                className="
                  w-full px-5 py-3 rounded-lg
                  bg-white text-black
                  font-semibold text-sm sm:text-[15px]
                  transition-all duration-200 ease-apple
                  hover:shadow-lg hover:-translate-y-0.5
                  active:scale-[0.98]
                  flex items-center justify-center gap-2 sm:gap-3
                "
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                <span className="truncate">Continue with Apple</span>
              </button>

              {/* Google Sign In */}
              <GlassButton
                variant="glass"
                onClick={handleGoogleAuth}
                className="w-full flex items-center justify-center gap-2 sm:gap-3"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="truncate">Continue with Google</span>
              </GlassButton>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-bg-tertiary/95 text-white/50 text-[13px]">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleEmailAuth} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs sm:text-sm text-white/70 mb-2"
                  >
                    Full Name
                  </label>
                  <GlassInput
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block text-xs sm:text-sm text-white/70 mb-2"
                >
                  Email Address
                </label>
                <GlassInput
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-xs sm:text-sm text-white/70 mb-2"
                >
                  Password
                </label>
                <GlassInput
                  id="password"
                  type="password"
                  placeholder={mode === 'signup' ? 'At least 8 characters' : '••••••••'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {mode === 'signin' && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm">
                  <label className="flex items-center gap-2 text-white/70 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-white/20 bg-glass-thin text-accent-blue focus:ring-2 focus:ring-accent-blue/30"
                    />
                    <span>Remember me</span>
                  </label>
                  <button
                    type="button"
                    className="text-accent-blue hover:text-accent-blue/80 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {mode === 'signup' && (
                <div className="flex items-start gap-2 text-xs sm:text-sm">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mt-0.5 w-4 h-4 rounded border-white/20 bg-glass-thin text-accent-blue focus:ring-2 focus:ring-accent-blue/30"
                    required
                  />
                  <label htmlFor="terms" className="text-white/70 leading-relaxed">
                    I agree to the{' '}
                    <a href="#" className="text-accent-blue hover:underline">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-accent-blue hover:underline">
                      Privacy Policy
                    </a>
                  </label>
                </div>
              )}

              {/* Notifications */}
              {error && (
                <GlassNotification type="error" onClose={() => setError('')}>
                  {error}
                </GlassNotification>
              )}

              {success && (
                <GlassNotification type="success" onClose={() => setSuccess('')}>
                  {success}
                </GlassNotification>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="
                  w-full px-5 py-3 rounded-lg
                  bg-gradient-to-b from-accent-blue to-[#0051D5]
                  text-white font-semibold text-sm sm:text-[15px]
                  shadow-md shadow-accent-blue/30
                  transition-all duration-200 ease-apple
                  hover:shadow-lg hover:shadow-accent-blue/40 hover:-translate-y-0.5
                  active:scale-[0.98]
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-md
                  flex items-center justify-center gap-2
                "
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>{mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                )}
              </button>
            </form>

            {/* Footer Links */}
            <div className="mt-6 pt-6 border-t border-white/10 text-center text-xs sm:text-sm">
              {mode === 'signin' ? (
                <p className="text-white/70">
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup');
                      setError('');
                      setSuccess('');
                    }}
                    className="text-accent-blue font-semibold hover:text-accent-blue/80 transition-colors"
                  >
                    Sign up
                  </button>
                </p>
              ) : (
                <p className="text-white/70">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signin');
                      setError('');
                      setSuccess('');
                    }}
                    className="text-accent-blue font-semibold hover:text-accent-blue/80 transition-colors"
                  >
                    Sign in
                  </button>
                </p>
              )}
            </div>
          </GlassPanel>

          {/* Bottom Info */}
          <div className="mt-6 text-center px-4">
            <p className="text-xs sm:text-sm text-white/50 leading-relaxed">
              {mode === 'signup' ? (
                <>
                  By signing up, you agree to our Terms of Service
                  <br className="hidden sm:block" />
                  <span className="sm:hidden"> </span>
                  and acknowledge our Privacy Policy
                </>
              ) : (
                <>
                  Secure authentication powered by industry standards
                  <br className="hidden sm:block" />
                  <span className="sm:hidden"> </span>
                  Your data is encrypted and protected
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
