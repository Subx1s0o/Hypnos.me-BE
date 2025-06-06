import { Controller, Get, Query, Req } from '@nestjs/common';
import { RecomendationsService } from './recomendations.service';
import { NonNecessaryAuth } from '@/core/decorators/NonNecessaryAuth';
import { AuthRequest } from 'types';

@Controller('recomendations')
export class RecomendationsController {
  constructor(private readonly recomendationsService: RecomendationsService) {}

  @Get()
  @NonNecessaryAuth()
  async getUserRecomendations(
    @Req() req: AuthRequest,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('viewed-products') viewedProducts?: string,
  ) {
    const parsedViewedProducts = viewedProducts
      ? JSON.parse(viewedProducts)
      : [];

    if (req.user) {
      return this.recomendationsService.getUserRecomendations(
        +page || 1,
        +limit || 10,
        req.user.id,
      );
    } else {
      return this.recomendationsService.getUserRecomendations(
        +page || 1,
        +limit || 10,
        undefined,
        parsedViewedProducts,
      );
    }
  }
}
