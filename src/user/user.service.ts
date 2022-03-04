import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async editUser(userId: number, dto: EditUserDto) {
    const userIdMatches = { id: userId };
    const updatedUserData = { ...dto };

    const user = await this.prisma.user.update({
      where: userIdMatches,
      data: updatedUserData,
    });

    delete user.hash;

    return user;
  }
}
