import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PromocodesService } from './promocodes.service';

@Controller('promocodes')
@ApiTags('promocodes')
export class PromocodesController {
  constructor(private readonly promocodesService: PromocodesService) {}
}
