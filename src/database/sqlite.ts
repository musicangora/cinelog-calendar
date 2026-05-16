import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';

export const DATABASE_NAME = 'cinelog-calendar.db';

let databasePromise: Promise<SQLiteDatabase> | null = null;

export async function getSQLiteDatabase(): Promise<SQLiteDatabase> {
  if (!databasePromise) {
    databasePromise = openDatabaseAsync(DATABASE_NAME);
  }

  return databasePromise;
}

export async function initializeDatabase(): Promise<SQLiteDatabase> {
  const database = await getSQLiteDatabase();

  await database.execAsync('PRAGMA journal_mode = WAL;');
  await database.execAsync('PRAGMA foreign_keys = ON;');

  return database;
}
