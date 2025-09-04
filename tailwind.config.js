/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Arial', 'Helvetica', 'sans-serif'],
      },
      colors: {
        retro: {
          blue: '#0066CC',
          lightblue: '#6699FF', 
          silver: '#C0C0C0',
          darksilver: '#808080',
          accent: '#FF6600',
          green: '#00AA00',
          red: '#CC0000',
        }
      },
      backgroundImage: {
        'retro-gradient': 'linear-gradient(to bottom, #E6E6FA 0%, #C0C0C0 100%)',
        'button-gradient': 'linear-gradient(to bottom, #F0F0F0 0%, #C0C0C0 100%)',
        'button-active': 'linear-gradient(to bottom, #C0C0C0 0%, #A0A0A0 100%)',
      },
      boxShadow: {
        'retro-inset': 'inset 1px 1px 0px #FFFFFF, inset -1px -1px 0px #808080',
        'retro-outset': '1px 1px 0px #FFFFFF, -1px -1px 0px #808080',
      },
      borderWidth: {
        '1': '1px',
      }
    },
  },
  plugins: [],
}