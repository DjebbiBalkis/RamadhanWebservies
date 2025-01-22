import { Injectable } from '@nestjs/common';

import { PrayersScheduleInterface } from '@interfaces';

@Injectable()
export class DateParserService {
  getTime(date: Date, timeZone: string): string {
    const formatter = new Intl.DateTimeFormat('ar-TN', {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    return formatter.format(date);
  }

  prayers(prayers: PrayersScheduleInterface, timezone: string) {
    const times = [
      'imsak',
      'fajr',
      'dhuhr',
      'asr',
      'maghrib',
      'isha',
      'current',
      'sunrise',
    ];
    return Object.fromEntries(
      Object.entries(prayers).map(([key, value]) => [
        key,
        times.includes(key) ? this.getTime(value, timezone) : value,
      ]),
    );
  }
}
