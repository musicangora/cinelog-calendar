export const RATING_KEYS = ['story', 'character', 'visual', 'music', 'rewatch'] as const;

export type RatingKey = (typeof RATING_KEYS)[number];

export type Ratings = Record<RatingKey, number>;

export type MovieLog = {
  id: string;
  watchedOn: string;
  title: string;
  ratings: Ratings;
  totalScore: number;
  note: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateMovieLogInput = {
  watchedOn: string;
  title: string;
  ratings: Ratings;
  note: string;
};

export type UpdateMovieLogInput = CreateMovieLogInput & {
  id: string;
};

export const RATING_LABELS: Record<RatingKey, string> = {
  story: 'ストーリー',
  character: 'キャラクター',
  visual: 'ビジュアル',
  music: '楽曲',
  rewatch: 'リピートしたいか',
};

export const RATING_MIN = 0;
export const RATING_MAX = 5;
export const RATING_STEP = 0.5;

export const DEFAULT_RATINGS: Ratings = {
  story: 0,
  character: 0,
  visual: 0,
  music: 0,
  rewatch: 0,
};

export const normalizeRatingValue = (value: number): number => {
  if (!Number.isFinite(value)) {
    return RATING_MIN;
  }

  const clamped = Math.min(RATING_MAX, Math.max(RATING_MIN, value));

  return Math.round(clamped / RATING_STEP) * RATING_STEP;
};

export const normalizeRatings = (ratings: Partial<Ratings>): Ratings => {
  return {
    story: normalizeRatingValue(ratings.story ?? DEFAULT_RATINGS.story),
    character: normalizeRatingValue(ratings.character ?? DEFAULT_RATINGS.character),
    visual: normalizeRatingValue(ratings.visual ?? DEFAULT_RATINGS.visual),
    music: normalizeRatingValue(ratings.music ?? DEFAULT_RATINGS.music),
    rewatch: normalizeRatingValue(ratings.rewatch ?? DEFAULT_RATINGS.rewatch),
  };
};

export const calculateTotalScore = (ratings: Ratings): number => {
  const normalizedRatings = normalizeRatings(ratings);

  return RATING_KEYS.reduce((total, key) => total + normalizedRatings[key] * 4, 0);
};
