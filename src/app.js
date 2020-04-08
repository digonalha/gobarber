import express from 'express';
import path from 'path';
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
  }
}

export default new App().server;
