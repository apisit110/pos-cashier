import { IAuthRepository } from '../interfaces/IAuthRepository'
import { User } from '../../domain/entities/User'

export interface LoginRequest {
  username: string
  password: string
}

export type LoginResponse = User | null

export class Login {
  constructor (
    private readonly authRepository: IAuthRepository
  ) {}

  async execute (request: LoginRequest): Promise<LoginResponse> {
    const { username, password } = request
    return await this.authRepository.login(username, password)
  }
}
