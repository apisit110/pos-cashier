import { Controller, Get, Param, NotFoundException, UseGuards } from '@nestjs/common';
import { GetMemberByIdUseCase } from '../../application/use-cases/GetMemberByIdUseCase';
import { JwtAuthGuard } from '../../infrastructure/guards/JwtAuthGuard';

@Controller('v1/members')
@UseGuards(JwtAuthGuard)
export class MemberController {
  constructor(private readonly getMemberByIdUseCase: GetMemberByIdUseCase) {}

  @Get(':id')
  async getMemberById(@Param('id') id: string) {
    const member = await this.getMemberByIdUseCase.execute(id);
    if (!member) {
      throw new NotFoundException(`Member with ID ${id} not found.`);
    }
    
    // Return a DTO matching what the frontend expects
    return {
      id: member.id,
      firstName: member.firstName,
      lastName: member.lastName,
      fullName: member.fullName,
      points: member.points
    };
  }
}
