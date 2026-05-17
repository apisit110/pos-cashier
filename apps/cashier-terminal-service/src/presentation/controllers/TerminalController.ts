import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ActivateTerminalUseCase } from '../../application/use-cases/ActivateTerminalUseCase';

@Controller('api/v1/terminal')
export class TerminalController {
  constructor(private readonly activateTerminalUseCase: ActivateTerminalUseCase) {}

  @Post('activate')
  @HttpCode(HttpStatus.OK)
  async activate(@Body() body: { tid: string }) {
    return this.activateTerminalUseCase.execute(body.tid);
  }
}
