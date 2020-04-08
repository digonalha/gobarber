import User from '../models/User';
import File from '../models/File';

class ProviderController {
  async index(req, res) {
    const providers = await User.findAll({
      where: { provider: true }, // condição da query
      attributes: ['id', 'name', 'email', 'avatar_id'], // os atributos que quero retornar nessa query
      include: {
        // assim que faz join! SUPER FACIL!
        // model: é o modelo que será feito retornado como join.
        model: File,
        // as: alias do File que será retornado no User
        as: 'avatar',
        attributes: ['name', 'path', 'url'],
      },
    });
    return res.json(providers);
  }
}

export default new ProviderController();
