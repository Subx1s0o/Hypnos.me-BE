import { PrismaService } from '@/database/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BonusesService {
  constructor(private readonly prisma: PrismaService) {}
}
