import type { SQLiteDatabase } from 'expo-sqlite';

import type { CreateMovieLogInput, MovieLog, UpdateMovieLogInput } from '@/src/domain';

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
    throw new Error('SQLiteMovieLogRepository.create is not implemented yet.');
  }

  async update(_input: UpdateMovieLogInput): Promise<MovieLog> {
    this.assertDatabaseReady();
    throw new Error('SQLiteMovieLogRepository.update is not implemented yet.');
  }

  async delete(_id: string): Promise<void> {
    this.assertDatabaseReady();
    throw new Error('SQLiteMovieLogRepository.delete is not implemented yet.');
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
