// queue.module.ts
import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { QUEUE_NAMES } from './queue.constants';

@Module({
    imports: [
        BullModule.forRoot({
            connection: {
                host: 'localhost',
                port: 6379,
            },
        }),
        BullModule.registerQueue(
            { name: QUEUE_NAMES.PROFILE_SYNC },
            { name: QUEUE_NAMES.PATTERN_SYNC }
        ),
    ],
    exports: [BullModule],
})
export class QueueModule { }