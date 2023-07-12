import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import JWT from 'jsonwebtoken';
import publicIP from 'ip';
import moment from 'moment';

import { loginSchema } from '@auth/schemes/signin';
import joiValidation from '@global/decorators/joi-validation.decorators';
import { BadRequestError } from '@global/helpers/error-handler';
import { config } from '@root/config';
import { authService } from '@service/db/auth.service';
import { IAuthDocument } from '../interfaces/auth.interface';
import {
  IResetPasswordParams,
  IUserDocument
} from '@root/features/user/interfaces/user.interface';
import { userService } from '@service/db/user.service';
import { forgotPasswordTemplate } from '@service/emails/templates/forgot-password/forgot-password';
import { emailQueue } from '@service/queues/email.queue';
import { resetPasswordTemplate } from '@service/emails/templates/reset-password/reset-password';

export class SignIn {
  @joiValidation(loginSchema)
  public async read(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body;
    const existsUser: IAuthDocument = await authService.getAuthByUsername(username);
    if (!existsUser) throw new BadRequestError('Not existing user!');

    const passwordMatch: boolean = await existsUser.comparePassword(password);
    if (!passwordMatch) throw new BadRequestError('Invalid password!');

    const user: IUserDocument = await userService.getUserByAuthId(
      `${existsUser._id}`
    );
    const userJwt: string = JWT.sign(
      {
        userId: user._id,
        uId: existsUser.uId,
        email: existsUser.email,
        username: existsUser.username,
        avatarColor: existsUser.avatarColor
      },
      config.JWT_TOKEN!
    );

    // test email transport

    // await mailTransport.sendEmail(
    //   'olen.beahan@ethereal.email',
    //   'test for email',
    //   'email test'
    // );

    // test reset password

    // const templateParams: IResetPasswordParams = {
    //   username: existsUser.username,
    //   email: existsUser.email,
    //   ipaddress: publicIP.address(),
    //   date: moment().format('DD/MM/YYYY HH:mm')
    // };

    // const resetLink = `${config.CLIENT_URL}/reset-password?token=12345sdfsdf6789`;
    // const template: string =
    //   resetPasswordTemplate.passwordResetConfirmationTemplate(templateParams);
    // emailQueue.addEmailJob('forgotPasswordEmail', {
    //   template,
    //   receiverEmail: 'olen.beahan@ethereal.email',
    //   subject: 'password reset confirmation'
    // });

    req.session = { jwt: userJwt };

    const userDocument: IUserDocument = {
      ...user,
      authId: existsUser!._id,
      username: existsUser!.username,
      email: existsUser!.email,
      avatarColor: existsUser!.avatarColor,
      uId: existsUser!.uId,
      createdAt: existsUser!.createdAt
    } as IUserDocument;

    res.status(HTTP_STATUS.OK).json({
      message: 'User login successfully',
      user: userDocument,
      token: userJwt
    });
  }
}
