import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private allowedRoles: string[]) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    if (!this.allowedRoles.includes(user['role'])) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}

export const Roles = (...roles: string[]) => {
  return (target: any) => {
    Reflect.defineMetadata('roles', roles, target);
  };
};
