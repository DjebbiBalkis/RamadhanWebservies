import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '@entities';
import { RegisterDto, ProfileDto } from '@dtos';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private users: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(
    username: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.users.findOneBy({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { username: user.username, sub: user._id };
      return {
        access_token: this.jwtService.sign(payload),
      };
    }
    throw new HttpException(
      'Invalid username or password',
      HttpStatus.UNAUTHORIZED,
    );
  }

  async register({
    name,
    username,
    password,
    latitude,
    longitude,
    timezone,
  }: RegisterDto) {
    const existingUser = await this.users.findOneBy({ username });
    if (existingUser) {
      throw new UnauthorizedException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.users.create({
      name,
      username,
      password: hashedPassword,
      location: {
        latitude,
        longitude,
        timezone,
        city: await this.city(latitude, longitude),
      },
    });

    return this.users.save(newUser);
  }

  async update(_id: ObjectId, data: ProfileDto) {
    const { password, name, latitude, longitude, timezone } = data;
    const updated: Partial<User> = {
      _id,
      name,
      location: {
        latitude,
        longitude,
        timezone,
        city: await this.city(latitude, longitude),
      },
    };

    if (password) {
      updated.password = await bcrypt.hash(password, 10);
    }

    return this.users.update({ _id }, updated);
  }

  async load(_id: ObjectId) {
    return this.users.findOneByOrFail({ _id });
  }

  private async city(
    latitude: number,
    longitude: number,
  ): Promise<string | null> {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&accept-language=ar`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data && data.address) {
        return (
          data.address.city ||
          data.address.town ||
          data.address.village ||
          data.address.county ||
          'موقع غير معروف'
        );
      }

      return null; // No results found
    } catch (error) {
      console.error('Error fetching city name in Arabic:', error);
      return null;
    }
  }
}
