import { describe, expect, it } from 'vitest';

import {
  DEFAULT_RATINGS,
  calculateTotalScore,
  normalizeRatings,
  normalizeRatingValue,
} from './movie-log';

describe('movie-log domain helpers', () => {
  it('条件: 評価値が最小値より小さい; 期待値: 0 に丸められる', () => {
    expect(normalizeRatingValue(-1)).toBe(0);
  });

  it('条件: 評価値が最大値より大きい; 期待値: 5 に丸められる', () => {
    expect(normalizeRatingValue(8)).toBe(5);
  });

  it('条件: 評価値が 0.5 刻みでない; 期待値: 最も近い 0.5 刻みに丸められる', () => {
    expect(normalizeRatingValue(1.24)).toBe(1);
    expect(normalizeRatingValue(1.25)).toBe(1.5);
    expect(normalizeRatingValue(4.74)).toBe(4.5);
    expect(normalizeRatingValue(4.75)).toBe(5);
  });

  it('条件: 評価値が非数または無限大; 期待値: 0 にフォールバックする', () => {
    expect(normalizeRatingValue(Number.NaN)).toBe(0);
    expect(normalizeRatingValue(Number.POSITIVE_INFINITY)).toBe(0);
  });

  it('条件: 一部の評価項目が未指定; 期待値: 未指定項目はデフォルト値で補完される', () => {
    expect(
      normalizeRatings({
        story: 4.76,
        music: 3.2,
      })
    ).toEqual({
      ...DEFAULT_RATINGS,
      story: 5,
      music: 3,
    });
  });

  it('条件: 5項目の評価を渡す; 期待値: 100点満点換算の総合点が返る', () => {
    expect(
      calculateTotalScore({
        story: 5,
        character: 4.5,
        visual: 4,
        music: 3.5,
        rewatch: 3,
      })
    ).toBe(80);
  });
});
