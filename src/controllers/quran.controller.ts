import { ObjectId } from 'mongodb';
import { JwtAuthGuard } from '@guards';
import {
  Body,
  Controller,
  Get,
  Patch,
  Render,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AuthService, QuranService } from '@services';

@Controller()
export class QuranController {
  constructor(
    private readonly quran: QuranService,
    private readonly authentication: AuthService,
  ) {}

  @Get('quran')
  @UseGuards(JwtAuthGuard)
  @Render('quran')
  async seal(@Req() request: Request & { user: { userId: string } }) {
    const user_id = new ObjectId(request.user.userId);
    const { ayah, started_at, ends_at } =
      await this.authentication.load(user_id);
    return this.quran.seal(ayah, started_at, ends_at);
  }

  @Patch('api/mark-ayah')
  @UseGuards(JwtAuthGuard)
  async mark(
    @Body('ayahNumber') ayah: number,
    @Req() request: Request & { user: { userId: string } },
  ) {
    const user_id = new ObjectId(request.user.userId);
    const { started_at } = await this.authentication.load(user_id);

    return this.quran.mark(user_id, ayah, started_at || new Date());
  }
}
