import {
	Application,
	json,
	urlencoded,
	Request,
	Response,
	NextFunction,
	application,
} from "express";

import http from "http";

import cors from "cors";

import helmet from "helmet";
import hpp from "hpp";
import compression from "compression";
import cookieSession from "cookie-session";

import HTTP_STATUS from "http-status-codes";
import { Server } from "socket.io";
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";
import "express-async-errors";
import { config } from "./config";
import appRoutes from "./routes";
import {
	CustomError,
	IErrorResponse,
} from "./shared/globals/helpers/error-handler";

const SERVER_PORT = 5000;

export class NodechatServer {
	private app: Application;

	constructor(app: Application) {
		this.app = app;
	}
	public start(): void {
		this.securityMiddleware(this.app);
		this.standardMiddleware(this.app);
		this.routesMiddleware(this.app);
		this.globalErrorHandler(this.app);
		this.startServer(this.app);
	}

	private securityMiddleware(app: Application): void {
		app.use(
			cookieSession({
				name: "session",
				keys: [config.SECRET_KEY1!, config.SECRET_KEY2!],
				maxAge: 24 * 7 * 60 * 60 * 1000,
				secure: config.NODE_ENV !== "development",
			})
		);
		app.use(hpp());
		app.use(helmet());
		app.use(
			cors({
				origin: config.CLIENT_URL,
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

	private routesMiddleware(app: Application): void {
		appRoutes(app);
	}

	private globalErrorHandler(app: Application): void {
		app.all("*", (req: Request, res: Response) => {
			res.status(HTTP_STATUS.BAD_REQUEST).json({
				message: `bad request from ${req}`,
			});
		});

		app.use(
			(
				error: IErrorResponse,
				_req: Request,
				res: Response,
				next: NextFunction
			) => {
				console.log(error);
				if (error instanceof CustomError) {
					return res
						.status(error.statusCode)
						.json(error.serializeErrors());
				}
				next();
			}
		);
	}

	private async startServer(app: Application): Promise<void> {
		try {
			const httpServer: http.Server = new http.Server(app);
			const socketIO: Server = await this.creatSocketIO(httpServer);
			this.starthttpServer(httpServer);
			this.socketIOConnections(socketIO);
		} catch (error) {
			console.log(error);
		}
	}

	private async creatSocketIO(httpServer: http.Server): Promise<Server> {
		const io: Server = new Server(httpServer, {
			cors: {
				origin: config.CLIENT_URL,
				methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
			},
		});
		const pubClient = createClient({ url: config.REDIS_HOST });
		const subClient = pubClient.duplicate();
		await Promise.all([pubClient.connect(), subClient.connect()]);
		io.adapter(createAdapter(pubClient, subClient));
		return io;
	}

	private starthttpServer(httpServer: http.Server): void {
		console.log(`Server started with process ${process.pid}`);
		httpServer.listen(SERVER_PORT, () => {
			console.log(`Server running on port ${SERVER_PORT}`);
		});
	}

	private socketIOConnections(io: Server): void {}
}
