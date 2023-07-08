import { IAuthDocument } from '@auth/interfaces/auth.interface';
import { Helpers } from '@global/helpers/helper';
import { AuthModel } from '@root/features/auth/models/auth.schema';

class AuthService {
  public async getUserByusernameOremail(
    username: string,
    email: string
  ): Promise<IAuthDocument> {
    const query = {
      $or: [
        { username: Helpers.firstLetterUpperCase(username) },
        { email: Helpers.firstLetterUpperCase(email) }
      ]
    };
    const user: IAuthDocument = (await AuthModel.findOne(
      query
    ).exec()) as IAuthDocument;
    return user;
  }
}

export const authService: AuthService = new AuthService();
