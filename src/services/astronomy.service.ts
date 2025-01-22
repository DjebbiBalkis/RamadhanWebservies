import { Injectable } from '@nestjs/common';

@Injectable()
export class AstronomyService {
  /**
   * Convert a date to Julian Date
   */
  toJulian(date: Date): number {
    let year = date.getUTCFullYear();
    let month = date.getUTCMonth() + 1;
    const day =
      date.getUTCDate() +
      date.getUTCHours() / 24 +
      date.getUTCMinutes() / 1440 +
      date.getUTCSeconds() / 86400;

    if (month <= 2) {
      year -= 1;
      month += 12;
    }

    const A = Math.floor(year / 100);
    const B = 2 - A + Math.floor(A / 4);

    return (
      Math.floor(365.25 * (year + 4716)) +
      Math.floor(30.6001 * (month + 1)) +
      day +
      B -
      1524.5
    );
  }

  /**
   * Calculate solar declination
   */
  getSolarDeclination(julianDate: number): number {
    const D = julianDate - 2451545.0;
    const g = (357.529 + 0.98560028 * D) % 360;
    const q = (280.459 + 0.98564736 * D) % 360;
    const lambda =
      q +
      1.915 * Math.sin((g * Math.PI) / 180) +
      0.02 * Math.sin((2 * g * Math.PI) / 180);
    const epsilon = 23.439 - 0.00000036 * D;
    return (
      Math.asin(
        Math.sin((epsilon * Math.PI) / 180) *
          Math.sin((lambda * Math.PI) / 180),
      ) *
      (180 / Math.PI)
    );
  }

  /**
   * Calculate the equation of time
   */
  getEquationOfTime(julianDate: number): number {
    const D = julianDate - 2451545.0;
    const g = (357.529 + 0.98560028 * D) % 360;
    const q = (280.459 + 0.98564736 * D) % 360;
    const e = 23.439 - 0.00000036 * D;
    const lambda =
      q +
      1.915 * Math.sin((g * Math.PI) / 180) +
      0.02 * Math.sin((2 * g * Math.PI) / 180);
    const RA =
      Math.atan2(
        Math.cos((e * Math.PI) / 180) * Math.sin((lambda * Math.PI) / 180),
        Math.cos((lambda * Math.PI) / 180),
      ) *
      (180 / Math.PI);
    return (q / 15 - RA / 15) * 60;
  }

  /**
   * Calculate the time for a specific sun angle
   */
  getTimeForAngle(latitude: number, declination: number, angle: number): number {
    const latRad = (latitude * Math.PI) / 180;
    const decRad = (declination * Math.PI) / 180;
    const angleRad = (angle * Math.PI) / 180;

    const numerator = Math.sin(angleRad) - Math.sin(latRad) * Math.sin(decRad);
    const denominator = Math.cos(latRad) * Math.cos(decRad);

    if (denominator === 0) {
      console.warn('Division by zero in getTimeForAngle');
      return NaN;
    }

    const cosHourAngle = numerator / denominator;

    if (cosHourAngle < -1 || cosHourAngle > 1) {
      console.warn('cosHourAngle out of range', { cosHourAngle });
      return NaN;
    }

    try {
      const hourAngleRad = Math.acos(cosHourAngle); // In radians
      return (hourAngleRad * 180) / Math.PI / 15; // Convert to hours
    } catch (error) {
      console.error('Error calculating hour angle', error);
      return NaN;
    }
  }
}
