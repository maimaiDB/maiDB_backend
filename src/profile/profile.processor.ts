// profile.processor.ts
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';

@Processor('test-queue')
export class ProfileProcessor extends WorkerHost {
    constructor(
        @InjectRepository(Profile)
        private readonly profileRepository: Repository<Profile>,
    ) {
        super();
    }

    async process(job: Job<any>) {
        console.log(job)

        await job.updateProgress(10);


        await job.updateProgress(100);
    }

    //   private normalize(rawData: any) {
    //     return {
    //       ...rawData,
    //       normalized: true,
    //     };
    //   }
}