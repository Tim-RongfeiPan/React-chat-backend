import { IAuthJob } from '@root/features/auth/interfaces/auth.interface';
import { BaseQueue } from './base.queue';
import { authWorkers } from '@worker/auth.workers';

class AuthQueue extends BaseQueue {
  constructor() {
    super('auth');
    this.processJob('authToDatabase', 5, authWorkers.addAuthUsertoDatabase);
  }

  public addAuthUserJob(name: string, data: IAuthJob): void {
    this.addJob(name, data);
  }
}

export const authQueue: AuthQueue = new AuthQueue();
