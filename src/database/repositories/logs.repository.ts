import { BaseRepository } from '@/database/repositories/base-repository';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

interface LogEntry {
  id: string;
  createdAt: Date;
  name: string;
  data: any;
  rrn?: string;
}

@Injectable()
export class LogsRepository extends BaseRepository<'logs', LogEntry> {
  constructor() {
    super({ table: 'logs' });
  }

  async logError(name: string, data?: any, rrn?: string): Promise<LogEntry> {
    return super.create({
      data: {
        name,
        data: data || {},
        rrn,
      },
    });
  }

  async getMany(args?: Prisma.logsFindManyArgs): Promise<LogEntry[]> {
    return super.getMany(args, { useCache: false });
  }

  async search(query: string): Promise<LogEntry[]> {
    const where: Prisma.logsWhereInput = {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { rrn: { contains: query, mode: 'insensitive' } },
      ],
    };

    return this.getMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }
}
