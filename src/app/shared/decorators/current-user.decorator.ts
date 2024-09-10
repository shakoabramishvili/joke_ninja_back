import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { User } from "../../user/entities/user.entity";

export const GetUser = createParamDecorator(
    (data: unknown, context: ExecutionContext): User => {
      const ctx = GqlExecutionContext.create(context);
      return ctx.getContext().req.user;
    },
);