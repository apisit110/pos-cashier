import { ITerminalRepository } from '../../domain/repositories/ITerminalRepository';
import { ITerminalCenterGateway } from '../../domain/repositories/ITerminalCenterGateway';

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
  constructor(
    private readonly terminalRepository: ITerminalRepository,
    private readonly terminalCenterGateway: ITerminalCenterGateway,
    private readonly appMode: 'online' | 'offline' = 'online',
  ) {}

  async execute(tid: string): Promise<ActivateTerminalResult> {
    // online mode has no seeded terminals, the terminal comes from pos-center
    if (this.appMode === 'online') {
      const centerTerminal = await this.terminalCenterGateway.findByTid(tid);
      if (!centerTerminal) {
        throw new NotFoundError(`Terminal '${tid}' not found`);
      }
      await this.terminalRepository.upsert(centerTerminal);
    }

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
