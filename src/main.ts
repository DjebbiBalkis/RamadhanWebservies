import * as hbs from 'hbs';
import { join } from 'path';
import * as moment from 'moment';
import { NestFactory } from '@nestjs/core';
import * as layouts from 'handlebars-layouts';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';
import { ErrorsInterceptor } from './interceptors/errors.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setViewEngine('hbs');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ErrorsInterceptor());
  app.use(cookieParser());

  hbs.registerPartials(join(__dirname, '..', 'views', 'partials'));
  hbs.handlebars.registerHelper(layouts(hbs.handlebars));
  hbs.registerHelper('eq', function (arg1, arg2) {
    return arg1 === arg2;
  });
  hbs.registerHelper('formatTime', (date: Date | 'string') => {
    const formatter = new Intl.DateTimeFormat('ar-TN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    if (typeof date === 'string') {
      return formatter.format(new Date(date));
    } else {
      return formatter.format(date);
    }
  });

  app.setBaseViewsDir(join(__dirname, '..', 'views'));

  app.useStaticAssets(join(__dirname, '..', 'public'));

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
