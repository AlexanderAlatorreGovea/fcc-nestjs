import * as argon from 'argon2';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';

@Injectable({})
export class AuthService {
  constructor(private prima: PrismaService) {}

  async signup(dto: AuthDto) {
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
  }

  signin() {
    return 'I have signed up';
  }
}
