import { Module } from '@nestjs/common';

import { CacheModule } from '@lib/common';
import { GoodsController } from './goods.controller';

@Module({
  imports: [CacheModule],
  controllers: [GoodsController],
})
export class GoodsModule {}
