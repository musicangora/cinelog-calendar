import type { SQLiteDatabase } from 'expo-sqlite';

import type { CreateMovieLogInput, MovieLog, UpdateMovieLogInput } from '@/src/domain';

import type { MovieLogRepository } from './movie-log-repository';

export class SQLiteMovieLogRepository implements MovieLogRepository {
  constructor(private readonly database: SQLiteDatabase) {}

  async listByDate(_date: string): Promise<MovieLog[]> {
    this.assertDatabaseReady();
    throw new Error('SQLiteMovieLogRepository.listByDate is not implemented yet.');
  }

  async listByMonth(_month: string): Promise<MovieLog[]> {
    this.assertDatabaseReady();
    throw new Error('SQLiteMovieLogRepository.listByMonth is not implemented yet.');
  }

  async listRanked(): Promise<MovieLog[]> {
    this.assertDatabaseReady();
    throw new Error('SQLiteMovieLogRepository.listRanked is not implemented yet.');
  }

  async getById(_id: string): Promise<MovieLog | null> {
    this.assertDatabaseReady();
    throw new Error('SQLiteMovieLogRepository.getById is not implemented yet.');
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
