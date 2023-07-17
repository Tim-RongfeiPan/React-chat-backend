import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import Logger from 'bunyan';
import sendGridMail from '@sendgrid/mail';
import { config } from '@root/config';
import { BadRequestError } from '@global/helpers/error-handler';

interface IMailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

const log: Logger = config.createLogger('mailOptions');
sendGridMail.setApiKey(config.SENDGRID_API_KEY!);

class MailTransport {
  public async sendEmail(
    receiverEmail: string,
    subject: string,
    body: string
  ): Promise<void> {
    if (config.NODE_ENV === 'test' || config.NODE_ENV === 'development') {
      this.developmentEmailSender(receiverEmail, subject, body); //nodemail
    } else {
      this.productionEmailSender(receiverEmail, subject, body); //sendgrid
    }
  }

  private async developmentEmailSender(
    receiverEmail: string,
    subject: string,
    body: string
  ): Promise<void> {
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: config.SENDER_EMAIL!,
        pass: config.SENDER_EMAIL_PASSWORD!
      }
      // service:'gmail',
      // auth: {
      // type: 'OAuth2',
      // user: config.SENDER_EMAIL!,
      // clientId: config.GOOGLE_AUTH_CLIENT_ID!,
      // clientSecret: config.GOOGLE_AUTH_CLIENT_SECRET!,
      // refreshToken: config.GOOGLE_AUTH_REFRESH_TOKEN!,
      // accessToken: config.GOOGLE_AUTH_ACCESS_TOKEN!
      // }
    });

    const mailOptions: IMailOptions = {
      from: ` Chatty App <${config.SENDER_EMAIL!}>`,
      to: receiverEmail,
      subject, //email topic
      html: body
    };

    try {
      await transporter.sendMail(mailOptions);
      log.info('Development email sent successfully.');
    } catch (error) {
      log.error('Error sending email', error);
      throw new BadRequestError('Error sending email');
    }
  }

  private async productionEmailSender(
    receiverEmail: string,
    subject: string,
    body: string
  ): Promise<void> {
    const mailOptions: IMailOptions = {
      from: `Chatty App <${config.SENDER_EMAIL!}>`,
      to: receiverEmail,
      subject,
      html: body
    };

    try {
      await sendGridMail.send(mailOptions);
      log.info('Production email sent successfully.');
    } catch (error) {
      log.error('Error sending email', error);
      throw new BadRequestError('Error sending email');
    }
  }
}

export const mailTransport: MailTransport = new MailTransport();
