import { ConfigService } from '@/libs/common';
import { Injectable } from '@nestjs/common/decorators';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { CanActivate, ExecutionContext } from '@nestjs/common/interfaces';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException("The Token isn't provided");
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.config.get('JWT_SECRET') as string,
      });

      request['user'] = payload.id;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('The Token is Expired, Please Sign-In');
      } else {
        throw new UnauthorizedException('The Token is Invalid, Please Sign-In');
      }
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
