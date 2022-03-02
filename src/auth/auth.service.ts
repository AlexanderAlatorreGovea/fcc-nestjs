import * as argon from 'argon2';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable({})
export class AuthService {
  constructor(private prima: PrismaService) {}

  async signup(dto: AuthDto) {
    try {
      const { password, email } = dto;
      const hash = await argon.hash(password);

      const user = await this.prima.user.create({
        data: {
          email,
          hash,
        },
      });

      delete user.hash;

      return user;
    } catch (error) {
      this.throwPrismaOrRegularError(error);
    }
  }

  async signin(dto: AuthDto) {
    const user = await this.prima.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) this.incorrectCredentialsError();

    const passwordMatchesHash = await argon.verify(
      user.hash,
      dto.password,
    );

    if (!passwordMatchesHash) this.incorrectCredentialsError();

    delete user.hash;

    return user;
  }

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
