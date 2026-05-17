import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { SqliteTerminalRepository } from '../../infrastructure/repositories/SqliteTerminalRepository';

export interface ActivateTerminalResult {
  tid: string;
  mid: string;
  sid: string;
}

@Injectable()
export class ActivateTerminalUseCase {
  constructor(private readonly terminalRepository: SqliteTerminalRepository) {}

  async execute(tid: string): Promise<ActivateTerminalResult> {
    const terminal = await this.terminalRepository.findByTid(tid);

    if (!terminal) {
      throw new NotFoundException(`Terminal '${tid}' not found`);
    }

    if (!terminal.isAvailable) {
      throw new ConflictException(
        `Terminal '${tid}' is already in use by another POS or terminal`,
      );
    }

    await this.terminalRepository.updateAvailability(tid, false);

    return { tid: terminal.tid, mid: terminal.mid, sid: terminal.sid };
  }
}
