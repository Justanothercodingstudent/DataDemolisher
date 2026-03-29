import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        neonBlue: '#4D7CFF',
        neonPurple: '#A855F7',
        neonGold: '#F5C451',
        panel: 'rgba(10, 16, 36, 0.55)'
      },
      boxShadow: {
        neon: '0 0 40px rgba(77,124,255,.35)',
        glow: '0 0 25px rgba(168,85,247,.35)'
      },
      animation: {
        drift: 'drift 9s ease-in-out infinite',
        pulseGlow: 'pulseGlow 2.6s ease-in-out infinite'
      },
      keyframes: {
        drift: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' }
        },
        pulseGlow: {
          '0%,100%': { opacity: '0.45' },
          '50%': { opacity: '0.95' }
        }
      }
    }
  },
  plugins: []
};

export default config;
