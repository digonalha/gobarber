import 'dotenv/config';

import express from 'express';
import path from 'path';
import Youch from 'youch';
import 'express-async-errors';
import * as Sentry from '@sentry/node';
import routes from './routes';
import sentryConfig from './config/sentry';

// só importo pois automaticamente o construtor já resolve
// todas referencias entre os meus models e o meu banco de dados
import './database';

class App {
  constructor() {
    this.server = express();

    // configurando o sentry:
    Sentry.init(sentryConfig);

    this.middlewares();
    this.routes();
    // middleware para tratamento de exceptions
    this.exceptionHandler();
  }

  middlewares() {
    // request handles do sentry
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(express.json());
    //
    this.server.use(
      // definimos qual rota usará o middleware especifico;
      '/files',
      // express.static serve para servir arquivos estaticos como arquivos de img, por exemplo
      // dentro dele colocamos as partes do caminho separado por virgula
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes);
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    /* quando um midleware recebe 4 parametros, 
    é porque ele é um middleware de tratamento de erro */
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON();
        return res.status(500).json(errors);
      }

      return res.status(500).json({ error: 'Internal server error' });
    });
  }
}

export default new App().server;
