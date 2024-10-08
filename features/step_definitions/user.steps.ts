import { Given, When, Then, BeforeAll, defineStep } from '@cucumber/cucumber';
// import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../src/app/user/user.service'; // Adjust the path
// import { MongooseModule } from '@nestjs/mongoose';
// import { ConfigModule } from '@nestjs/config'; // To resolve config dependencies
// import { User, UserSchema } from '../../src/app/user/entities/user.entity';
import * as assert from 'assert';
import { TestApp } from '../global.step';
import { User } from '../../src/app/user/entities/user.entity';

let userService: UserService;

let createdUser: User;
let foundUser: User;
let err: any;

BeforeAll(async () => {
  userService = TestApp.get<UserService>(UserService);
});

defineStep(
  'I create a new user with externalId: {string} and email: {string} and name: {string}',
  async (externalId: string, email: string, name: string) => {
    try {
      const user = await userService.createUser({
        name,
        email,
        externalId,
        picture: '',
        externalType: 'google',
      });

      createdUser = user;
      // this will just find here
      assert.equal(user.name, name);
    } catch (e) {
      err = e;
    }
  },
);

defineStep('I search user by email: {string}', async (email: string) => {
  const user = await userService.findOneByEmail(email);
  if (user) foundUser = user;
});

defineStep(
  'I search user by externalId: {string}',
  async (externalId: string) => {
    const user = await userService.findOneBy(externalId);
    if (user) foundUser = user;
  },
);

defineStep('User externalId must be: {string}', (externalId: string) => {
  assert.strictEqual(foundUser.externalId, externalId);
});

defineStep('I should see error code: {int}', (code: number) => {
  assert.equal(err.code, code);
});
