// profile.processor.ts
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { TrophyType, ProfileData } from 'src/profile/types/profile-parser.type';
import { load } from 'cheerio';
import { COMBO_FLAG_MAP, ComboFlag, PlayRecord, Rank, RANK_MAP, SYNC_FLAG_MAP, SyncFlag } from 'src/pattern/types/play-record-parser.type';
import { QUEUE_NAMES } from 'src/infrastructure/queue/queue.constants';
import { ProfileService } from 'src/profile/profile.service';
import { imgBasename } from 'src/utils/html-parser.util';

@Processor(QUEUE_NAMES.PROFILE_SYNC)
export class ProfileProcessor extends WorkerHost {
    constructor(
        private readonly profileService: ProfileService,
    ) {
        super();
    }

    async process(job: Job<any>) {
        // 1. 정규화를 통해 profile에 들어갈 데이터, play_record에 들어갈 데이터 구분하기
        // 2. profile에 등록
        // 3. play_record에 등록
        // console.log(job)
        try {
            const start = performance.now();
            const { friendCode, region, rawData, user } = job.data;

            const profileData: ProfileData = this.parseProfileData(rawData.home.html, friendCode);
            profileData.friendCode = friendCode;

            await this.profileService.upsertProfile(region, profileData, user);

            const end = performance.now();
            console.log(`실행 시간: ${end - start} ms`);

            // 각 단계마다 진행률을 명시적으로 업데이트
            await job.updateProgress(33);


            await job.updateProgress(67);


            await job.updateProgress(100);
        } catch (error) {
            console.error('Profile 처리 중 에러 발생!', error);
            throw error;
        }
    }

    // profileData를 파싱해오는 메소드
    // profileData는 rawData.home.html에 위치함
    private parseProfileData(html: string, friendCode: string): ProfileData {
        // Cheerio를 사용하여 HTML을 파싱
        const $ = load(html);

        const name = $('.name_block').first().text().trim();
        const currentRating = $('.rating_block').first().text().trim(); // return시 parseInt로 변환하기 때문에, 여기서는 문자열로 유지
        const trophyText = $('.trophy_inner_block span').first().text().trim();

        let trophyType: TrophyType = 'Normal';

        const trophyBlock = $('[class*=trophy_block]').first();

        if (trophyBlock.length) {
            const classes = (trophyBlock.attr('class') || '').split(/\s+/);

            for (const cls of classes) {
                if (cls.startsWith('trophy_') && cls !== 'trophy_block') {
                    trophyType = cls.replace('trophy_', '') as TrophyType;
                    break;
                }
            }
        }

        let iconUrl = '';

        const basicBlock = $('.basic_block').first();

        if (basicBlock.length) {
            const img = basicBlock.find('img').filter((_, el) => {
                const cls = $(el).attr('class') || '';
                return cls.includes('w_112') && cls.includes('f_l');
            });

            if (img.length) {
                iconUrl = img.attr('src') || '';
            }
        }

        let courseRank = '';
        let classRank = '';

        $('img').each((_, el) => {
            const src = $(el).attr('src') || '';

            if (src.includes('/course/') && !courseRank) {
                courseRank = imgBasename(src);
            }

            if (src.includes('/class/') && !classRank) {
                classRank = imgBasename(src);
            }
        });

        const starMatch = html.match(/×(\d+)/);

        return {
            name,
            rating: parseInt(currentRating || "0", 10),
            trophyText,
            trophyType,
            iconUrl,
            courseRank,
            classRank,
            starCount: starMatch ? parseInt(starMatch[1], 10) : 0,
            friendCode,
        };
    }
}