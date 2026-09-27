import { ActivateTerminalResult } from '../../../application/usecases/ActivateTerminalUseCase';

export class ActivateTerminalResponseDto {
  private constructor(
    readonly tid: string,
    readonly mid: string,
    readonly sid: string,
  ) {}

  static fromResult(result: ActivateTerminalResult): ActivateTerminalResponseDto {
    return new ActivateTerminalResponseDto(result.tid, result.mid, result.sid);
  }

  toJSON() {
    return {
      tid: this.tid,
      mid: this.mid,
      sid: this.sid,
    };
  }
}
