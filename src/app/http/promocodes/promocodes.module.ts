import { ConfigModule, ConfigService, PrismaModule } from '@/libs/common';
import { Module } from '@nestjs/common/decorators/modules';
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
