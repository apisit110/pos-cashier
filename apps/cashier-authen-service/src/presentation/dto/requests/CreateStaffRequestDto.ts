import { z } from 'zod';

export const CreateStaffRequestSchema = z.object({
  fullName: z.string().min(1),
  roleId: z.number().int().positive(),
  pin: z.string().min(4),
});

export class CreateStaffRequestDto {
  private constructor(
    readonly fullName: string,
    readonly roleId: number,
    readonly pin: string,
  ) {}

  static from(payload: unknown): CreateStaffRequestDto {
    const parsed = CreateStaffRequestSchema.parse(payload);
    return new CreateStaffRequestDto(parsed.fullName, parsed.roleId, parsed.pin);
  }
}
