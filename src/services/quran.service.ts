import { ObjectId } from 'mongodb';
import { MongoRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

import { Surah, User } from '@entities';

@Injectable()
export class QuranService implements OnModuleInit {
  private readonly logger = new Logger(QuranService.name);
  private readonly oneDay = 24 * 60 * 60 * 1000;

  constructor(
    @InjectRepository(Surah) private surahs: MongoRepository<Surah>,
    @InjectRepository(User) private users: MongoRepository<User>,
  ) {}

  onModuleInit() {
    this.logger.debug('Downloading Quran Data');
    fetch('https://api.alquran.cloud/v1/quran/ar.alafasy')
      .then((response) => response.json())
      .then(({ data }) => {
        const entities = data.surahs.map((surah) => ({
          number: surah.number,
          name: surah.name,
          ayahs: surah.ayahs.map((ayah) => ({
            number: ayah.number,
            audio: ayah.audio,
            text: ayah.text,
            number_in_surah: ayah.numberInSurah,
          })),
        }));
        return this.surahs.save(entities, { reload: true });
      })
      .then(() => {
        this.logger.debug('Inserted Data');
      })
      .catch(() => {
        this.logger.debug('Already in database');
      });
  }

  async total(): Promise<number> {
    const pipeline = [
      { $unwind: '$ayahs' },
      { $group: { _id: null, total: { $sum: 1 } } },
    ];

    const result: any = await this.surahs.aggregate(pipeline).toArray();

    return result.length > 0 ? result[0].total : 0;
  }

  async mark(_id: ObjectId, ayah: number, started_at: Date) {
    const ends_at = new Date().setDate(started_at.getDate() + 30);
    return this.users.update({ _id }, { ayah, started_at, ends_at });
  }

  async today(start: number, count: number): Promise<Surah[]> {
    try {
      const surahs = await this.surahs.find();

      let remaining = count;
      const results = [];
      let currentStart = start;

      for (const surah of surahs) {
        if (remaining <= 0) break; // Stop if we have fetched enough ayahs

        const filteredAyahs = surah.ayahs.filter(
          (ayah) => ayah.number >= currentStart,
        );

        if (filteredAyahs.length > 0) {
          const ayahsToInclude = filteredAyahs.slice(0, remaining);

          results.push({
            surah: surah.name,
            surahNumber: surah.number,
            ayahs: ayahsToInclude.map((ayah) => ({
              number: ayah.number,
              audio: ayah.audio,
              text: ayah.text,
              number_in_surah: ayah.number_in_surah,
            })),
          });

          remaining -= ayahsToInclude.length;

          currentStart = 1;
        }
      }

      return results;
    } catch (error) {
      this.logger.error('Error fetching ayahs:', error);
      throw error;
    }
  }

  async seal(ayah: number, started_at: Date, ends_at: Date) {
    const today = new Date();
    const diff = Math.abs(
      (ends_at || new Date().setDate(today.getDate() + 30)).valueOf() -
        (started_at || today).valueOf(),
    );

    const remaining = Math.floor(diff / this.oneDay);

    const total = await this.total();
    const count = Math.round(total / remaining);
    const start = (ayah || 0) + 1;

    const surahs = await this.today(start, count);

    return { start, count, surahs, remaining };
  }
}
