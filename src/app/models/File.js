import Sequelize, { Model } from 'sequelize';

// extends utilizamos para herdar de outra classe
// init é o metodo de inicializacao desse nosso modelo
// o super seria o base do c#, que fazemos para chamar o init do Model
class File extends Model {
  static init(sequelize) {
    super.init(
      // super seria o base que utilizamos(quem herdamos) do c#
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
    return this;
  }
}
export default File;
