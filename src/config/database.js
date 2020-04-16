require('dotenv/config');

// como necessario utilizar pelo sequelize-cli, utilizar o commonjs
module.exports = {
  dialect: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  define: {
    timestamps: true, // armazena a data da criação e edição de cada registro
    underscored: true,
    underscoredAll: true,
  },
};
