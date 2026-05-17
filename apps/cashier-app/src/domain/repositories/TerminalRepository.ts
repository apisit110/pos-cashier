import type { TerminalInfo } from '../entities/Terminal';

export interface TerminalRepository {
  activate(tid: string): Promise<TerminalInfo>;
}
