import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';

import { MOVIE_LOGS_SCHEMA_SQL } from './schema';

export const DATABASE_NAME = 'cinelog-calendar.db';

let databasePromise: Promise<SQLiteDatabase> | null = null;
let initializationPromise: Promise<SQLiteDatabase> | null = null;

export async function getSQLiteDatabase(): Promise<SQLiteDatabase> {
  if (!databasePromise) {
    databasePromise = openDatabaseAsync(DATABASE_NAME);
  }

  return databasePromise;
}

export async function initializeDatabase(): Promise<SQLiteDatabase> {
  if (!initializationPromise) {
    initializationPromise = (async () => {
      const database = await getSQLiteDatabase();

      await database.execAsync('PRAGMA journal_mode = WAL;');
      await database.execAsync('PRAGMA foreign_keys = ON;');

      for (const statement of MOVIE_LOGS_SCHEMA_SQL) {
        await database.execAsync(statement);
      }

      return database;
    })();
  }

  return initializationPromise;
}
