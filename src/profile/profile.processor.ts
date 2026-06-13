// profile.processor.ts
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { TrophyType, ProfileData } from './types/profile-parser.type';
import { load } from 'cheerio';
import { ProfileService } from './profile.service';
import {
  COMBO_FLAG_MAP,
  ComboFlag,
  DIFF_MAP,
  Difficulty,
  PlayRecord,
  Rank,
  RANK_MAP,
  SYNC_FLAG_MAP,
  SyncFlag,
} from './types/play-record-parser.type';
import { parse } from 'path';

@Processor('raw-data-normalization')
export class ProfileProcessor extends WorkerHost {
  constructor(private readonly profileService: ProfileService) {
    super();
  }

  async process(job: Job<any>) {
    // 1. 정규화를 통해 profile에 들어갈 데이터, play_record에 들어갈 데이터 구분하기
    // 2. profile에 등록
    // 3. play_record에 등록
    // console.log(job)

    const start = performance.now();
    const { friendCode, region, rawData, user } = job.data;

    const profileData: ProfileData = this.parseProfileData(
      rawData.home.html,
      friendCode,
    );
    profileData.friendCode = friendCode;

    await this.profileService.upsertProfile(region, profileData, user);

    const jacketMap = this.parseJacketMap(rawData.record.html);
    const playRecords: Record<string, PlayRecord[]> = {};

    for (const [key, difficulty] of Object.entries(DIFF_MAP)) {
      playRecords[key] = this.parsePlayRecords(
        rawData[key].html,
        difficulty,
        jacketMap,
      );
    }

    console.log(playRecords['genre99_diff4']);

    const end = performance.now();
    console.log(`실행 시간: ${end - start} ms`);

    // 각 단계마다 진행률을 명시적으로 업데이트
    await job.updateProgress(33);

    await job.updateProgress(67);

    await job.updateProgress(100);
  }

  private imgBasename(src: string): string {
    return src
      .split('?')[0]
      .split('/')
      .pop()!
      .replace(/\.[^.]+$/, '');
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
        courseRank = this.imgBasename(src);
      }

      if (src.includes('/class/') && !classRank) {
        classRank = this.imgBasename(src);
      }
    });

    const starMatch = html.match(/×(\d+)/);

    return {
      name,
      rating: parseInt(currentRating || '0', 10),
      trophyText,
      trophyType,
      iconUrl,
      courseRank,
      classRank,
      starCount: starMatch ? parseInt(starMatch[1], 10) : 0,
      friendCode,
    };
  }

  // 최근 플레이 기록(GAME RECORD)에서 노래의 앨범 자켓을 파싱해오는 메소드
  // 최근 플레이 기록은 rawData.home.html에 위치함
  private parseJacketMap(html: string): Record<string, string> {
    if (!html || this.profileService.isSessionExpired(html)) {
      return {};
    }

    const $ = load(html);

    const result: Record<string, string> = {};

    $('.playlog_master_container').each((_, container) => {
      const basicBlock = $(container).find('.basic_block').first();
      const jacketImg = $(container).find('img.music_img').first();

      if (!basicBlock.length || !jacketImg.length) {
        return;
      }

      basicBlock.find('.w_80').remove();

      const title = String(basicBlock.text().trim());
      const src = String(jacketImg.attr('src')) || '';

      if (title && src) {
        result[title] = src;
      }
    });

    return result;
  }

  // music_icon_의 뒤에 붙는 문자열을 통해 rank, comboFlag, syncFlag를 분류하는 메소드
  private classifyIcons(iconNames: string[]): {
    rank: Rank | null;
    comboFlag: ComboFlag | null;
    syncFlag: SyncFlag | null;
  } {
    let rank: Rank | null = null;
    let comboFlag: ComboFlag | null = null;
    let syncFlag: SyncFlag | null = null;

    for (const name of iconNames) {
      const key = name.replace(/^music_icon_/, '').toLowerCase();

      if (key === 'back') continue;

      if (key in COMBO_FLAG_MAP) {
        comboFlag = COMBO_FLAG_MAP[key];
        continue;
      }

      if (key in SYNC_FLAG_MAP) {
        syncFlag = SYNC_FLAG_MAP[key];
        continue;
      }

      if (key in RANK_MAP) {
        rank = RANK_MAP[key];
      }
    }

    return { rank, comboFlag, syncFlag };
  }

  // raw 데이터에서 유저의 모든 플레이 기록을 PlayRecord[] 형식으로 파싱해오는 메소드
  private parsePlayRecords(
    html: string,
    difficulty: Difficulty,
    jacketMap: Record<string, string>,
  ): PlayRecord[] {
    if (!html || this.profileService.isSessionExpired(html)) {
      return [];
    }

    const $ = load(html);

    const playRecords: PlayRecord[] = [];

    $('div.w_450.m_15.p_r.f_0').each((_, block) => {
      const root = $(block);

      const nameEl = root.find('.music_name_block').first();

      if (!nameEl.length) {
        return;
      }

      // 노래 제목 페칭 로직
      const title = nameEl.text().trim();

      // 표기 레벨 페칭 로직
      const levelEl = root.find('.music_lv_block').first();

      // DetailIdx 페칭 로직
      const idxEl = root.find('input[name="idx"]').first();

      // 달성도 페칭 로직
      let achievement: number | null = null;

      const score112 = root.find('div[class*="w_112"]').first();

      if (score112.length) {
        const match = score112.text().match(/([\d.]+)%/);

        if (match) {
          achievement = Number(match[1]);
        }
      }

      // DX스코어 및 맥스 DX스코어 페칭 로직
      let dxScore: number | null = null;
      let dxScoreMax: number | null = null;

      const score190 = root.find('div[class*="w_190"]').first();

      if (score190.length && score190.find('img[src*="deluxscore"]').length) {
        const match = score190.text().match(/([\d,]+)\s*\/\s*([\d,]+)/);

        if (match) {
          dxScore = Number(match[1].replace(/,/g, ''));
          dxScoreMax = Number(match[2].replace(/,/g, ''));
        }
      }

      // 해당 블럭 내에 존재하는 각종 img태그의 src를 통해 rank, comboFlag, syncFlag를 페칭하는 로직
      // src에 music_icon_이 포함된 img태그를 모두 찾아서, src에서 *music_icon_을 제거한 뒤, 남은 문자열을 소문자로 변환하여 key로 사용
      const iconNames = root
        .find('img[src*="music_icon_"]')
        .map((_, el) => {
          const src = $(el).attr('src') || '';
          return this.imgBasename(src);
        })
        .get();

      // 위에서 검출된 key값으로 rank, comboFlag, syncFlag를 페칭
      const { rank, comboFlag, syncFlag } = this.classifyIcons(iconNames);

      playRecords.push({
        title,
        jacketUrl: jacketMap[title] || null,
        detailIdx: idxEl.attr('value') || '',
        difficulty,
        level: levelEl.text().trim() || '0',
        isDx: root.find('img[src*="music_dx.png"]').length > 0,
        achievement,
        rank,
        comboFlag,
        syncFlag,
        dxScore,
        dxScoreMax,
      });
    });

    return playRecords;
  }
}
