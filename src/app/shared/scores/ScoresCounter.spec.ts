import { countScore } from './ScoresCounter';
import { dumbDataCollection } from './dumbDataCollection';

describe('countScore', () => {
  it('should calculate total points based on clickCount', () => {
    // Arrange: define answers with clickCount

    // Act: call the function
    const joke = dumbDataCollection.simple;
    const result = countScore(joke.answers, 1);
    // Assert: the total points should be the sum of clickCount
    expect(result).toBe(10);
  });

  it('should return 0 if all clickCounts are 0', () => {
    const joke = dumbDataCollection.simple;

    const result = countScore(joke.answers, 2);

    expect(result).toBe(0);
  });
});
