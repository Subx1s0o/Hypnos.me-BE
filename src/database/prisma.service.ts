import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { readReplicas } from '@prisma/extension-read-replicas';
import 'dotenv/config';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private _client: ReturnType<typeof this.createExtendedClient>;

  constructor() {
    this._client = this.createExtendedClient();
    return Object.assign(this, this._client);
  }

  private createExtendedClient() {
    const baseClient = new PrismaClient();

    if (process.env.DATABASE_REPLICA_URL) {
      return baseClient.$extends(
        readReplicas({
          url: process.env.DATABASE_REPLICA_URL,
        }),
      );
    }

    return baseClient;
  }

  async onModuleInit() {
    await this._client.$connect();
  }

  async onModuleDestroy() {
    await this._client.$disconnect();
  }
}
