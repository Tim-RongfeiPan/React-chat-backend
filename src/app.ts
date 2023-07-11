import express, { Express } from 'express';

import { NodechatServer } from '@root/setupServer';
import dbConnection from '@root/setupDatabase';
import { config } from '@root/config';
class Application {
  public initialize(): void {
    this.loadConfig();
    dbConnection();
    const app: Express = express();
    const server: NodechatServer = new NodechatServer(app);
    server.start();
  }

  private loadConfig(): void {
    config.Validation();
    config.cloudinaryConfig();
  }
}

const application: Application = new Application();
application.initialize();
