// como necessario utilizar pelo sequelize-cli, utilizar o commonjs
module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'gobarber',
  define: {
    timestamps: true, // armazena a data da criação e edição de cada registro
    underscored: true,
    underscoredAll: true,
  },
};
