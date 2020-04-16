import Sequelize, { Model } from 'sequelize';
import { isBefore, subHours } from 'date-fns';

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
        past: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(this.date, new Date());
          },
        },
        cancelable: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(new Date(), subHours(this.date, 2));
          },
        },
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
