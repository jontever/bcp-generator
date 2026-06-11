import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#baddfd',
          300: '#7cc3fb',
          400: '#36a3f6',
          500: '#0c86e7',
          600: '#006bc5',
          700: '#0055a0',
          800: '#024884',
          900: '#083d6d',
          950: '#062649',
        },
        gov: {
          blue: '#003078',
          yellow: '#ffdd00',
          green: '#00703c',
          red: '#d4351c',
          grey: '#626a6e',
        },
      },
    },
  },
  plugins: [],
}

export default config
