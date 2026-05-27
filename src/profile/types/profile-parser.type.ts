export type TrophyType = 'Normal' | 'Bronze' | 'Silver' | 'Gold' | 'Rainbow';

export interface PlayerData {
    name: string;
    rating: number;
    trophyText: string;
    trophyType: TrophyType;
    iconUrl: string;
    courseRank: string;
    classRank: string;
    starCount: number;
    friendCode: string | null;
}