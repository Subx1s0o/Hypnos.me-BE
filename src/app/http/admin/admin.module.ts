import { CacheModule } from '@lib/common';
import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
@Module({
  imports: [CacheModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
