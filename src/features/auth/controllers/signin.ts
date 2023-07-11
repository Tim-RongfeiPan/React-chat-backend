import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import JWT from 'jsonwebtoken';

import { loginSchema } from '@auth/schemes/signin';
import joiValidation from '@global/decorators/joi-validation.decorators';
import { BadRequestError } from '@global/helpers/error-handler';
import { config } from '@root/config';
import { authService } from '@service/db/auth.service';
import { IAuthDocument } from '../interfaces/auth.interface';

export class SignIn {
  @joiValidation(loginSchema)
  public async read(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body;
    const existsUser: IAuthDocument = await authService.getAuthByUsername(username);
    if (!existsUser) throw new BadRequestError('Not existing user!');

    const passwordMatch: boolean = await existsUser.comparePassword(password);
    if (!passwordMatch) throw new BadRequestError('Invalid password');

    const userJwt: string = JWT.sign(
      {
        userId: existsUser._id,
        uId: existsUser.uId,
        email: existsUser.email,
        username: existsUser.username,
        avatarColor: existsUser.avatarColor
      },
      config.JWT_TOKEN!
    );
    req.session = { jwt: userJwt };
    res.status(HTTP_STATUS.OK).json({
      message: 'User login successfully',
      user: existsUser,
      token: userJwt
    });
  }
}
