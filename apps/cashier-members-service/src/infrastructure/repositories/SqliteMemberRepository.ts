import { Inject, Injectable } from '@nestjs/common';
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { eq } from 'drizzle-orm';
import { Member } from '../../domain/entities/Member';
import { MemberRepository } from '../../application/interfaces/MemberRepository';
import { DATABASE_CONNECTION } from '../database/database.provider';
import * as schema from '../database/schema';

@Injectable()
export class SqliteMemberRepository implements MemberRepository {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: BetterSQLite3Database<typeof schema>,
  ) {}

  async findById(id: string): Promise<Member | null> {
    const result = await this.db.query.members.findFirst({
      where: eq(schema.members.id, id),
    });

    if (!result) {
      return null;
    }

    return new Member(result.id, result.firstName, result.lastName, result.points);
  }
}
