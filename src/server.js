import 'dotenv/config';
import app from './app.js';
import { connectDatabase } from './database.js';

const { PORT = 4000 } = process.env;

connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor disponible en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('No fue posible conectar con MongoDB', error);
    process.exit(1);
  });
