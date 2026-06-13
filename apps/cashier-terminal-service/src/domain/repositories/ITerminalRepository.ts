import { Terminal } from '../entities/Terminal';

export interface ITerminalRepository {
  findByTid(tid: string): Promise<Terminal | null>;
  updateAvailability(tid: string, isAvailable: boolean): Promise<void>;
}
