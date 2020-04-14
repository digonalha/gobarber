import Notification from '../schemas/Notification';
import User from '../models/User';

class NotificationController {
  async index(req, res) {
    const isProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!isProvider)
      return res.status(401).json({
        error: 'You can only list notifications with providers',
      });

    const notifications = await Notification.find({
      user: req.userId,
    })
      .sort({
        createdAt: 'desc',
      })
      .limit(20);

    return res.json(notifications);
  }

  async update(req, res) {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      {
        read: true,
      },
      {
        /*
          necessario colocar esse new para
          ser retornar o registro ja atualizado
        */
        new: true,
      }
    );
    return res.json(notification);
  }

  async delete(req, res) {
    res.json();
  }
}

export default new NotificationController();
