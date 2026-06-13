// queue.module.ts
import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

const redisHost = process.env.REDIS_HOST?.trim() || 'localhost';
const redisPort = Number(process.env.REDIS_PORT);

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST?.trim() || 'localhost',
        parseInt(process.env.REDIS_PORT || '6379', 10) || 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'raw-data-normalization',
    }),
  ],
  exports: [BullModule],
})
export class QueueModule {}
