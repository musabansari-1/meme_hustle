// @type {import('tailwindcss').Config}
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-pink': '#FF00FF',
        'neon-blue': '#00FFFF',
        'neon-purple': '#8A2BE2',
        'neon-green': '#00FF00',
        'neon-gold': '#FFD700',
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        mono: ['monospace'],
      },
      boxShadow: {
        'neon-blue-glow': '0 0 10px #00FFFF, 0 0 20px #00FFFF, 0 0 30px #00FFFF',
        'neon-pink-glow': '0 0 10px #FF00FF, 0 0 20px #FF00FF, 0 0 30px #FF00FF',
        'neon-purple-glow': '0 0 10px #8A2BE2, 0 0 20px #8A2BE2, 0 0 30px #8A2BE2',
      },
      fontSize: {
        xxs: '0.65rem',
      },
      keyframes: {
        typing: {
          from: { width: '0' },
          to: { width: '100%' },
        },
        blink: {
          '0%, 100%': { borderColor: 'transparent' },
          '50%': { borderColor: '#39ff14' },
        },
        'glitch-overlay-btn': {
          '0%, 100%': { opacity: '0', transform: 'translate(0, 0)' },
          '20%': { opacity: '0.2', transform: 'translate(-2px, 2px)' },
          '40%': { opacity: '0.3', transform: 'translate(-3px, -3px)' },
          '60%': { opacity: '0.4', transform: 'translate(4px, 4px)' },
          '80%': { opacity: '0.5', transform: 'translate(-5px, 5px)' },
        },
        glitch1: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
        glitch2: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-1px, -1px)' },
          '40%': { transform: 'translate(1px, 1px)' },
          '60%': { transform: 'translate(-1px, 1px)' },
          '80%': { transform: 'translate(1px, -1px)' },
          '100%': { transform: 'translate(0)' },
        },
        glitch3: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(2px, -2px)' },
          '40%': { transform: 'translate(-2px, 2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(-2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        'flicker-slow': {
          '0%, 100%': { opacity: '1' },
          '20%, 80%': { opacity: '0.9' },
          '40%, 60%': { opacity: '0.8' },
        },
        'flicker-short': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        noise: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-5%, -5%)' },
          '20%': { transform: 'translate(-10%, 5%)' },
          '30%': { transform: 'translate(5%, -10%)' },
          '40%': { transform: 'translate(-5%, 15%)' },
          '50%': { transform: 'translate(10%, -5%)' },
          '60%': { transform: 'translate(-15%, 5%)' },
          '70%': { transform: 'translate(5%, 10%)' },
          '80%': { transform: 'translate(10%, -10%)' },
          '90%': { transform: 'translate(-10%, 10%)' },
        },
      },
      animation: {
        typing: 'typing 3.5s steps(40, end), blink .75s step-end infinite',
        blink: 'blink .75s step-end infinite',
        'glitch-text-1': 'glitch1 0.5s infinite alternate',
        'glitch-text-2': 'glitch2 0.5s infinite alternate',
        'glitch-text-3': 'glitch3 0.5s infinite alternate',
        flicker: 'flicker 1s step-end infinite',
        'flicker-slow': 'flicker-slow 2s step-end infinite',
        'flicker-short': 'flicker-short 0.2s step-end 3',
        'glitch-overlay-btn': 'glitch-overlay-btn 0.7s infinite alternate',
        noise: 'noise 10s infinite alternate',
      },
    },
  },
  plugins: [],
}
