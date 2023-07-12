import dotenv from 'dotenv';

import bunyan from 'bunyan';
import cloudinary from 'cloudinary';
dotenv.config();

class Config {
  public DATABASE_URL: string | undefined;
  public JWT_TOKEN: string | undefined;
  public NODE_ENV: string | undefined;
  public SECRET_KEY1: string | undefined;
  public SECRET_KEY2: string | undefined;
  public CLIENT_URL: string | undefined;
  public REDIS_HOST: string | undefined;
  public CLOUD_NAME: string | undefined;
  public CLOUD_API_KEY: string | undefined;
  public CLOUD_API_SECRET: string | undefined;

  public SENDER_EMAIL: string | undefined;
  public SENDER_EMAIL_PASSWORD: string | undefined;
  public SENDGRID_API_KEY: string | undefined;
  public SENDGRID_SENDER: string | undefined;

  public GOOGLE_AUTH_CLIENT_ID: string | undefined;
  public GOOGLE_AUTH_CLIENT_SECRET: string | undefined;
  public GOOGLE_AUTH_REFRESH_TOKEN: string | undefined;
  public GOOGLE_AUTH_ACCESS_TOKEN: string | undefined;

  private readonly DEFAULT_DATABASE_URL =
    'mongodb://localhost:27017/React-chat-backend';

  constructor() {
    this.DATABASE_URL = process.env.DATABASE_URL || this.DEFAULT_DATABASE_URL;
    this.JWT_TOKEN = process.env.JWT_TOKEN || '1234';
    this.NODE_ENV = process.env.NODE_ENV || '';
    this.SECRET_KEY1 = process.env.SECRET_KEY1 || '';
    this.SECRET_KEY2 = process.env.SECRET_KEY2 || '';
    this.CLIENT_URL = process.env.CLIENT_URL || '';
    this.REDIS_HOST = process.env.REDIS_HOST || '';
    this.CLOUD_NAME = process.env.CLOUD_NAME || '';
    this.CLOUD_API_KEY = process.env.CLOUD_API_KEY || '';
    this.CLOUD_API_SECRET = process.env.CLOUD_API_SECRET || '';
    this.SENDER_EMAIL = process.env.SENDER_EMAIL || '';
    this.SENDER_EMAIL_PASSWORD = process.env.SENDER_EMAIL_PASSWORD || '';
    this.SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';
    this.SENDGRID_SENDER = process.env.SENDGRID_SENDER || '';

    this.GOOGLE_AUTH_CLIENT_ID = process.env.GOOGLE_AUTH_CLIENT_ID || '';
    this.GOOGLE_AUTH_CLIENT_SECRET = process.env.GOOGLE_AUTH_CLIENT_SECRET || '';
    this.GOOGLE_AUTH_REFRESH_TOKEN = process.env.GOOGLE_AUTH_REFRESH_TOKEN || '';
    this.GOOGLE_AUTH_ACCESS_TOKEN = process.env.GOOGLE_AUTH_ACCESS_TOKEN || '';
  }

  public createLogger(name: string): bunyan {
    return bunyan.createLogger({ name: name, level: 'debug' });
  }

  public Validation(): void {
    for (const [key, value] of Object.entries(this)) {
      if (value === undefined) throw new Error(`Failed to configure ${key}`);
    }
  }

  public cloudinaryConfig(): void {
    cloudinary.v2.config({
      cloud_name: this.CLOUD_NAME,
      api_key: this.CLOUD_API_KEY,
      api_secret: this.CLOUD_API_SECRET
    });
  }
}

export const config: Config = new Config();
