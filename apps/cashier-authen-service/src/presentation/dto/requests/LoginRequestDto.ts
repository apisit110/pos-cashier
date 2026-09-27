import { z } from 'zod';

export const LoginRequestSchema = z.object({
  username: z.string().min(1),
  pin: z.string().min(1),
});

export class LoginRequestDto {
  private constructor(
    readonly username: string,
    readonly pin: string,
  ) {}

  static from(payload: unknown): LoginRequestDto {
    const parsed = LoginRequestSchema.parse(payload);
    return new LoginRequestDto(parsed.username, parsed.pin);
  }
}
