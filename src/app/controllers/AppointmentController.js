import * as Yup from 'yup';
// date-fns: biblioteca pra trabalhar com datar no javascript
import {
  startOfHour,
  endOfHour,
  parseISO,
  isBefore,
  format,
  subHours,
} from 'date-fns';
import pt from 'date-fns/locale/pt';
import { Op } from 'sequelize';
import Appointment from '../models/Appointment';
import File from '../models/File';
import User from '../models/User';
import Notification from '../schemas/Notification';
import Queue from '../../lib/Queue';
import CancellationMail from '../jobs/CancellationMail';

class AppointmentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body)))
      return res.status(400).json({ error: 'Validation fails' });

    const { provider_id, date } = req.body;

    if (provider_id === req.userId)
      return res
        .status(400)
        .json({ error: 'You cannot create appointments with yoursel' });

    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!isProvider)
      return res.status(401).json({
        error: 'You can only create appointments with providers',
      });

    // checando se a data é anterior a data atual
    const hourStart = startOfHour(parseISO(date));
    const hourEnd = endOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permited' });
    }

    // checando se o horario está disponivel

    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: {
          [Op.between]: [hourStart, hourEnd],
        },
      },
    });

    if (checkAvailability)
      return res.status(400).json({ erro: 'Date is not available' });
    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date,
    });

    const user = await User.findByPk(req.userId);
    const formatedDate = format(hourStart, "'dia' d 'de' MMMM', às' H:mm'h'", {
      locale: pt,
    });

    // Notificar o prestador de serviço ao gerar um agendamento
    await Notification.create({
      content: `Novo agendamento de ${user.name} para ${formatedDate}`,
      user: provider_id,
    });

    return res.json(appointment);
  }

  async index(req, res) {
    const { page = 1 } = req.query;

    const appointments = await Appointment.findAll({
      where: {
        user_id: req.userId,
        canceled_at: null,
      },
      order: ['date'], // ordenando pela data
      attributes: ['id', 'date', 'past', 'cancelable'],
      limit: 20, // qtd de registros buscados
      offset: (page - 1) * 20, // pagina
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'url', 'path'],
            },
          ],
        },
      ],
    });

    return res.json(appointments);
  }

  async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
    });

    if (appointment.user_id !== req.userId) {
      return res.status(401).json({
        error: 'You cant remove this appointment',
      });
    }

    if (appointment.canceled_at) {
      return res.status(401).json({
        error: 'This appointment is already canceled',
      });
    }

    const dateWithSub = subHours(appointment.date, 2);
    if (isBefore(dateWithSub, new Date())) {
      return res.status(401).json({
        error: 'You can only can appointments 2 hours in advance',
      });
    }

    appointment.canceled_at = new Date();

    await appointment.save();

    await Queue.add(CancellationMail.key, { appointment });

    return res.json(appointment);
  }
}

export default new AppointmentController();
