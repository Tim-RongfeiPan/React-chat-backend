import Queue, { Job } from 'bull';
import Logger from 'bunyan';

import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { config } from '@root/config';
import { IAuthJob } from '@root/features/auth/interfaces/auth.interface';
import { IEmailJob, IUserJob } from '@root/features/user/interfaces/user.interface';
import { IPostJobData } from '@post/interfaces/post.interface';
import { IReactionJob } from '@reaction/interfaces/reaction.interface';
import { ICommentJob } from '@comment/interfaces/comment.interface';
import { INotificationJobData } from '@notification/interfaces/notification.interface';
import {
  IBlockedUserJobData,
  IFollowerJobData
} from '@follower/interfaces/follower.interface';
import { IChatJobData, IMessageData } from '@chat/interfaces/chat.interface';

type IBaseJobdata =
  | IAuthJob
  | IEmailJob
  | IPostJobData
  | IReactionJob
  | ICommentJob
  | IFollowerJobData
  | IBlockedUserJobData
  | INotificationJobData
  | IMessageData
  | IChatJobData;

let bullAdapters: BullAdapter[] = [];
export let serverAdapter: ExpressAdapter;

export abstract class BaseQueue {
  queue: Queue.Queue;
  log: Logger;

  constructor(queueName: string) {
    this.queue = new Queue(queueName, `${config.REDIS_HOST}`);
    bullAdapters.push(new BullAdapter(this.queue));
    bullAdapters = [...new Set(bullAdapters)];
    serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath('/queues');

    createBullBoard({
      queues: bullAdapters,
      serverAdapter: serverAdapter
    });

    this.log = config.createLogger(`${queueName}Queue`);

    this.queue.on('completed', (job: Job) => {
      job.remove();
    });

    this.queue.on('global:completed', (jobId: string) => {
      this.log.info(`Job ${jobId} completed`);
    });

    this.queue.on('global:stalled', (jobId: string) => {
      this.log.info(`Job ${jobId} stalled`);
    });
  }

  protected addJob(name: string, data: IBaseJobdata): void {
    this.queue.add(name, data, {
      attempts: 3,
      backoff: { type: 'fixed', delay: 5000 }
    });
  }

  protected processJob(
    name: string,
    concurrency: number,
    callback: Queue.ProcessCallbackFunction<void>
  ): void {
    this.queue.process(name, concurrency, callback);
  }
}
