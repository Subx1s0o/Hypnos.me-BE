import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { OwnerModule } from '../owner/owner.module';
import { PromocodesController } from './promocodes.controller';
import { PromocodesService } from './promocodes.service';

@Module({
  imports: [OwnerModule, AuthModule],
  controllers: [PromocodesController],
  providers: [PromocodesService],
})
export class PromocodesModule {}
