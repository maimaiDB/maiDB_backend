// queue.module.ts
import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

const redisHost = process.env.REDIS_HOST?.trim() || 'localhost';
const redisPort = Number(process.env.REDIS_PORT);

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: redisHost,
        port: Number.isInteger(redisPort) && redisPort > 0 ? redisPort : 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'raw-data-normalization',
    }),
  ],
  exports: [BullModule],
})
export class QueueModule {}
