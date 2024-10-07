import { Schema } from 'mongoose';
import { Joke } from 'src/app/jokes/entities/joke.entity';

// Factory function to generate default or customized joke data
export const jokeFactory = (overrides: Partial<Joke> = {}): Joke => {
  const date = new Date('2024-09-27T06:56:06.806Z');
  return {
    id: new Schema.Types.ObjectId('66e94a0f6d6de65a7d5b6d56'),
    question: 'Why don’t aliens use social media?',
    coverImage:
      'https://i.etsystatic.com/30702781/r/il/f5bb41/5629342518/il_570xN.5629342518_r42d.jpg',
    answers: [
      {
        text: 'Because they’re already ‘out of this world’.',
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
    createdAt: date,
    updatedAt: date,
    ...overrides, // Merge any provided overrides to customize the result
  };
};

export const JokeWithNumsFactory = (
  num1: number,
  num2: number,
  num3: number,
) => {
  let joke = jokeFactory();
  joke.answers[0].clickCount = num1;
  joke.answers[1].clickCount = num2;
  joke.answers[2].clickCount = num3;

  return joke;
};
