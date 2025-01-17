import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { jwtConstants } from './constants';
import { Request } from 'express';
import { ContextIdFactory, Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './SkipAuth';
import { error } from 'console';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector){}
  
  async canActivate(context: ExecutionContext,): Promise<boolean> {

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
        throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: jwtConstants.secret
        }
      );
      console.log('Token Payload:', payload);
      request['user'] = payload;
    } catch {
      console.error('Token Verification Failed:', error);
      throw new UnauthorizedException();
      
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ')??[];
    console.log('Authorization Header:', request.headers.authorization);
    console.log('Extracted Token:', token);
    return type === 'Bearer' ? token : undefined;

    
  }
   
}
