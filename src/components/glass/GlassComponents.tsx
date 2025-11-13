/**
 * 🍎 Apple Liquid Glass Component Library
 * Premium glassmorphism components
 */

import React from 'react';

// ═══════════════════════════════════════════════════════════
// 🔘 GLASS BUTTONS
// ═══════════════════════════════════════════════════════════

export const GlassButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'filled' | 'glass' | 'minimal';
  color?: 'blue' | 'purple' | 'pink' | 'teal';
  disabled?: boolean;
  className?: string;
}> = ({
  children,
  onClick,
  variant = 'filled',
  color = 'blue',
  disabled,
  className = '',
}) => {
  const colors = {
    blue: 'bg-gradient-blue',
    purple: 'bg-gradient-purple',
    pink: 'bg-gradient-pink',
    teal: 'bg-gradient-teal',
  };

  if (variant === 'filled') {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`
          px-5 py-2.5 rounded-lg
          ${colors[color]}
          text-white font-semibold text-[15px]
          shadow-accent-${color}
          transition-all duration-200 ease-apple
          hover:shadow-lg hover:-translate-y-0.5
          active:scale-95
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
      >
        {children}
      </button>
    );
  }

  if (variant === 'glass') {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`
          px-5 py-2.5 rounded-lg
          bg-glass-thin backdrop-blur-md backdrop-saturate-180
          border border-white/10
          text-white/90 font-semibold text-[15px]
          transition-all duration-200 ease-apple
          hover:bg-glass-regular hover:border-white/20
          active:scale-95
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-2 rounded-lg
        text-accent-${color} font-semibold text-[15px]
        transition-all duration-200 ease-apple
        hover:bg-accent-${color}/10
        active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  );
};

// ═══════════════════════════════════════════════════════════
// 🃏 GLASS PANELS / CARDS
// ═══════════════════════════════════════════════════════════

