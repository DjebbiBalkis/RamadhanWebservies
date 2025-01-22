import { ObjectId } from 'mongodb';
import { Entity, ObjectIdColumn, Column } from 'typeorm';

@Entity('users')
export class User {
  @ObjectIdColumn({ unique: true })
  _id: ObjectId;

  @Column()
  name: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  ayah: number;

  @Column()
  started_at: Date;

  @Column()
  ends_at: Date;

  @Column({ default: 'user' })
  role: string;

  @Column('json')
  location: {
    latitude: number;
    longitude: number;
    timezone: string;
    city?: string;
  };
}
