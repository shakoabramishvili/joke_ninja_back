// test-utils/factories/joke-factory.ts
import {
  JokeDocument,
  JokeSchema,
} from '../src/app/jokes/entities/joke.entity'; // Adjust the path to your entity
import mongoose from 'mongoose';

const JokeModel = mongoose.model<JokeDocument>('Joke', JokeSchema);

export const jokeFactory = async (overrides: Partial<JokeDocument> = {}) => {
  const defaultJoke = {
    question: 'Why don’t aliens use social media?',
    answers: [
      {
        text: 'Because they’re already out of this world.',
        funnyRank: 2,
        clickCount: 7,
      },
      {
        text: "They don’t want to get 'universal' likes.",
        funnyRank: 1,
        clickCount: 1,
      },
      {
        text: "Turns out, they don’t have the 'space' for it.",
        funnyRank: -1,
        clickCount: 3,
      },
    ],
    coverImage: 'https://example.com/joke.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const jokeData = { ...defaultJoke, ...overrides };

  const joke = new JokeModel(jokeData);
  return await joke.save();
};
