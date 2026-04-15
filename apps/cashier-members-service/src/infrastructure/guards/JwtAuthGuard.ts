import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.split(' ')[1];
    
    try {
      // Decode the JWT format: header.payload.signature
      const parts = token.split('.');
      if (parts.length !== 3) throw new Error('Invalid token format');
      
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
      
      // Inject user info into request
      request.user = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
