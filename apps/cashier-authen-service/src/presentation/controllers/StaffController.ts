import { Controller, Get, Post, Body, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { GetStaffsUseCase } from '../../application/use-cases/GetStaffsUseCase';
import { CreateStaffUseCase } from '../../application/use-cases/CreateStaffUseCase';
import { SyncStaffsUseCase } from '../../application/use-cases/SyncStaffsUseCase';

@Controller('v1/authen/staffs')
export class StaffController {
  constructor(
    private readonly getStaffsUseCase: GetStaffsUseCase,
    private readonly createStaffUseCase: CreateStaffUseCase,
    private readonly syncStaffsUseCase: SyncStaffsUseCase,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getStaffs(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.getStaffsUseCase.execute(parseInt(page), parseInt(limit));
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createStaff(@Body() body: { username: string; fullName: string; roleId: number; pin: string }) {
    return this.createStaffUseCase.execute(body);
  }

  @Post('sync')
  @HttpCode(HttpStatus.OK)
  async syncStaffs() {
    return this.syncStaffsUseCase.execute();
  }
}
