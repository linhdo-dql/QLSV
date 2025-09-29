import { Injectable, signal, effect, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private isBrowser = isPlatformBrowser(this.platformId);
  
  theme = signal<Theme>(this.getInitialTheme());

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    effect(() => {
      if (this.isBrowser) {
        const currentTheme = this.theme();
        localStorage.setItem('theme', currentTheme);
        if (currentTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    });
  }

  private getInitialTheme(): Theme {
    if (!this.isBrowser) {
      return 'dark'; // Default for server-side rendering
    }
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      return savedTheme;
    }
    // Check user's OS preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  toggleTheme(): void {
    this.theme.update(currentTheme => (currentTheme === 'light' ? 'dark' : 'light'));
  }
}