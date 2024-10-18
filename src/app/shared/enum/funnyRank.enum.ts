import { registerEnumType } from '@nestjs/graphql';

export enum FunnyRank {
  GOOD = 2,
  BAD = 1,
  UGLY = -1,
}

registerEnumType(FunnyRank, {
  name: 'FunnyRank',
  description: 'FunnyRank',
});
