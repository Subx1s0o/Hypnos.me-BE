import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminGuard } from 'src/admin/admin.guard';
import { ApplyPromoCodeDto, CreatePromoCodeDto } from './dto';
import { PromocodesService } from './promocodes.service';

@ApiTags('promocodes')
@Controller('promocodes')
export class PromocodesController {
  constructor(private readonly promocodesService: PromocodesService) {}

  @UseGuards(AdminGuard)
  @Post()
  async create(@Body() createPromoCodeDto: CreatePromoCodeDto) {
    return await this.promocodesService.create(createPromoCodeDto);
  }

  @UseGuards(AdminGuard)
  @Get()
  async findAll() {
    return await this.promocodesService.findAll();
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.promocodesService.remove(id);
  }

  @Post('apply')
  async apply(@Body() applyPromoCodeDto: ApplyPromoCodeDto) {
    return await this.promocodesService.applyPromoCode(applyPromoCodeDto.code);
  }
}
