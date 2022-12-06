import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';


import { User } from './entities/user.entity';
import { CreateUserDto, LoginUserDto } from './dto';
import { JwtPayload } from './interfaces';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {
  }

  async checkAuthStatus(user: User) {

    const newToken = this.generateJwt({ id: user.id });

    return { ...user, token: newToken };
  }

  async create(createUserDto: CreateUserDto) {
    try {

      const { password, ...userData } = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      await this.userRepository.save(user);
      delete user.password;

      return {
        ...user,
        token: this.generateJwt({ id: user.id }),
      };

    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true },
    });

    if (!user) throw new UnauthorizedException(`Credentials are not valid (user)`);

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException(`Credentials are not valid (password)`);

    return {
      ...user,
      token: this.generateJwt({ id: user.id }),
    };
  }


  generateJwt(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  private handleDbErrors(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    console.log(error);
    throw new InternalServerErrorException(`Server error - Check server logs`);

  }

  async findOne(id: string) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) throw new NotFoundException(`User with ID: ${id} not found.`);

    return user;
  }
}
