import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3001',
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
  });
 // app.use('/payment/webhook', bodyParser.raw({ type: 'application/json' }));
 app.use((req, res, next) => {
    if (req.originalUrl.startsWith('/payment/webhook')) {
      req['rawBody'] = '';
      req.on('data', chunk => {
        req['rawBody'] += chunk;
      });
      req.on('end', () => {
        next();
      });
    } else {
      next();
    }
  });

  app.use(bodyParser.json());
  await app.listen(process.env.PORT ?? 3000);

}
bootstrap();
