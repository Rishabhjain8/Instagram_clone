/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    screens: {
      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '830px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
      'smh' : {'min' : '240px', 'max': '312px'},
      'vsmm': { 'max': '312px' },
      'vsmmm': {'max': '400px'},
      'vsmmsb': {'min': '401px', 'max': '550px'},
      'smmsb' : {'min': '313px', 'max' : '678px'},
      'smm': { 'max': '679px' },
      'mdmh' : {'min' : '313px', 'max': '830px'},
      'mdm': { 'max': '830px' },
      'lgm': { 'max': '1024px' },
      'lgt': { 'min': '240px', 'max' : '1230px' },
      'smtmd': { 'min': '640px', 'max': '1024px' },
      'mdtlg': { 'min': '767px', 'max': '1230px' },
      'vlg' : {'min': '1230px'},
      'mdmsb': {'min': '679px'}
      // Small to medium 
      // 'lgt': { 'min': '1025px', 'max': '1270px' },
    },
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { transform: 'translateX(-140%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        fadeOut: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-140%)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.7s linear 1',
        'fade-out': 'fadeOut 0.7s linear 1',
      },
    },
  },
  plugins: [],
}
