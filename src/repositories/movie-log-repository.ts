import type { CreateMovieLogInput, MovieLog, UpdateMovieLogInput } from '@/src/domain';

export interface MovieLogRepository {
  listByDate(date: string): Promise<MovieLog[]>;
  listByMonth(month: string): Promise<MovieLog[]>;
  listRanked(): Promise<MovieLog[]>;
  getById(id: string): Promise<MovieLog | null>;
  create(input: CreateMovieLogInput): Promise<MovieLog>;
  update(input: UpdateMovieLogInput): Promise<MovieLog>;
  delete(id: string): Promise<void>;
}
