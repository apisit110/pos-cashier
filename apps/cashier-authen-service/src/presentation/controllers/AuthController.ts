import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { LoginUseCase } from '../../application/use-cases/LoginUseCase';

@Controller('v1/authen/auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: any) {
    return this.loginUseCase.execute(body.email, body.password);
  }
}
