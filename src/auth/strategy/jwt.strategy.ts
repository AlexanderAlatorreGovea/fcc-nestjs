import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

import { JTW } from './constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  JTW,
) {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate<T>(payload: { sub: number; email: string }) {
    const userById = {
      where: { id: payload.sub },
    };

    const user = await this.prisma.user.findUnique(userById);

    delete user.hash;
    
    return user;
  }
}
