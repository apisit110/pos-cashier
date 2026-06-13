import api from '../api/axiosInstance';
import type { TerminalRepository } from '../../domain/repositories/TerminalRepository';
import type { TerminalInfo } from '../../domain/entities/Terminal';

export class ApiTerminalRepository implements TerminalRepository {
  async activate(tid: string): Promise<TerminalInfo> {
    const response = await api.post<TerminalInfo>('/terminal/activate', { tid });
    return response.data;
  }
}
