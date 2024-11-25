// import { Auth } from '@lib/entities/decorators';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common/decorators';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Promocode } from 'types';
import { ApplyPromocodeDto, CreatePromocodeDto } from './dto';
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
  // @Auth('admin')
  async create(@Body() createPromoCodeDto: CreatePromocodeDto): Promise<void> {
    return await this.promocodesService.create(createPromoCodeDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Retrieved all promocodes.',
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
  async findAll(): Promise<Promocode[]> {
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
  // @Auth('admin')
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
  async apply(@Body() applyPromocodeDto: ApplyPromocodeDto): Promise<void> {
    return await this.promocodesService.apply(applyPromocodeDto);
  }
}
