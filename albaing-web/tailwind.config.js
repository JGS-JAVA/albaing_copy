/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.jsx',
  ],
  theme: {
    extend: {
        colors: {
          "brand-blue" : '#0066FF',
              animation: {
                'fadeIn': 'fadeIn 0.3s ease-in-out',
                'slideIn': 'slideIn 0.3s ease-out',
                'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              },
              keyframes: {
                fadeIn: {
                  '0%': { opacity: '0' },
                  '100%': { opacity: '1' },
                },
                slideIn: {
                  '0%': { transform: 'translateY(20px)', opacity: '0' },
                  '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                pulse: {
                  '0%, 100%': { opacity: '1' },
                  '50%': { opacity: '.5' },
                },
          },
        },
    }
  },

  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),

  ],
}

