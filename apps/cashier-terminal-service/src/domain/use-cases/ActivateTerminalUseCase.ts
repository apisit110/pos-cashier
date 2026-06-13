import { ITerminalRepository } from '../repositories/ITerminalRepository';

export interface ActivateTerminalResult {
  tid: string;
  mid: string;
  sid: string;
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
  }
}

export class ActivateTerminalUseCase {
  constructor(private readonly terminalRepository: ITerminalRepository) {}

  async execute(tid: string): Promise<ActivateTerminalResult> {
    const terminal = await this.terminalRepository.findByTid(tid);

    if (!terminal) {
      throw new NotFoundError(`Terminal '${tid}' not found`);
    }

    if (!terminal.isAvailable) {
      throw new ConflictError(`Terminal '${tid}' is already in use by another POS or terminal`);
    }

    await this.terminalRepository.updateAvailability(tid, false);

    return { tid: terminal.tid, mid: terminal.mid, sid: terminal.sid };
  }
}
