import * as hijri from 'hijri-converter';
import * as moment from 'moment-timezone';
import { Injectable } from '@nestjs/common';

import { PrayersService } from './prayers.service';
import { PrayersScheduleInterface } from '@interfaces';

@Injectable()
export class RamadanService {
  private readonly hijri = new Intl.DateTimeFormat('ar-TN-u-ca-islamic', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  private readonly gregorian = new Intl.DateTimeFormat('ar-TN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  constructor(private readonly prayers: PrayersService) {}

  public dates(timezone: string): { start: string; end: string } {
    const today = moment().tz(timezone);
    const hijriDate = hijri.toHijri(
      today.year(),
      today.month() + 1,
      today.date(),
    );

    // Calculate Hijri Ramadhan dates
    const hijriYear = hijriDate.hy;
    const ramadhanStart = hijri.toGregorian(hijriYear, 9, 1);
    const ramadhanEnd = hijri.toGregorian(hijriYear, 9, 30);

    const ramadhanStartDate = moment
      .tz([ramadhanStart.gy, ramadhanStart.gm - 1, ramadhanStart.gd], timezone)
      .format('YYYY-MM-DD');
    const ramadhanEndDate = moment
      .tz([ramadhanEnd.gy, ramadhanEnd.gm - 1, ramadhanEnd.gd], timezone)
      .format('YYYY-MM-DD');

    // Check if Ramadhan has passed
    if (today.isAfter(moment(ramadhanEndDate).tz(timezone))) {
      const nextYear = hijriYear + 1;
      const nextRamadhanStart = hijri.toGregorian(nextYear, 9, 1);
      const nextRamadhanEnd = hijri.toGregorian(nextYear, 9, 30);

      return {
        start: moment
          .tz(
            [
              nextRamadhanStart.gy,
              nextRamadhanStart.gm - 1,
              nextRamadhanStart.gd,
            ],
            timezone,
          )
          .format('YYYY-MM-DD'),
        end: moment
          .tz(
            [nextRamadhanEnd.gy, nextRamadhanEnd.gm - 1, nextRamadhanEnd.gd],
            timezone,
          )
          .format('YYYY-MM-DD'),
      };
    }

    return { start: ramadhanStartDate, end: ramadhanEndDate };
  }

  public schedule(
    latitude: number,
    longitude: number,
    timezone: string,
  ): PrayersScheduleInterface[] {
    const { start, end } = this.dates(timezone);
    const startDate = moment.tz(start, timezone);
    const endDate = moment.tz(end, timezone);

    const schedule = [];

    for (
      let date = moment(startDate);
      date.isSameOrBefore(endDate);
      date.add(1, 'day')
    ) {
      schedule.push(
        this.prayers.schedule(latitude, longitude, timezone, date.toDate()),
      );
    }

    return schedule;
  }
}
