import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class InternalGuard implements CanActivate {
  // In a real app, this would come from process.env.INTERNAL_SECRET
  private readonly INTERNAL_SECRET = 'lightning-pos-internal-shared-secret';

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const internalKey = request.headers['x-internal-secret'];

    if (internalKey !== this.INTERNAL_SECRET) {
      throw new UnauthorizedException('Invalid internal service secret');
    }

    return true;
  }
}
