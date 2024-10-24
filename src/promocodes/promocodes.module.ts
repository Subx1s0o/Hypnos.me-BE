import { Module } from '@nestjs/common';
import { AdminModule } from 'src/admin/admin.module';
import { AuthModule } from 'src/auth/auth.module';
import { PromocodesController } from './promocodes.controller';
import { PromocodesService } from './promocodes.service';

@Module({
  imports: [AdminModule, AuthModule],
  controllers: [PromocodesController],
  providers: [PromocodesService],
})
export class PromocodesModule {}
