import { Router } from 'express';
import multer from 'multer';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import authMiddleware from './app/middlewares/auth';
import multerConfig from './config/multer';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

// o middleware só vai funcionar nas rotas abaixo dele
routes.use(authMiddleware);
routes.put('/users', UserController.update);

// single pois só queremos enviar uma arquivo, não multiplos.
// Dentro do single fica o nome do parametro a ser pego
routes.post('/files', upload.single('file'), FileController.store);

export default routes;
