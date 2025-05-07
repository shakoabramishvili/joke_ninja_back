import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { graphqlUploadExpress } from 'graphql-upload';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(graphqlUploadExpress({ maxFileSize: 5000000, maxFiles: 10 }));
  app.useGlobalPipes(new ValidationPipe());
  
  await app.listen(9000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();