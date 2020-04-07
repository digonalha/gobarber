import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

// extends utilizamos para herdar de outra classe
// init é o metodo de inicializacao desse nosso modelo
// o super seria o base do c#, que fazemos para chamar o init do Model
class User extends Model {
  static init(sequelize) {
    super.init(
      // super seria o base que utilizamos(quem herdamos) do c#
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL, // VIRTUAL: campo que nao existe no BD, só no backend
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );

    // hooks são funcionalidades do sequelize, que são executados
    // de acordo com eventos que ocorrem no nosso model
    // no caso abaixo, sempre antes de salvar o usuario no banco,
    // o trecho de codigo abaixo será executado
    this.addHook('beforeSave', async (user) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'avatar_id' }); // hasOne, hasMany, belongsToMany (modos de relacionamento entre tabelas)
  }

  // retorna true caso as senhas forem as mesmas;;
  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}
export default User;
