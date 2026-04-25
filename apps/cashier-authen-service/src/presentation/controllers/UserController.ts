import { Controller, Get, Post, Body, Query, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { GetUsersUseCase } from '../../application/use-cases/GetUsersUseCase';
import { CreateUserUseCase } from '../../application/use-cases/CreateUserUseCase';
import { SyncUsersUseCase } from '../../application/use-cases/SyncUsersUseCase';

@Controller('v1/authen/users')
export class UserController {
  constructor(
    private readonly getUsersUseCase: GetUsersUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly syncUsersUseCase: SyncUsersUseCase,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getUsers(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.getUsersUseCase.execute(parseInt(page), parseInt(limit));
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() body: { userId: string; fullName: string; roleId: number; pin: string }) {
    return this.createUserUseCase.execute(body);
  }

  @Post('sync')
  @HttpCode(HttpStatus.OK)
  async syncUsers() {
    return this.syncUsersUseCase.execute();
  }
}
