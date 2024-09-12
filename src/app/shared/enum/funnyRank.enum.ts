import { registerEnumType } from "@nestjs/graphql";

export enum FunnyRank {
    WORST = -1,
    GOOD = 1,
    BEST = 2
}

registerEnumType(FunnyRank, {
    name: "FunnyRank",
    description: "FunnyRank",
});