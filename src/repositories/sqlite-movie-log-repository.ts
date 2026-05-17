import type { SQLiteDatabase } from 'expo-sqlite';

import {
  calculateTotalScore,
  normalizeRatings,
  type CreateMovieLogInput,
  type MovieLog,
  type UpdateMovieLogInput,
} from '@/src/domain';

import type { MovieLogRepository } from './movie-log-repository';

type MovieLogRow = {
  id: string;
  watched_on: string;
  title: string;
  story: number;
  character: number;
  visual: number;
  music: number;
  rewatch: number;
  total_score: number;
  note: string;
  created_at: string;
  updated_at: string;
};

export class SQLiteMovieLogRepository implements MovieLogRepository {
  constructor(private readonly database: SQLiteDatabase) {}

  async listByDate(date: string): Promise<MovieLog[]> {
    this.assertDatabaseReady();

    const rows = await this.database.getAllAsync<MovieLogRow>(
      `SELECT * FROM movie_logs
       WHERE watched_on = ?
       ORDER BY created_at DESC`,
      [date]
    );

    return rows.map(mapMovieLogRowToDomain);
  }

  async listByMonth(month: string): Promise<MovieLog[]> {
    this.assertDatabaseReady();

    const rows = await this.database.getAllAsync<MovieLogRow>(
      `SELECT * FROM movie_logs
       WHERE watched_on LIKE ?
       ORDER BY watched_on DESC, created_at DESC`,
      [`${month}%`]
    );

    return rows.map(mapMovieLogRowToDomain);
  }

  async listRanked(): Promise<MovieLog[]> {
    this.assertDatabaseReady();

    const rows = await this.database.getAllAsync<MovieLogRow>(
      `SELECT * FROM movie_logs
       ORDER BY total_score DESC, watched_on DESC, created_at DESC`
    );

    return rows.map(mapMovieLogRowToDomain);
  }

  async getById(id: string): Promise<MovieLog | null> {
    this.assertDatabaseReady();

    const row = await this.database.getFirstAsync<MovieLogRow>(
      `SELECT * FROM movie_logs
       WHERE id = ?`,
      [id]
    );

    return row ? mapMovieLogRowToDomain(row) : null;
  }

  async create(_input: CreateMovieLogInput): Promise<MovieLog> {
    this.assertDatabaseReady();

    const movieLog = buildMovieLogForCreate(_input);

    await this.database.runAsync(
      `INSERT INTO movie_logs (
        id,
        watched_on,
        title,
        story,
        character,
        visual,
        music,
        rewatch,
        total_score,
        note,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        movieLog.id,
        movieLog.watchedOn,
        movieLog.title,
        movieLog.ratings.story,
        movieLog.ratings.character,
        movieLog.ratings.visual,
        movieLog.ratings.music,
        movieLog.ratings.rewatch,
        movieLog.totalScore,
        movieLog.note,
        movieLog.createdAt,
        movieLog.updatedAt,
      ]
    );

    return movieLog;
  }

  async update(input: UpdateMovieLogInput): Promise<MovieLog> {
    this.assertDatabaseReady();

    const existingMovieLog = await this.getById(input.id);

    if (!existingMovieLog) {
      throw new Error(`Movie log not found: ${input.id}`);
    }

    const movieLog = buildMovieLogForUpdate(input, existingMovieLog.createdAt);

    const result = await this.database.runAsync(
      `UPDATE movie_logs
       SET watched_on = ?,
           title = ?,
           story = ?,
           character = ?,
           visual = ?,
           music = ?,
           rewatch = ?,
           total_score = ?,
           note = ?,
           updated_at = ?
       WHERE id = ?`,
      [
        movieLog.watchedOn,
        movieLog.title,
        movieLog.ratings.story,
        movieLog.ratings.character,
        movieLog.ratings.visual,
        movieLog.ratings.music,
        movieLog.ratings.rewatch,
        movieLog.totalScore,
        movieLog.note,
        movieLog.updatedAt,
        movieLog.id,
      ]
    );

    if (result.changes === 0) {
      throw new Error(`Movie log not found: ${input.id}`);
    }

    return movieLog;
  }

  async delete(id: string): Promise<void> {
    this.assertDatabaseReady();

    const result = await this.database.runAsync(
      `DELETE FROM movie_logs
       WHERE id = ?`,
      [id]
    );

    if (result.changes === 0) {
      throw new Error(`Movie log not found: ${id}`);
    }
  }

  private assertDatabaseReady(): void {
    if (!this.database) {
      throw new Error('SQLite database has not been initialized.');
    }
  }
}

const mapMovieLogRowToDomain = (row: MovieLogRow): MovieLog => {
  return {
    id: row.id,
    watchedOn: row.watched_on,
    title: row.title,
    ratings: {
      story: row.story,
      character: row.character,
      visual: row.visual,
      music: row.music,
      rewatch: row.rewatch,
    },
    totalScore: row.total_score,
    note: row.note,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

const buildMovieLogForCreate = (input: CreateMovieLogInput): MovieLog => {
  const normalizedRatings = normalizeRatings(input.ratings);
  const createdAt = createTimestamp();

  return {
    id: createMovieLogId(),
    watchedOn: input.watchedOn,
    title: input.title,
    ratings: normalizedRatings,
    totalScore: calculateTotalScore(normalizedRatings),
    note: input.note,
    createdAt,
    updatedAt: createdAt,
  };
};

const buildMovieLogForUpdate = (input: UpdateMovieLogInput, createdAt: string): MovieLog => {
  const normalizedRatings = normalizeRatings(input.ratings);

  return {
    id: input.id,
    watchedOn: input.watchedOn,
    title: input.title,
    ratings: normalizedRatings,
    totalScore: calculateTotalScore(normalizedRatings),
    note: input.note,
    createdAt,
    updatedAt: createTimestamp(),
  };
};

const createMovieLogId = (): string => {
  return `log_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
};

const createTimestamp = (): string => {
  return new Date().toISOString();
};
