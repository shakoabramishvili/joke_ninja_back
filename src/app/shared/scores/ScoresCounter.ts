import { Answer } from '../../jokes/entities/answers.entity';

/**
 *
 * @param answers expecting array of three answers that have @clickCount as number of user choose it
 * @param choosen index of which answer user choose
 *
 * @returns what score the user got
 */
export const userScore = (answers: Answer[], choosen: number) => {
  const total = countScore(answers);
  const aScore = answers[choosen].clickCount;

  const ratio = aScore / total;
  const minScore = -5;
  const maxScore = 10;
  const scaledScore = minScore + (maxScore - minScore) * ratio;

  return Math.round(scaledScore);
};

/**
 *
 * @param answers expecting array of three answers that have @clickCount as number of user choose it
 *
 * @returns total answers count
 */
export const countScore = (answers: Answer[]) => {
  const totalPoints = answers.reduce((total, ans) => total + ans.clickCount, 0);
  return totalPoints;
};
