import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

export class AuthErrors {
  throwPrismaOrRegularError(error) {
    const FORBIDDEN_CREDENTIALS_ERROR_CODE = 'P2002';
    const isPrismaError =
      error instanceof PrismaClientKnownRequestError &&
      error.code === FORBIDDEN_CREDENTIALS_ERROR_CODE;

    if (isPrismaError) {
      throw new ForbiddenException('Credentials taken');
    }

    throw error;
  }

  throwAdminException() {
    throw new UnauthorizedException('You do not have enough credential for this operation')
  }

  incorrectCredentialsError() {
    throw new ForbiddenException('Credentials Incorrect');
  }
}
