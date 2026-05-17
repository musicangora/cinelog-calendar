export const CREATE_MOVIE_LOGS_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS movie_logs (
    id TEXT PRIMARY KEY NOT NULL,
    watched_on TEXT NOT NULL,
    title TEXT NOT NULL,
    story REAL NOT NULL,
    character REAL NOT NULL,
    visual REAL NOT NULL,
    music REAL NOT NULL,
    rewatch REAL NOT NULL,
    total_score INTEGER NOT NULL,
    note TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`;

export const CREATE_MOVIE_LOGS_WATCHED_ON_INDEX_SQL = `
  CREATE INDEX IF NOT EXISTS idx_movie_logs_watched_on
  ON movie_logs(watched_on);
`;

export const CREATE_MOVIE_LOGS_TOTAL_SCORE_INDEX_SQL = `
  CREATE INDEX IF NOT EXISTS idx_movie_logs_total_score
  ON movie_logs(total_score DESC);
`;

export const MOVIE_LOGS_SCHEMA_SQL = [
  CREATE_MOVIE_LOGS_TABLE_SQL,
  CREATE_MOVIE_LOGS_WATCHED_ON_INDEX_SQL,
  CREATE_MOVIE_LOGS_TOTAL_SCORE_INDEX_SQL,
];
