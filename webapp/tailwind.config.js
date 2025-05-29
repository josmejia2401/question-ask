/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
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

