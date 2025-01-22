import { Injectable, Logger } from '@nestjs/common';
import { PrayersScheduleInterface } from '@interfaces';
import { AstronomyService } from './astronomy.service';

@Injectable()
export class PrayersService {
  private readonly logger = new Logger(PrayersService.name);
  private readonly hijriFormatter = new Intl.DateTimeFormat(
    'ar-TN-u-ca-islamic',
    { day: 'numeric', month: 'long', year: 'numeric' },
  );
  private readonly gregorianFormatter = new Intl.DateTimeFormat('ar-TN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  private readonly FAJR_ANGLE = 18;
  private readonly ISHA_ANGLE = 17;

  constructor(private readonly astronomy: AstronomyService) {}

  schedule(
    latitude: number,
    longitude: number,
    timezone: string,
    date = new Date(),
  ): PrayersScheduleInterface {
    const julianDate = this.astronomy.toJulian(date);
    const declination = this.astronomy.getSolarDeclination(julianDate);
    const equationOfTime = this.astronomy.getEquationOfTime(julianDate);

    const solarNoon = (12 - equationOfTime / 60 - longitude / 15) % 24;

    const fajrTime =
      solarNoon -
      this.astronomy.getTimeForAngle(latitude, declination, -this.FAJR_ANGLE);
    const imsakTime = fajrTime - 10 / 60;
    const sunriseTime =
      solarNoon - this.astronomy.getTimeForAngle(latitude, declination, 0);
    const dhuhrTime = solarNoon;
    const asrTime =
      solarNoon +
      this.astronomy.getTimeForAngle(
        latitude,
        declination,
        90 - Math.atan(1 + 1) * (180 / Math.PI),
      );
    const maghribTime =
      solarNoon + this.astronomy.getTimeForAngle(latitude, declination, 0);
    const ishaTime =
      solarNoon +
      this.astronomy.getTimeForAngle(latitude, declination, -this.ISHA_ANGLE);

    const prayers = {
      imsak: this.convertToDate(imsakTime, date),
      fajr: this.convertToDate(fajrTime, date),
      sunrise: this.convertToDate(sunriseTime, date),
      dhuhr: this.convertToDate(dhuhrTime, date),
      asr: this.convertToDate(asrTime, date),
      maghrib: this.convertToDate(maghribTime, date),
      isha: this.convertToDate(ishaTime, date),
    };

    const current = Object.values(prayers)
      .reverse()
      .find((prayer) => prayer < new Date());

    return {
      gregorian: this.gregorianFormatter.format(date),
      hijri: this.hijriFormatter.format(date),
      ...prayers,
      current,
    };
  }

  public next(latitude: number, longitude: number, timezone: string) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const todaySchedule = this.schedule(latitude, longitude, timezone, today);
    const tomorrowSchedule = this.schedule(
      latitude,
      longitude,
      timezone,
      tomorrow,
    );

    const prayers = [
      todaySchedule.imsak,
      todaySchedule.maghrib,
      tomorrowSchedule.imsak,
      tomorrowSchedule.maghrib,
    ];
    const index = prayers.findIndex((prayer) => prayer > today);
    const type = index % 2 === 0 ? 'imsak' : 'maghrib';

    return { type, timestamp: prayers[index] };
  }

  private convertToDate(decimal: number, date: Date): Date {
    if (isNaN(decimal)) {
      this.logger.warn(
        'Invalid decimal input for conversion to Date:',
        decimal,
      );
      return null;
    }

    const hours = Math.floor(decimal);
    const minutes = Math.floor((decimal - hours) * 60);
    const seconds = Math.round(((decimal - hours) * 60 - minutes) * 60);

    const result = new Date(date.valueOf());
    result.setHours(hours, minutes, seconds, 0);
    result.setDate(date.getDate());

    return result;
  }
}
