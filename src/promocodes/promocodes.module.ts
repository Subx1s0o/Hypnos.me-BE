import { Module } from '@nestjs/common/decorators/modules';
import { JwtModule } from '@nestjs/jwt';
import { PromocodesController } from './promocodes.controller';
import { PromocodesService } from './promocodes.service';
import { config } from '@/core/config';

@Module({
  imports: [
    JwtModule.register({
      secret: config.jwt.secret,
    }),
  ],
  controllers: [PromocodesController],
  providers: [PromocodesService],
})
export class PromocodesModule {}
