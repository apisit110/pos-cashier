import { z } from 'zod';

export const ActivateTerminalRequestSchema = z.object({
  tid: z.string().min(1),
});

export class ActivateTerminalRequestDto {
  private constructor(readonly tid: string) {}

  static from(payload: unknown): ActivateTerminalRequestDto {
    const parsed = ActivateTerminalRequestSchema.parse(payload);
    return new ActivateTerminalRequestDto(parsed.tid);
  }
}
