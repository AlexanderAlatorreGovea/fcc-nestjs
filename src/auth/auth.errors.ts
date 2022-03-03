import { ForbiddenException } from '@nestjs/common';
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

  incorrectCredentialsError() {
    throw new ForbiddenException('Credentials Incorrect');
  }
}
