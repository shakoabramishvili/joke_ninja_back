import { BeforeAll, AfterAll, Before } from '@cucumber/cucumber';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app/app.module';
import mongoose from 'mongoose';

export let TestApp: INestApplication;
BeforeAll(async () => {
  process.env.IS_TESTING = 'true';
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  TestApp = moduleFixture.createNestApplication();
  await TestApp.init();
});

Before(async () => {
  await mongoose.connect(`mongodb://localhost/${process.env.TEST_DB_NAME}`);
  await mongoose.connection.db.dropDatabase();
});

AfterAll(async () => {
  // TestApp
  await mongoose.disconnect();
});
