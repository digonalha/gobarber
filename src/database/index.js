// responsavel pelo mapeamento entre os models e o banco de dados
import Sequelize from 'sequelize';
import User from '../app/models/User';
import File from '../app/models/File';
import Appointment from '../app/models/Appointment';
import databaseConfig from '../config/database';

// array com todos os nosso models
const models = [User, File, Appointment];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    // itero no meu array de models, chamando o método
    // de init deles e passando o nosso sequelize como parametro.
    models
      .map((model) => model.init(this.connection))
      .map(
        // agora mapeamos as relações entre tabelas
        (model) => model.associate && model.associate(this.connection.models)
      );
  }
}

export default new Database();
