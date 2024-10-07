import { Answer } from 'src/app/jokes/entities/answers.entity';

/**
 *
 * @param answers expecting array of three answers that have @clickCount as number of user choose it
 * @param choosen index of which answer user choose
 */
export const countScore = (answers: Answer[], choosen: number) => {
  const totalPoints = answers.reduce((total, ans) => total + ans.clickCount, 0);
  return totalPoints;
};
