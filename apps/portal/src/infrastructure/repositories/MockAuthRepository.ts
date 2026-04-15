import { IAuthRepository } from '../../application/interfaces/IAuthRepository'
import { User } from '../../domain/entities/User'

export class MockAuthRepository implements IAuthRepository {
  async login (username: string, password: string): Promise<User | null> {
    // Artificial delay to simulate network call
    await new Promise((resolve) => setTimeout(resolve, 800))

    if (username === 'admin' && password === 'admin') {
      return new User(
        '1',
        'admin',
        'ADMIN'
      )
    }

    return null
  }
}
