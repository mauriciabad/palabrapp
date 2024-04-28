import defaultTheme from 'tailwindcss/defaultTheme'
import daisyui from 'daisyui'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'InterVariable',
          'Inter var',
          'Inter',
          ...defaultTheme.fontFamily.sans,
        ],
      },
      screens: {
        xs: '475px',
        xs2: '375px',
      },
    },
  },

  daisyui: {
    themes: ['cupcake'],
  },
  plugins: [daisyui],
}
