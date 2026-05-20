// queue.module.ts
import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

@Module({
    imports: [
        BullModule.forRoot({
            connection: {
                host: 'localhost',
                port: 6379,
            },
        }),
        BullModule.registerQueue({
            name: 'test-queue',
        }),
    ],
    exports: [BullModule],
})
export class QueueModule { }