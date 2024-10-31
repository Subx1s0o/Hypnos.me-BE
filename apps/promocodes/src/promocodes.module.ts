import { ConfigService } from '@lib/common';
import { AuthGuard } from '@lib/entities/guards/auth.guard';
import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PromocodesController } from './promocodes.controller';
import { PromocodesService } from './promocodes.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') as string,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [PromocodesController],
  providers: [PromocodesService, JwtService, AuthGuard],
})
export class PromocodesModule {}
