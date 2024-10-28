import { PrismaService } from '@lib/common';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    let verified = null;
    try {
      verified = await this.jwtService.verifyAsync(token);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException(
          'Token has expired, please log in again',
        );
      } else {
        throw new UnauthorizedException('The Token is Invalid');
      }
    }

    const user = await this.prismaService.users.findUnique({
      where: { id: verified.id },
    });

    if (!user) {
      throw new NotFoundException("The User wasn't Found, try Sign-Up ");
    }

    if (user.role !== 'admin') {
      throw new ForbiddenException('Access denied: Admins only');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
