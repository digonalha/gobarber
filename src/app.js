import express from 'express';
import routes from './routes';

// só importo pois automaticamente o construtor já resolve
// todas referencias entre os meus models e o meu banco de dados
import './database';

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
