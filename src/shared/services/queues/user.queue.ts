import { BaseQueue } from './base.queue';
import { userWorker } from '@worker/user.worker';
import { IUserJob } from '@root/features/user/interfaces/user.interface';

class UserQueue extends BaseQueue {
  constructor() {
    super('user');
    //test
    this.processJob('addUserToDatabase', 5, userWorker.addUsertoDatabase);
  }

  public addUserJob(name: string, data: IUserJob): void {
    this.addJob(name, data);
  }
}

export const userQueue: UserQueue = new UserQueue();
