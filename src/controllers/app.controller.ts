import {
  Body,
  Controller,
  Get,
  Post,
  Render,
  UseGuards,
  Res,
  Req,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { Response } from 'express';

import { JwtAuthGuard } from '@guards';
import { AuthService } from '@services';
import { LoginDto, ProfileDto, RegisterDto } from '@dtos';

@Controller()
export class AppController {
  constructor(private readonly authentication: AuthService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @Render('index')
  async dashboard(
    @Req() request: Request & { user: { userId: string } },
    @Res() response: Response,
  ) {
    const { location } = await this.authentication.load(
      new ObjectId(request.user.userId),
    );
    if (location) {
      return response.redirect('/ramadan-schedule');
    } else {
      return response.redirect('/profile');
    }
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @Render('profile')
  async profile(@Req() request: Request & { user: { userId: string } }) {
    return {
      ...(await this.authentication.load(new ObjectId(request.user.userId))),
    };
  }

  @Get('/login')
  @Render('login')
  login() {
    return {};
  }

  @Get('/register')
  @Render('register')
  register() {
    return {};
  }

  @Post('register')
  @Render('register')
  async doRegister(@Body() data: RegisterDto, @Res() response: Response) {
    await this.authentication.register(data);

    return this.doLogin(
      { username: data.username, password: data.password },
      response,
    );
  }

  @Post('login')
  @Render('login')
  async doLogin(
    @Body() { username, password }: LoginDto,
    @Res() response: Response,
  ) {
    const { access_token } = await this.authentication.login(
      username,
      password,
    );

    await response.cookie('auth_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 3600000,
    });

    return response.redirect('/');
  }

  @Post('profile')
  @UseGuards(JwtAuthGuard)
  @Render('profile')
  async doProfile(
    @Body() profile: ProfileDto,
    @Req() request: Request & { user: { userId: string } },
    @Res() res: Response,
  ) {
    const user_id = new ObjectId(request.user.userId);
    await this.authentication.update(user_id, profile);
    return res.redirect('/profile');
  }

  @Get('logout')
  logout(@Res() res: Response) {
    // Clear the auth_token cookie
    res.clearCookie('auth_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    // Redirect to login page or send a response
    return res.redirect('/login');
  }
}
