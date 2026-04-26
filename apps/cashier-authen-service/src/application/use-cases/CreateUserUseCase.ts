import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userData: { userId?: string; fullName: string; roleId: number; pin: string }) {
    const userId = userData.userId || `TEMP_${uuidv4().substring(0, 8)}`;

    return this.userRepository.create({
      userId: userId,
      fullName: userData.fullName,
      roleId: userData.roleId,
      pinHash: userData.pin, // In a real app, hash this!
      status: 'pending_sync',
    });
  }
}
