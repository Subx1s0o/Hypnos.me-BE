import { Module } from '@nestjs/common';
import { AdminGuard } from 'src/admin/admin.guard';
import { AdminModule } from 'src/admin/admin.module';
import { AuthModule } from 'src/auth/auth.module';
import { PromocodesController } from './promocodes.controller';
import { PromocodesService } from './promocodes.service';

@Module({
  imports: [AdminModule, AuthModule],
  controllers: [PromocodesController],
  providers: [PromocodesService, AdminGuard],
})
export class PromocodesModule {}
