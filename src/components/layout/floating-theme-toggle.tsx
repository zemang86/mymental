'use client';

import { ThemeToggle } from '@/components/ui/theme-toggle';

export function FloatingThemeToggle() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <ThemeToggle />
    </div>
  );
}
