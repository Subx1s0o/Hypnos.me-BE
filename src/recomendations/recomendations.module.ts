import { Module } from '@nestjs/common';
import { RecomendationsService } from './recomendations.service';
import { RecomendationsController } from './recomendations.controller';

@Module({
  imports: [],
  controllers: [RecomendationsController],
  providers: [RecomendationsService],
  exports: [RecomendationsService],
})
export class RecomendationsModule {}