export const GlassPanel: React.FC<{
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4;
  hover?: boolean;
  className?: string;
}> = ({ children, level = 2, hover = true, className = '' }) => {
  const levels = {
    1: 'bg-glass-ultra-thin backdrop-blur-sm',
    2: 'bg-glass-thin backdrop-blur-md',
    3: 'bg-glass-regular backdrop-blur-lg',
    4: 'bg-glass-thick backdrop-blur-xl',
  };

  const shadows = {
    1: 'shadow-xs',
    2: 'shadow-sm',
    3: 'shadow-md',
    4: 'shadow-lg',
  };

  return (
    <div
      className={`
        ${levels[level]} backdrop-saturate-180
        border border-white/10
        rounded-xl p-5
        ${shadows[level]}
        ${
          hover
            ? 'transition-all duration-300 ease-apple hover:bg-glass-regular hover:border-white/20 hover:shadow-lg hover:-translate-y-1'
            : ''
        }
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export const GlassCard = GlassPanel; // Alias

// ═══════════════════════════════════════════════════════════
// 📝 GLASS INPUTS
// ═══════════════════════════════════════════════════════════

export const GlassInput: React.FC<{
  id?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}> = ({ id, type = 'text', placeholder, value, onChange, className = '' }) => (
  <input
    id={id}
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`
      w-full px-4 py-3 rounded-lg
      bg-glass-ultra-thin backdrop-blur-sm backdrop-saturate-180
      border border-white/10
      text-white/90 placeholder:text-white/40
      text-[15px]
      transition-all duration-200 ease-apple
      focus:bg-glass-thin focus:border-accent-blue focus:outline-none
      focus:ring-4 focus:ring-accent-blue/10
      ${className}
    `}
  />
);

export const GlassTextArea: React.FC<{
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
      w-full px-4 py-3 rounded-lg
      bg-glass-ultra-thin backdrop-blur-sm backdrop-saturate-180
      border border-white/10
      text-white/90 placeholder:text-white/40
      text-[15px]
      transition-all duration-200 ease-apple
      focus:bg-glass-thin focus:border-accent-blue focus:outline-none
      focus:ring-4 focus:ring-accent-blue/10
      resize-none
      ${className}
    `}
  />
);

// ═══════════════════════════════════════════════════════════
// 🏷️ GLASS BADGE
// ═══════════════════════════════════════════════════════════

export const GlassBadge: React.FC<{
  children: React.ReactNode;
  color?: 'blue' | 'purple' | 'pink' | 'teal' | 'green' | 'orange';
  className?: string;
}> = ({ children, color = 'blue', className = '' }) => {
  const colors = {
    blue: 'bg-accent-blue/15 text-accent-blue border-accent-blue/20',
    purple: 'bg-accent-purple/15 text-accent-purple border-accent-purple/20',
    pink: 'bg-accent-pink/15 text-accent-pink border-accent-pink/20',
    teal: 'bg-accent-teal/15 text-accent-teal border-accent-teal/20',
    green: 'bg-accent-green/15 text-accent-green border-accent-green/20',
    orange: 'bg-accent-orange/15 text-accent-orange border-accent-orange/20',
  };

  return (
    <span
      className={`
      inline-flex items-center px-2.5 py-1
      ${colors[color]}
      backdrop-blur-sm
      border rounded-full
      text-xs font-semibold
      ${className}
    `}
    >
      {children}
    </span>
  );
};

// ═══════════════════════════════════════════════════════════
// 🔔 GLASS NOTIFICATION
// ═══════════════════════════════════════════════════════════

export const GlassNotification: React.FC<{
  children: React.ReactNode;
  type?: 'success' | 'error' | 'warning' | 'info';
  onClose?: () => void;
  className?: string;
}> = ({ children, type = 'info', onClose, className = '' }) => {
  const types = {
    success: 'border-accent-green/30',
    error: 'border-accent-red/30',
    warning: 'border-accent-orange/30',
    info: 'border-accent-blue/30',
  };

  return (
    <div
      className={`
        p-4 rounded-xl
        bg-glass-regular backdrop-blur-lg backdrop-saturate-180
        border-2 ${types[type]}
        shadow-md
        animate-slide-down
        ${className}
      `}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 text-sm text-white/90">{children}</div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white/90 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// 🪟 GLASS MODAL
// ═══════════════════════════════════════════════════════════

export const GlassModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg';
}> = ({ isOpen, onClose, children, title, size = 'md' }) => {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`
          relative z-10 w-full ${sizes[size]}
          bg-bg-tertiary/95 backdrop-blur-xl backdrop-saturate-200
          border border-white/15
          rounded-2xl p-6
          shadow-2xl
          animate-fade-scale
        `}
      >
        {title && (
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-white/10">
            <h2 className="text-xl font-semibold text-white/95">{title}</h2>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white/90 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className="text-white/80">{children}</div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// 🧭 GLASS NAVIGATION BAR
// ═══════════════════════════════════════════════════════════

export const GlassNavBar: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <nav
    className={`
      bg-glass-thin backdrop-blur-md backdrop-saturate-180
      border-b border-white/10
      px-6 py-4
      sticky top-0 z-40
      ${className}
    `}
  >
    {children}
  </nav>
);

// ═══════════════════════════════════════════════════════════
// 📐 GLASS SECTION
// ═══════════════════════════════════════════════════════════

export const GlassSection: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <section className={`py-16 md:py-24 px-4 ${className}`}>
    <div className="max-w-7xl mx-auto">{children}</div>
  </section>
);

// ═══════════════════════════════════════════════════════════
// 🏆 GLASS HERO SECTION
// ═══════════════════════════════════════════════════════════

export const GlassHero: React.FC<{
  title: React.ReactNode;
  subtitle?: string;
  cta?: React.ReactNode;
  background?: React.ReactNode;
}> = ({ title, subtitle, cta, background }) => (
  <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
    {/* Background */}
    {background && (
      <div className="absolute inset-0 -z-10">
        {background}
      </div>
    )}

    {/* Content */}
    <div className="max-w-4xl mx-auto text-center z-10">
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold text-white/95 mb-6 tracking-tight">
        {title}
      </h1>

      {subtitle && (
        <p className="text-lg md:text-xl text-white/75 max-w-2xl mx-auto mb-8">
          {subtitle}
        </p>
      )}

      {cta && <div className="flex gap-4 justify-center flex-wrap">{cta}</div>}
    </div>
  </section>
);

// ═══════════════════════════════════════════════════════════
// 📊 GLASS GRID
// ═══════════════════════════════════════════════════════════

export const GlassGrid: React.FC<{
  children: React.ReactNode;
  cols?: 2 | 3 | 4;
  className?: string;
}> = ({ children, cols = 3, className = '' }) => {
  const colClasses = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid grid-cols-1 ${colClasses[cols]} gap-4 md:gap-6 ${className}`}>
      {children}
    </div>
  );
};
