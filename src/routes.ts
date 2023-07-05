import { Application } from 'express';

import Logger from 'bunyan';
import { config } from '@root/config';

const log: Logger = config.createLogger('routes');

export default (app: Application) => {
  const routes = () => {
    log.info('routes');
  };
  routes();
};
