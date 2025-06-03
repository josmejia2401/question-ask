/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    'transition',
    'duration-100',
    'duration-75',
    'ease-out',
    'ease-in',
    'opacity-0',
    'opacity-100',
    'scale-95',
    'scale-100',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1D4ED8',   // azul personalizado
        secondary: '#9333EA', // morado personalizado
        accent: '#F59E0B',    // amarillo/naranja
        neutral: '#374151',   // gris oscuro
        'primary-light': '#3B82F6',
        // agrega todos los colores que quieras
      }, 
    },
  },
  plugins: [],
}

