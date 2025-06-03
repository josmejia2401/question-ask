const { Sequelize } = require('sequelize');
const constants = require('../utils/constants');

console.log(constants.DATABASE_URL);
const sequelize = new Sequelize(constants.DATABASE_URL, {
  dialect: 'postgres',
  logging: true,
  pool: {
    max: 10,       // máximo número de conexiones en el pool
    min: 0,        // mínimo número de conexiones que se mantienen abiertas
    acquire: 30000, // tiempo máximo (ms) para adquirir una conexión antes de error
    idle: 10000,   // tiempo máximo (ms) que una conexión puede estar inactiva antes de ser liberada
    evict: 10000,  // frecuencia (ms) para revisar conexiones inactivas y cerrarlas
  },
  dialectOptions: {
    // Opcionalmente puedes agregar opciones específicas de Postgres
    // ssl: { rejectUnauthorized: false }, // si usas SSL y quieres evitar errores con certificados autofirmados
    searchPath: 'questionask',
  },
});

module.exports = sequelize;
