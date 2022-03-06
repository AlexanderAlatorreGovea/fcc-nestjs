import { Injectable, UseGuards } from '@nestjs/common';
import { Roles } from '../authorization/decorators/index';
import { RolesGuard } from '../authorization/guards';
import { Role } from '../authorization/role.enum';
import { PrismaService } from '../prisma/prisma.service';
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
 
  @Roles(Role.Admin)
  @UseGuards(RolesGuard(Role.Admin))
  async findAll() {
    const allUsers = this.prisma.user.findMany();

    const sanitizedUsers = (await allUsers).map(
      ({ hash, ...user }) => user,
    );

    return sanitizedUsers;
  }
}
