import type { TerminalInfo } from '../entities/Terminal';
import type { TerminalRepository } from '../repositories/TerminalRepository';

const TERMINAL_STORAGE_KEY = 'lightning_pos_terminal';

export class ActivateTerminalUseCase {
  private terminalRepository: TerminalRepository;

  constructor(terminalRepository: TerminalRepository) {
    this.terminalRepository = terminalRepository;
  }

  async execute(tid: string): Promise<TerminalInfo> {
    if (!tid.trim()) {
      throw new Error('Terminal ID is required');
    }

    const terminal = await this.terminalRepository.activate(tid.trim());

    localStorage.setItem(TERMINAL_STORAGE_KEY, JSON.stringify(terminal));

    return terminal;
  }
}
