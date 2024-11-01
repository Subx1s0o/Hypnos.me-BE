import { ConfigModule, ConfigService, PrismaModule } from '@lib/common';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PromocodesController } from './promocodes.controller';
import { PromocodesService } from './promocodes.service';

@Module({
  imports: [
    PrismaModule,
    ConfigModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') as string,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [PromocodesController],
  providers: [PromocodesService],
})
export class PromocodesModule {}
