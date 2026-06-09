import { Difficulty } from "../enums/difficulty.enum";

export type Rank =
    | 'D'
    | 'C'
    | 'B'
    | 'BB'
    | 'BBB'
    | 'A'
    | 'AA'
    | 'AAA'
    | 'S'
    | 'Sp'
    | 'SS'
    | 'SSp'
    | 'SSS'
    | 'SSSp';

export const RANK_MAP: Record<string, Rank> = {
    d: 'D',
    c: 'C',
    b: 'B',
    bb: 'BB',
    bbb: 'BBB',
    a: 'A',
    aa: 'AA',
    aaa: 'AAA',
    s: 'S',
    sp: 'Sp',
    ss: 'SS',
    ssp: 'SSp',
    sss: 'SSS',
    sssp: 'SSSp'
};

export type SyncFlag = 'sync' | 'fs' | 'fsp' | 'fdx' | 'fdxp';

export const SYNC_FLAG_MAP: Record<string, SyncFlag> = {
    sync: 'sync',
    fs: 'fs',
    fsp: 'fsp',
    fdx: 'fdx',
    fdxp: 'fdxp',
};

export type ComboFlag = 'fc' | 'fcp' | 'ap' | 'app';

export const COMBO_FLAG_MAP: Record<string, ComboFlag> = {
    fc: 'fc',
    fcp: 'fcp',
    ap: 'ap',
    app: 'app',
};

export interface PlayRecord {
    title: string;
    jacketUrl: string | null;
    detailIdx: string;
    difficulty: Difficulty;
    level: string;
    isDx: boolean;
    achievement: number | null;
    rank: Rank | null;
    comboFlag: ComboFlag | null;
    syncFlag: SyncFlag | null;
    dxScore: number | null;
    dxScoreMax: number | null;
};