import { ForbiddenException, Injectable } from '@nestjs/common';
// import { prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as argon from 'argon2';

import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async signup(dto: AuthDto) {
    try {
      // Generate hash password
      const hashPassword = await argon.hash(dto.password);

      // Save user to database
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hashPassword,
        },
      });

      // Response a success message
      delete user.hashPassword;
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }
  signin() {
    return {
      message: 'Signin',
    };
  }
}
