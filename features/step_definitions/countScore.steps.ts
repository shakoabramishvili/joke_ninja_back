import { defineStep } from '@cucumber/cucumber';
import * as assert from 'assert';
import {
  countScore,
  userScore,
} from '../../src/app/shared/scores/ScoresCounter';
import { JokeWithNumsFactory } from '../Factory';
import { Joke } from '../../src/app/jokes/entities/joke.entity';

let joke: Joke;

defineStep(
  'I have the following answers with counts {int} {int} {int}',
  function (c1: number, c2: number, c3: number) {
    // Here you need to mock or generate answers based on the input
    joke = JokeWithNumsFactory(c1, c2, c3);
  },
);

defineStep('I calculate the total score is {int}', function (total: number) {
  const result = countScore(joke.answers);
  assert.equal(total, result);
});

defineStep(
  'total score of answer num {int} should be {int}',
  function (index, expectedResult: number) {
    const score = userScore(joke.answers, index);
    assert.strictEqual(score, expectedResult);
  },
);
