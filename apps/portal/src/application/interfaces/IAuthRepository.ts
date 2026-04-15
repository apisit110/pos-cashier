import { User } from '../../domain/entities/User'

export interface IAuthRepository {
  login (username: string, password: string): Promise<User | null>
}
