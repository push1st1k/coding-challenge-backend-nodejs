import { config } from '../config';
import { sequelize } from './repositories/database';
import { app } from './app';

(async () => {
  await sequelize.sync();

  app.listen(config.api.port, function () {
    console.log(`App is listening on port ${config.api.port}!`);
  });
})();