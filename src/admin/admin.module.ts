import { CacheModule } from '@/cache/cache.module';
import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';

@Module({
  imports: [CacheModule],
  providers: [AdminService],
})
export class AdminModule {}
