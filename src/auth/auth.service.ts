import * as argon from 'argon2';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { PrismaService } from '../prisma/prisma.service';

import { AuthDto } from './dto';
import { AuthErrors } from './auth.errors';

@Injectable({})
export class AuthService extends AuthErrors {
  constructor(
    private prima: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {
    super();
  }

  async signup(dto: AuthDto) {
    try {
      const { password, email, firstName, lastName } = dto;
      const hash = await argon.hash(password);

      const user = await this.prima.user.create({
        data: {
          email,
          hash,
          firstName,
          lastName,
        },
      });

      const userWithJWT = this.signToken(user.id, user.email);

      return userWithJWT;
    } catch (error) {
      this.throwPrismaOrRegularError(error);
    }
  }

  async signin(dto: AuthDto) {
    const { password, email } = dto;
    const user = await this.prima.user.findUnique({
      where: { email },
    });

    if (!user) this.incorrectCredentialsError();

    const passwordMatchesHash = await argon.verify(
      user.hash,
      password,
    );

    if (!passwordMatchesHash) this.incorrectCredentialsError();

    const userWithJWT = this.signToken(user.id, user.email);

    return userWithJWT;
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{
    access_token: string;
  }> {
    const payload = {
      sub: userId,
      email,
    };

    const secret = this.config.get('JWT_SECRET');
    const access_token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret,
    });

    return { access_token };
  }
}
