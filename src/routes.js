import { Router } from 'express';
import multer from 'multer';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import ProviderController from './app/controllers/ProviderController';
import AppointmentController from './app/controllers/AppointmentController';
import NotificationController from './app/controllers/NotificationController';
import ScheduleController from './app/controllers/ScheduleController';
import FileController from './app/controllers/FileController';
import authMiddleware from './app/middlewares/auth';
import multerConfig from './config/multer';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.get('/providers', ProviderController.index);

// o middleware só vai funcionar nas rotas abaixo dele
routes.use(authMiddleware);

routes.get('/appointments', AppointmentController.index);
routes.post('/appointments', AppointmentController.store);
routes.delete('/appointments/:id', AppointmentController.delete);

routes.get('/schedule', ScheduleController.index);
routes.get('/notifications', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update);

routes.put('/users', UserController.update);

// single pois só queremos enviar uma arquivo, não multiplos.
// Dentro do single fica o nome do parametro a ser pego
routes.post('/files', upload.single('file'), FileController.store);

export default routes;
