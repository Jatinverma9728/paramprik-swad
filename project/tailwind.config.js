/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Playfair Display", "serif"],
      },
      keyframes: {
        slideInDown: {
          'from': { 
            transform: 'translate(-50%, -100%)',
            opacity: '0'
          },
          'to': { 
            transform: 'translate(-50%, 0)',
            opacity: '1'
          },
        },
        slideOutUp: {
          'from': { 
            transform: 'translate(-50%, 0)',
            opacity: '1'
          },
          'to': { 
            transform: 'translate(-50%, -100%)',
            opacity: '0'
          },
        },
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' }
        },
        fadeOut: {
          'from': { opacity: '1' },
          'to': { opacity: '0' }
        },
        enterFromTop: {
          'from': { 
            transform: 'translateY(-100%)',
            opacity: '0'
          },
          'to': { 
            transform: 'translateY(0)',
            opacity: '1'
          }
        },
        exitToTop: {
          'from': { 
            transform: 'translateY(0)',
            opacity: '1'
          },
          'to': { 
            transform: 'translateY(-100%)',
            opacity: '0'
          }
        }
      },
      animation: {
        'slideInDown': 'slideInDown 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'slideOutUp': 'slideOutUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'fadeIn': 'fadeIn 0.3s ease-out forwards',
        'fadeOut': 'fadeOut 0.3s ease-in forwards',
        'enterFromTop': 'enterFromTop 0.3s ease-out forwards',
        'exitToTop': 'exitToTop 0.3s ease-in forwards'
      }
    }
  },
  plugins: [],
};
