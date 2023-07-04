import dotenv from "dotenv";
dotenv.config();

class Config {
	public DATABASE_URL: string | undefined;
	public JWT_TOKEN: string | undefined;
	public NODE_ENV: string | undefined;
	public SECRET_KEY1: string | undefined;
	public SECRET_KEY2: string | undefined;
	public CLIENT_URL: string | undefined;

	private readonly DEFAULT_DATABASE_URL =
		"mongodb://127.0.0.1:27017/React-chat-backend";

	constructor() {
		this.DATABASE_URL =
			process.env.DATABASE_URL || this.DEFAULT_DATABASE_URL;
		this.JWT_TOKEN = process.env.JWT_TOKEN || "1";
		this.NODE_ENV = process.env.NODE_ENV || "";
		this.SECRET_KEY1 = process.env.SECRET_KEY1 || "A";
		this.SECRET_KEY2 = process.env.SECRET_KEY2 || "B";
		this.CLIENT_URL = process.env.CLIENT_URL || "";
	}

	public Validation(): void {
		for (const [key, value] of Object.entries(this)) {
			if (value == undefined)
				throw new Error(`Failed to configure ${key}`);
		}
	}
}

export const config: Config = new Config();
