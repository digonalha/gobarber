// responsavel pelo vinculo entre os models e o banco de dados
import Sequelize from 'sequelize';
import User from '../app/models/User';
import databaseConfig from '../config/database';

// array com todos os nosso models
const models = [User];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    // itero no meu array de models, chamando o método
    // de init deles e passando o nosso sequelize como parametro.
    models.map((model) => model.init(this.connection));
  }
}

export default new Database();
