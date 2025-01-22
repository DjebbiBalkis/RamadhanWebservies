export interface PrayersScheduleInterface {
  gregorian: string;
  hijri: string;
  imsak: Date;
  fajr: Date;
  sunrise: Date;
  dhuhr: Date;
  asr: Date;
  maghrib: Date;
  isha: Date;
  current?: Date;
}
