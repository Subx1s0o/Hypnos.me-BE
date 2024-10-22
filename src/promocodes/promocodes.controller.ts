import { Controller } from '@nestjs/common';
import { PromocodesService } from './promocodes.service';

@Controller('promocodes')
export class PromocodesController {
  constructor(private readonly promocodesService: PromocodesService) {}
}
