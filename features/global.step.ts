import { BeforeAll, AfterAll } from '@cucumber/cucumber';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app/app.module';
import mongoose from 'mongoose';

export let TestApp: INestApplication;
BeforeAll(async () => {
  await mongoose.connect(`mongodb://localhost/${process.env.LOCAL_DB_NAME}`);

  process.env.IS_TESTING = 'true';
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  TestApp = moduleFixture.createNestApplication();
  await TestApp.init();
});

AfterAll(async () => {
  // TestApp
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
});
