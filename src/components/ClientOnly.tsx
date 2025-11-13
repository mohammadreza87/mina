'use client';

/**
 * ClientOnly component
 * Prevents hydration mismatches by only rendering children on the client side
 */
export default function ClientOnly({ children }: { children: React.ReactNode }) {
  if (typeof window === 'undefined') {
    return null;
  }

  return <>{children}</>;
}
