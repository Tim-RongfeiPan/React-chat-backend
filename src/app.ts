import express, { Express } from "express";

import { NodechatServer } from "./setupServer";
import databaseConnection from "./setupDatabase";

class Application {
	public initialize(): void {
		databaseConnection();
		const app: Express = express();
		const server: NodechatServer = new NodechatServer(app);
		server.start();
	}
}

const application: Application = new Application();
application.initialize();
