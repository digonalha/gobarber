import Sequelize, { Model } from 'sequelize';

// extends utilizamos para herdar de outra classe
// init é o metodo de inicializacao desse nosso modelo
// o super seria o base do c#, que fazemos para chamar o init do Model
class Appointment extends Model {
  static init(sequelize) {
    super.init(
      // super seria o base que utilizamos(quem herdamos) do c#
      {
        date: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  // criando os joins!
  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.User, { foreignKey: 'provider_id', as: 'provider' });
  }
}
export default Appointment;
