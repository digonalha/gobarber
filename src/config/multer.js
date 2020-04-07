import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

// arquivo de configuração do multer
export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (req, file, cb) => {
      // cb é de callback
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err);

        // passo primeiro parametro do callback como null,
        // pois nele iria o erro caso houvesse algum
        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
