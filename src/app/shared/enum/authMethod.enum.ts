import { registerEnumType } from "@nestjs/graphql";

export enum AuthMethodEnum {
    GOOGLE = 'google',
    FACEBOOK = 'facebook',
    APPLE = 'apple',
    GOOGLEWEB = 'googleweb'
}

registerEnumType(AuthMethodEnum, {
    name: "AuthMethodEnum",
    description: "AuthMethodEnum",
});