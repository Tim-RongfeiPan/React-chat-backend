import express, { Express } from "express";

import { NodechatServer } from "./setupServer";
import databaseConnection from "./setupDatabase";
import { config } from "./config";

class Application {
	public initialize(): void {
		this.loadConfig();
		databaseConnection();
		const app: Express = express();
		const server: NodechatServer = new NodechatServer(app);
		server.start();
	}

	private loadConfig(): void {
		config.Validation();
	}
}

const application: Application = new Application();
application.initialize();
