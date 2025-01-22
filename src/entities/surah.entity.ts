import { Entity, ObjectIdColumn, Column } from 'typeorm';

import { AyahInterface } from '../interfaces/ayah.interface';

@Entity('surahs')
export class Surah {
  @ObjectIdColumn({ unique: true })
  _id: string;

  @Column({ unique: true })
  number: number;

  @Column()
  name: string;

  @Column({ type: 'json' })
  ayahs: AyahInterface[];
}
