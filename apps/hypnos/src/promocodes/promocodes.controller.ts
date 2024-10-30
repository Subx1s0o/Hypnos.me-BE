import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { PromoCode } from 'types/promocode.type';
import { ApplyPromoCodeDto, CreatePromoCodeDto } from './dto';
import { PromocodesService } from './promocodes.service';

@ApiTags('promocodes')
@Controller('promocodes')
export class PromocodesController {
  constructor(private readonly promocodesService: PromocodesService) {}

  @Post()
  @ApiResponse({
    status: 200,
    description: 'Promocode was successfully created.',
  })
  @ApiResponse({
    status: 409,
    description: 'The Promocode with the same name already exists.',
  })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Token is wrong or expired',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied: Admins only.',
  })
  async create(@Body() createPromoCodeDto: CreatePromoCodeDto): Promise<void> {
    return await this.promocodesService.create(createPromoCodeDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Retrieved all promocodes.',
    type: [PromoCode],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Token is wrong or expired',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied: Admins only.',
  })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async findAll(): Promise<PromoCode[]> {
    return await this.promocodesService.findAll();
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Promocode was successfully deleted.',
    schema: {
      example: {
        status: 200,
        message: 'Promocode was successfully deleted.',
        discount: 10,
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Token is wrong or expired',
  })
  @ApiResponse({
    status: 404,
    description: "The promocode with that ID wasn't found.",
  })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @ApiResponse({
    status: 403,
    description: 'Access denied: Admins only.',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.promocodesService.remove(id);
  }

  @Post('apply')
  @ApiResponse({
    status: 200,
    description: 'Promocode applied successfully.',
    schema: {
      example: {
        status: 200,
        message: 'Promocode applied successfully',
        discount: 10,
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Promocode not found.' })
  @ApiResponse({
    status: 400,
    description: 'Promocode has expired or been used up.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Token is wrong or expired',
  })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async apply(@Body() applyPromoCodeDto: ApplyPromoCodeDto): Promise<void> {
    return await this.promocodesService.applyPromoCode(applyPromoCodeDto.code);
  }
}
