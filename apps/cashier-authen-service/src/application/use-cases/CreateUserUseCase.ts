import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/UserRepository';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userData: { userId: string; fullName: string; roleId: number; pin: string }) {
    return this.userRepository.create({
      userId: userData.userId,
      fullName: userData.fullName,
      roleId: userData.roleId,
      pinHash: userData.pin, // In a real app, hash this!
      status: 'active',
    });
  }
}
