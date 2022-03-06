import {
  CanActivate,
  ExecutionContext,
  Type,
  mixin,
} from '@nestjs/common';

import { Role } from '../role.enum';

export const RolesGuard = (role: Role): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest();
      const user = request.user;

      return user?.roles.includes(role);
    }
  }

  return mixin(RoleGuardMixin);
};
