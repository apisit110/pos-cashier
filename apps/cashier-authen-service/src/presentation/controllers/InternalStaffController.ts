import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { GetStaffByIdUseCase } from '../../application/use-cases/GetStaffByIdUseCase';

@Controller('internal/v1/staffs')
export class InternalStaffController {
  constructor(private readonly getStaffByIdUseCase: GetStaffByIdUseCase) {}

  @Get(':id')
  async getById(@Param('id') id: string) {
    const staff = await this.getStaffByIdUseCase.execute(parseInt(id));
    if (!staff) throw new NotFoundException('Staff not found');
    return { id: staff.id, username: staff.username, fullName: staff.fullName };
  }
}
