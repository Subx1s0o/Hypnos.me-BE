import { ApiProperty } from '@nestjs/swagger';

export class TokensResponse {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  accessTokenValidUntil: Date;

  @ApiProperty()
  refreshTokenValidUntil: Date;
}
