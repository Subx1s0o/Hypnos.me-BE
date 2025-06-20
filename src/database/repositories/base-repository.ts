import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

interface RepositoryConfig<TModel extends Prisma.ModelName> {
  table: TModel;
  ttl?: number;
}

@Injectable()
export abstract class BaseRepository<
  TModel extends Prisma.ModelName,
  TData = any,
> {
  private readonly defaultCacheTTL: number;
  protected readonly modelName: TModel;

  @Inject(CACHE_MANAGER)
  private cacheManager!: Cache;

  @Inject(PrismaService)
  protected prisma!: PrismaService;

  constructor(config: RepositoryConfig<TModel>) {
    this.modelName = config.table;
    this.defaultCacheTTL = config.ttl || 5 * 60 * 1000;
  }

  protected getModel() {
    return (this.prisma as any)[this.modelName];
  }

  protected getPrimaryModel() {
    const client = this.prisma as any;
    if (client.$primary) {
      return client.$primary()[this.modelName];
    }
    return client[this.modelName];
  }

  async get(
    args: any & { omit?: Record<string, boolean> },
    options: { useCache?: boolean; ttl?: number; usePrimary?: boolean } = {},
  ): Promise<TData | null> {
    try {
      const { useCache = true, ttl, usePrimary = false } = options;
      const cacheKey = this.getCacheKey('get', args);

      if (useCache) {
        const cached = await this.getFromCache<TData>(cacheKey);
        if (cached) {
          return this.applyOmit(cached, args.omit);
        }
      }

      const { omit, ...prismaArgs } = args;
      const model = usePrimary ? this.getPrimaryModel() : this.getModel();
      const result = await model.findUnique(prismaArgs);

      if (useCache && result) {
        await this.setCache(cacheKey, result, ttl);
      }

      return this.applyOmit(result, omit);
    } catch (error) {
      console.error(`Error in ${this.modelName}.get:`, error);
      throw error;
    }
  }

  async getMany(
    args?: Prisma.Args<Prisma.TypeMap['model'][TModel], 'findMany'> & {
      omit?: Record<string, boolean>;
    },
    options: { useCache?: boolean; ttl?: number; usePrimary?: boolean } = {},
  ): Promise<TData[]> {
    try {
      const { useCache = true, ttl, usePrimary = false } = options;
      const cacheKey = this.getCacheKey('getMany', args);

      if (useCache) {
        const cached = await this.getFromCache<TData[]>(cacheKey);
        if (cached) {
          return this.applyOmitToArray(cached, args?.omit);
        }
      }

      const { omit, ...prismaArgs } = args || {};
      const model = usePrimary ? this.getPrimaryModel() : this.getModel();
      const result = await model.findMany(
        Object.keys(prismaArgs).length > 0 ? prismaArgs : undefined,
      );

      if (useCache) {
        await this.setCache(cacheKey, result, ttl);
      }

      return this.applyOmitToArray(result, omit);
    } catch (error) {
      console.error(`Error in ${this.modelName}.getMany:`, error);
      throw error;
    }
  }

  async count(
    args?: Prisma.Args<Prisma.TypeMap['model'][TModel], 'count'>,
    options: { useCache?: boolean; ttl?: number; usePrimary?: boolean } = {},
  ): Promise<number> {
    try {
      const { useCache = true, ttl, usePrimary = false } = options;
      const cacheKey = this.getCacheKey('count', args);

      if (useCache) {
        const cached = await this.getFromCache<number>(cacheKey);

        if (cached !== null) {
          return cached;
        }
      }

      const model = usePrimary ? this.getPrimaryModel() : this.getModel();
      const result = await model.count(args);

      if (useCache) {
        await this.setCache(cacheKey, result, ttl);
      }

      return result;
    } catch (error) {
      console.error(`Error in ${this.modelName}.count:`, error);
      throw error;
    }
  }

  async create(
    args: Prisma.Args<Prisma.TypeMap['model'][TModel], 'create'>,
    options: { invalidateCache?: boolean } = {},
  ): Promise<TData> {
    try {
      const { invalidateCache = true } = options;

      const result = await this.getPrimaryModel().create(args);

      if (invalidateCache) {
        // Cache the new object
        const cacheKey = this.getCacheKey('get', { where: { id: result.id } });
        await this.setCache(cacheKey, result);

        // Invalidate getMany and count caches as they might now be stale
        await this.clearCacheByPattern(`${this.modelName}:getMany`);
        await this.clearCacheByPattern(`${this.modelName}:count`);
      }

      return result;
    } catch (error) {
      console.error(`Error in ${this.modelName}.create:`, error);
      throw error;
    }
  }

  async update(
    args: Prisma.Args<Prisma.TypeMap['model'][TModel], 'update'> & {
      omit?: Record<string, boolean>;
    },
    options: { invalidateCache?: boolean } = {},
  ): Promise<TData> {
    try {
      const { invalidateCache = true } = options;

      const { omit, ...prismaArgs } = args;
      const result = await this.getPrimaryModel().update(prismaArgs);

      if (invalidateCache) {
        const cacheKey = this.getCacheKey('get', {
          where: (prismaArgs as any).where,
        });
        await this.setCache(cacheKey, result);

        // Invalidate getMany and count caches as they might now be stale
        await this.clearCacheByPattern(`${this.modelName}:getMany`);
        await this.clearCacheByPattern(`${this.modelName}:count`);
      }

      return this.applyOmit(result, omit);
    } catch (error) {
      console.error(`Error in ${this.modelName}.update:`, error);
      throw error;
    }
  }

  async upsert(
    args: Prisma.Args<Prisma.TypeMap['model'][TModel], 'upsert'>,
    options: { invalidateCache?: boolean } = {},
  ): Promise<TData> {
    try {
      const { invalidateCache = true } = options;

      const result = await this.getPrimaryModel().upsert(args);

      if (invalidateCache) {
        const cacheKey = this.getCacheKey('get', args);
        await this.setCache(cacheKey, result);
      }

      return result;
    } catch (error) {
      console.error(`Error in ${this.modelName}.upsert:`, error);
      throw error;
    }
  }

  async delete(
    args: Prisma.Args<Prisma.TypeMap['model'][TModel], 'delete'>,
    options: { invalidateCache?: boolean } = {},
  ): Promise<void> {
    try {
      const { invalidateCache = true } = options;

      await this.getPrimaryModel().delete(args);

      if (invalidateCache) {
        const cacheKey = this.getCacheKey('get', args);
        await this.cacheManager.del(cacheKey);

        // Invalidate getMany and count caches as they might now be stale
        await this.clearCacheByPattern(`${this.modelName}:getMany`);
        await this.clearCacheByPattern(`${this.modelName}:count`);
      }
    } catch (error) {
      console.error(`Error in ${this.modelName}.delete:`, error);
      throw error;
    }
  }

  async clearCache(): Promise<void> {
    await this.clearCacheByPattern(this.modelName);
  }

  async getCacheStats(): Promise<{ size: number; keys: string[] }> {
    try {
      const allKeys = (await this.cacheManager.store.keys?.()) || [];
      const modelKeys = allKeys.filter((key) => key.startsWith(this.modelName));
      return {
        size: modelKeys.length,
        keys: modelKeys,
      };
    } catch (error) {
      return { size: 0, keys: [] };
    }
  }

  async wrap<T>(
    cacheKey: string,
    operation: () => Promise<T>,
    options: { useCache?: boolean } = {},
  ): Promise<T> {
    const { useCache = true } = options;
    const fullCacheKey = `${this.modelName}:custom:${cacheKey}`;

    if (useCache) {
      const cached = await this.getFromCache<T>(fullCacheKey);
      if (cached !== null) {
        return cached;
      }
    }

    const result = await operation();

    if (useCache && result) {
      await this.setCache(fullCacheKey, result, this.defaultCacheTTL);
    }

    return result;
  }

  private getCacheKey(method: string, args: any): string {
    if (args?.where?.id) {
      return `${this.modelName}:${args.where.id}`;
    }

    if (!args || !args.where) {
      return `${this.modelName}:${method}:all`;
    }

    const sortedWhere = Object.keys(args.where)
      .sort()
      .reduce((obj, key) => {
        obj[key] = args.where[key];
        return obj;
      }, {} as any);

    return `${this.modelName}:${method}:${JSON.stringify(sortedWhere)}`;
  }

  private async getFromCache<T>(key: string): Promise<T | null> {
    try {
      const cached = await this.cacheManager.get<T>(key);
      if (cached !== undefined && cached !== null) {
        return cached;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  private async setCache<T>(key: string, data: T, ttl?: number): Promise<void> {
    try {
      const cacheTTL = ttl || this.defaultCacheTTL;
      await this.cacheManager.set(key, data, cacheTTL);
    } catch (error) {}
  }

  private async clearCacheByPattern(pattern: string): Promise<void> {
    try {
      const keys = await this.cacheManager.store.keys?.(`${pattern}*`);
      if (keys?.length) {
        await Promise.all(keys.map((key) => this.cacheManager.del(key)));
      }
    } catch (error) {}
  }

  private applyOmit<T>(
    data: T | null,
    omit?: Record<string, boolean>,
  ): T | null {
    if (!data || !omit) {
      return data;
    }

    const keysToOmit = Object.keys(omit).filter((key) => omit[key]);
    if (keysToOmit.length === 0) {
      return data;
    }

    const result = { ...data };
    keysToOmit.forEach((key) => {
      delete (result as any)[key];
    });

    return result;
  }

  private applyOmitToArray<T>(data: T[], omit?: Record<string, boolean>): T[] {
    if (!data || !omit) {
      return data;
    }

    return data
      .map((item) => this.applyOmit(item, omit))
      .filter(Boolean) as T[];
  }

  async transaction<T>(
    operation: (prisma: any) => Promise<T>,
    options?: any,
  ): Promise<T> {
    try {
      return await (this.prisma as any).$transaction(operation, options);
    } catch (error) {
      console.error(`Error in ${this.modelName}.transaction:`, error);
      throw error;
    }
  }
}
