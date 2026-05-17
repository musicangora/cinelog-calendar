import { initializeDatabase } from '@/src/database/sqlite';

import { SQLiteMovieLogRepository } from './sqlite-movie-log-repository';

export async function createMovieLogRepository() {
  const database = await initializeDatabase();

  return new SQLiteMovieLogRepository(database);
}
