/**
 * 🎨 Component Library - 2025 Bold Retro Design System
 * Reusable components following the unified design language
 */

import React from 'react';

// ═══════════════════════════════════════════════════════════
// 🔘 BUTTONS
// ═══════════════════════════════════════════════════════════

export const ButtonPrimary: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}> = ({ children, onClick, disabled, className = '' }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      px-6 py-3
      bg-gradient-retro
      text-white font-bold text-lg
      rounded-full
      transform transition-all duration-300
      hover:scale-105 hover:shadow-neon-purple
      active:scale-95
      disabled:opacity-50 disabled:cursor-not-allowed
      ${className}
    `}
  >
    {children}
  </button>
);

export const ButtonSecondary: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}> = ({ children, onClick, className = '' }) => (
  <button
    onClick={onClick}
    className={`
      px-6 py-3
      border-2 border-neon-purple
      text-neon-purple font-semibold
      rounded-full
      hover:bg-neon-purple/10
      transition-all duration-300
      ${className}
    `}
  >
    {children}
  </button>
);

export const ButtonGhost: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}> = ({ children, onClick, className = '' }) => (
  <button
    onClick={onClick}
    className={`
      px-4 py-2
      text-white/70 font-medium
      hover:text-white hover:bg-white/5
      rounded-lg transition-all duration-300
      ${className}
    `}
  >
    {children}
  </button>
);

// ═══════════════════════════════════════════════════════════
// 🃏 CARDS
// ═══════════════════════════════════════════════════════════

export const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}> = ({ children, className = '', hover = true }) => (
  <div
    className={`
      p-6
      bg-bg-tertiary border border-white/10
      rounded-2xl
      ${
        hover
          ? 'hover:border-neon-purple/50 transform transition-all duration-500 hover:translate-y-[-4px] hover:shadow-glow-lg'
          : ''
      }
      ${className}
    `}
  >
    {children}
  </div>
);

export const GlassCard: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div
    className={`
      p-6
      bg-white/5 backdrop-blur-md
      border border-white/10
      rounded-2xl
      ${className}
    `}
  >
    {children}
  </div>
);

// ═══════════════════════════════════════════════════════════
// 📝 INPUTS
// ═══════════════════════════════════════════════════════════

export const Input: React.FC<{
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}> = ({ type = 'text', placeholder, value, onChange, className = '' }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`
      w-full px-4 py-3
      bg-white/5 border border-white/20
      text-white placeholder:text-white/40
      rounded-xl
      focus:border-neon-purple focus:bg-white/10
      focus:outline-none focus:ring-2 focus:ring-neon-purple/50
      transition-all duration-300
      ${className}
    `}
  />
);

export const TextArea: React.FC<{
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  className?: string;
}> = ({ placeholder, value, onChange, rows = 4, className = '' }) => (
  <textarea
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    rows={rows}
    className={`
      w-full px-4 py-3
      bg-white/5 border border-white/20
      text-white placeholder:text-white/40
      rounded-xl
      focus:border-neon-purple focus:bg-white/10
      focus:outline-none focus:ring-2 focus:ring-neon-purple/50
      transition-all duration-300
      resize-none
      ${className}
    `}
  />
);

// ═══════════════════════════════════════════════════════════
// 🎯 BADGES
// ═══════════════════════════════════════════════════════════

export const Badge: React.FC<{
  children: React.ReactNode;
  variant?: 'purple' | 'cyan' | 'pink' | 'amber' | 'green';
  className?: string;
}> = ({ children, variant = 'purple', className = '' }) => {
  const variants = {
    purple: 'bg-neon-purple/20 text-neon-purple border-neon-purple/30',
    cyan: 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30',
    pink: 'bg-neon-pink/20 text-neon-pink border-neon-pink/30',
    amber: 'bg-neon-amber/20 text-neon-amber border-neon-amber/30',
    green: 'bg-neon-green/20 text-neon-green border-neon-green/30',
  };

  return (
    <span
      className={`
      inline-block px-3 py-1
      ${variants[variant]}
      border rounded-full
      text-xs font-semibold uppercase tracking-wide
      ${className}
    `}
    >
      {children}
    </span>
  );
};

// ═══════════════════════════════════════════════════════════
// 🎨 GRADIENT TEXT
// ═══════════════════════════════════════════════════════════

export const GradientText: React.FC<{
  children: React.ReactNode;
  gradient?: 'retro' | 'cyber' | 'sunset' | 'matrix';
  className?: string;
}> = ({ children, gradient = 'retro', className = '' }) => {
  const gradients = {
    retro: 'bg-gradient-retro',
    cyber: 'bg-gradient-cyber',
    sunset: 'bg-gradient-sunset',
    matrix: 'bg-gradient-matrix',
  };

  return (
    <span
      className={`
      ${gradients[gradient]}
      bg-clip-text text-transparent
      ${className}
    `}
    >
      {children}
    </span>
  );
};

// ═══════════════════════════════════════════════════════════
// 📰 SECTION CONTAINER
// ═══════════════════════════════════════════════════════════

export const Section: React.FC<{
  children: React.ReactNode;
  className?: string;
  id?: string;
}> = ({ children, className = '', id }) => (
  <section
    id={id}
    className={`
      py-16 md:py-24 px-4
      ${className}
    `}
  >
    <div className="max-w-7xl mx-auto">{children}</div>
  </section>
);

// ═══════════════════════════════════════════════════════════
// 🏆 HERO SECTION
// ═══════════════════════════════════════════════════════════

export const HeroSection: React.FC<{
  title: React.ReactNode;
  subtitle?: string;
  cta?: React.ReactNode;
  className?: string;
}> = ({ title, subtitle, cta, className = '' }) => (
  <section
    className={`
      min-h-screen flex items-center justify-center
      px-4 py-20
      ${className}
    `}
  >
    <div className="max-w-6xl mx-auto text-center">
      <h1
        className="
        text-5xl md:text-7xl lg:text-8xl
        font-black leading-tight
        mb-6
      "
      >
        {title}
      </h1>

      {subtitle && (
        <p
          className="
          text-xl md:text-2xl
          text-white/70
          max-w-2xl mx-auto mb-8
        "
        >
          {subtitle}
        </p>
      )}

      {cta && <div className="flex gap-4 justify-center">{cta}</div>}
    </div>
  </section>
);

// ═══════════════════════════════════════════════════════════
// 🔔 NOTIFICATION / TOAST
// ═══════════════════════════════════════════════════════════

export const Notification: React.FC<{
  children: React.ReactNode;
  type?: 'success' | 'error' | 'warning' | 'info';
  className?: string;
}> = ({ children, type = 'info', className = '' }) => {
  const types = {
    success: 'bg-neon-green/20 border-neon-green text-neon-green',
    error: 'bg-neon-pink/20 border-neon-pink text-neon-pink',
    warning: 'bg-neon-amber/20 border-neon-amber text-neon-amber',
    info: 'bg-neon-cyan/20 border-neon-cyan text-neon-cyan',
  };

  return (
    <div
      className={`
      p-4
      ${types[type]}
      border rounded-xl
      animate-fade-in-down
      ${className}
    `}
    >
      {children}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// 🎯 MODAL / DIALOG
// ═══════════════════════════════════════════════════════════

export const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-fade-in-down"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="
        relative z-10
        max-w-lg w-full
        bg-bg-tertiary border border-white/20
        rounded-3xl p-8
        shadow-glow-xl
        animate-scale-in
      "
      >
        {title && (
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{title}</h2>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// 📊 GRID LAYOUTS
// ═══════════════════════════════════════════════════════════

export const Grid: React.FC<{
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4;
  gap?: number;
  className?: string;
}> = ({ children, cols = 3, gap = 6, className = '' }) => {
  const colsClass = {
    1: 'grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${colsClass[cols]} gap-${gap} ${className}`}>
      {children}
    </div>
  );
};
