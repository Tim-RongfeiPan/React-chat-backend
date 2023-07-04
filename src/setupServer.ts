import { Application, json, urlencoded, Request, Response, NextFunction } from "express";

import http from "http";

import cors from "cors";

import helmet from "helmet";
import hpp from "hpp";
import cookieSession from "cookie-session";

import "express-serve-static-core";
import HTTP_STATUS from "http-status-codes";
import compression from "compression";

const SERVER_PORT = 5000;

export class nodechatServer {
	private app: Application;
	constructor(app: Application) {
		this.app = app;
	}
	public start(): void {
		this.securityMiddleware(this.app);
		this.standardMiddleware(this.app);
		this.routesMiddleware(this.app);
		this.apiMonitoring(this.app);
		this.globalErrorHandler(this.app);
		this.startServer(this.app);
	}

	private securityMiddleware(app: Application): void {
		app.use(
			cookieSession({
				name: "session",
				keys: ["test1", "test2"],
				maxAge: 24 * 7 * 60 * 60 * 1000,
				secure: false,
			})
		);
		app.use(hpp());
		app.use(helmet());
		app.use(
			cors({
				origin: "*",
				credentials: true,
				optionsSuccessStatus: 200,
				methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
			})
		);
	}

	private standardMiddleware(app: Application): void {
		app.use(compression());
		app.use(json({ limit: "50mb" }));
		app.use(urlencoded({ extended: true, limit: "50mb" }));
	}
	private routesMiddleware(app: Application): void {}
	private apiMonitoring(app: Application): void {}
	private globalErrorHandler(app: Application): void {}
	private async startServer(app: Application): Promise<void> {
		try {
			const httpServer: http.Server = new http.Server(app);
			this.starthttpServer(httpServer);
		} catch (error) {
			console.log(error);
		}
	}

	private createhttpServer(httpServer: http.Server): void {}

	private starthttpServer(httpServer: http.Server): void {
		httpServer.listen(SERVER_PORT, () => {
			console.log("server running on port number: ${SERVER_PORT}");
		});
	}
}
