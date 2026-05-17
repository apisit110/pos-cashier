import axios from 'axios';
import type { TerminalRepository } from '../../domain/repositories/TerminalRepository';
import type { TerminalInfo } from '../../domain/entities/Terminal';

export class ApiTerminalRepository implements TerminalRepository {
  private readonly baseUrl = 'http://localhost:3007/api/v1/terminal';

  async activate(tid: string): Promise<TerminalInfo> {
    const response = await axios.post<TerminalInfo>(`${this.baseUrl}/activate`, { tid });
    return response.data;
  }
}
