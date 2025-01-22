import { ObjectId } from 'mongodb';
import { Controller, Get, Render, Req, UseGuards } from '@nestjs/common';

import {
  AuthService,
  DateParserService,
  PrayersService,
  QuranService,
  RamadanService,
} from '@services';
import { JwtAuthGuard } from '@guards';

@Controller()
export class RamadanController {
  constructor(
    private readonly quran: QuranService,
    private readonly ramadan: RamadanService,
    private readonly prayers: PrayersService,
    private readonly parser: DateParserService,
    private readonly authentication: AuthService,
  ) {}

  @Get('ramadan-schedule')
  @UseGuards(JwtAuthGuard)
  @Render('ramadan')
  async schedule(@Req() request: Request & { user: { userId: string } }) {
    const user_id = new ObjectId(request.user.userId);
    const { location } = await this.authentication.load(user_id);
    const { latitude, longitude, timezone, city } = location;
    const prayers = this.parser.prayers(
      this.prayers.schedule(latitude, longitude, timezone),
      timezone,
    );
    const schedule = this.ramadan
      .schedule(latitude, longitude, timezone)
      .map((item) => this.parser.prayers(item, timezone));
    const next_prayer = this.prayers.next(latitude, longitude, timezone);

    return {
      next_prayer: {
        ...next_prayer,
        string_time: this.parser.getTime(next_prayer.timestamp, timezone),
      },
      prayers,
      schedule,
      city,
    };
  }
}
