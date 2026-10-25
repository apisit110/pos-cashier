import { Terminal } from '../entities/Terminal';

export interface ITerminalRepository {
  findByTid(tid: string): Promise<Terminal | null>;
  upsert(terminal: { tid: string; mid: string; sid: string }): Promise<void>;
  updateAvailability(tid: string, isAvailable: boolean): Promise<void>;
}
