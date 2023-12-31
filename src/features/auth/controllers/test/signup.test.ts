/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, json } from 'express';
import * as cloudinaryUploads from '@global/helpers/cloudinary-upload';
import { SignUp } from '@auth/controllers/signup';
import { CustomError } from '@global/helpers/error-handler';
import { authMock, authMockRequest, authMockResponse } from '@root/mocks/auth.mock';
import { authService } from '@service/db/auth.service';
import { UserCache } from '@service/redis/user.cache';

jest.useFakeTimers();
jest.mock('@service/queues/base.queue');
jest.mock('@service/redis/user.cache');
jest.mock('@service/queues/user.queue');
jest.mock('@service/queues/auth.queue');
jest.mock('@global/helpers/cloudinary-upload');

describe('SignUp', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('should throw an error if username is not available', () => {
    const req: Request = authMockRequest(
      {},
      {
        username: '',
        email: 'manny@test.com',
        password: 'qwerty',
        avatarColor: 'red',
        avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
      }
    ) as Request;
    const res: Response = authMockResponse();

    SignUp.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual(
        'Username is a required field'
      );
    });
  });

  it('should throw an error if username length is less than minimum length', () => {
    const req: Request = authMockRequest(
      {},
      {
        username: 'ma',
        email: 'manny@test.com',
        password: 'qwerty',
        avatarColor: 'red',
        avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
      }
    ) as Request;
    const res: Response = authMockResponse();
    SignUp.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual('Invalid username');
    });
  });

  it('should throw an error if username length is greater than maximum length', () => {
    const req: Request = authMockRequest(
      {},
      {
        username: 'mathematics',
        email: 'manny@test.com',
        password: 'qwerty',
        avatarColor: 'red',
        avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
      }
    ) as Request;
    const res: Response = authMockResponse();
    SignUp.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual('Invalid username');
    });
  });

  it('should throw an error if email is not valid', () => {
    const req: Request = authMockRequest(
      {},
      {
        username: 'Manny',
        email: 'not valid',
        password: 'qwerty',
        avatarColor: 'red',
        avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
      }
    ) as Request;
    const res: Response = authMockResponse();

    SignUp.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual('Email must be valid');
    });
  });

  it('should throw an error if email is not available', () => {
    const req: Request = authMockRequest(
      {},
      {
        username: 'Manny',
        email: '',
        password: 'qwerty',
        avatarColor: 'red',
        avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
      }
    ) as Request;
    const res: Response = authMockResponse();
    SignUp.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual('Email is a required field');
    });
  });

  it('should throw an error if password is not available', () => {
    const req: Request = authMockRequest(
      {},
      {
        username: 'Manny',
        email: 'manny@test.com',
        password: '',
        avatarColor: 'red',
        avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
      }
    ) as Request;
    const res: Response = authMockResponse();
    SignUp.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual(
        'Password is a required field'
      );
    });
  });

  it('should throw an error if password length is less than minimum length', () => {
    const req: Request = authMockRequest(
      {},
      {
        username: 'Manny',
        email: 'manny@test.com',
        password: 'ma',
        avatarColor: 'red',
        avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
      }
    ) as Request;
    const res: Response = authMockResponse();
    SignUp.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual('Invalid password');
    });
  });

  it('should throw an error if password length is greater than maximum length', () => {
    const req: Request = authMockRequest(
      {},
      {
        username: 'Manny',
        email: 'manny@test.com',
        password: 'mathematics1',
        avatarColor: 'red',
        avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
      }
    ) as Request;
    const res: Response = authMockResponse();
    SignUp.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual('Invalid password');
    });
  });

  it('should throw unauthorize error is user already exist', () => {
    const req: Request = authMockRequest(
      {},
      {
        username: 'ee23e',
        email: 'olen.beahan@ethereal.email',
        password: 'fdid3cc',
        avatarColor: 'blue',
        avatarImage:
          'data:image/png;base64,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'
      }
    ) as Request;
    const res: Response = authMockResponse();

    jest.spyOn(authService, 'getUserByusernameOremail').mockResolvedValue(authMock);
    SignUp.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual('User already exists!');
    });
  });

  it('should set session data for valid credentials and send correct json response', async () => {
    const req: Request = authMockRequest(
      {},
      {
        username: 'vvvv',
        email: 'olen.beahan@ethereal.email',
        password: 'fdid3dcc',
        avatarColor: 'bldue',
        avatarImage:
          'data:image/png;base64,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'
      }
    ) as Request;
    const res: Response = authMockResponse();

    jest
      .spyOn(authService, 'getUserByusernameOremail')
      .mockResolvedValue(null as any);
    const userSpy = jest.spyOn(UserCache.prototype, 'saveUserCache');
    jest
      .spyOn(cloudinaryUploads, 'uploads')
      .mockImplementation((): any =>
        Promise.resolve({ version: '1234737373', public_id: '123456' })
      );

    await SignUp.prototype.create(req, res);
    expect(req.session?.jwt).toBeDefined();
    expect(res.json).toHaveBeenCalledWith({
      message: 'User created successfully',
      user: userSpy.mock.calls[0][2],
      token: req.session?.jwt
    });
  });
});
