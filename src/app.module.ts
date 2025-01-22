import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

import * as entities from '@entities';
import * as services from '@services';
import * as strategies from '@strategies';
import * as controllers from '@controllers';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 27017,
      database: process.env.DB_NAME || 'ramadhan',
      entities: Object.values(entities),
      synchronize: true,
    }),
    TypeOrmModule.forFeature(Object.values(entities)),
    PassportModule,
    JwtModule.register({
      secret: process.env.APP_JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: Object.values(controllers),
  providers: [...Object.values(strategies), ...Object.values(services)],
})
export class AppModule {}
