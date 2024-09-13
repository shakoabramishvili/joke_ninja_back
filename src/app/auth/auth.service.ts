import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { CreateUserInput } from '../user/dto/create-user.input';
import { ConfigService } from '@nestjs/config';
import { LoginUserInput } from './dto/login-user.input';
import { SocialAuthInput } from './dto/social-auth.input';
import { GoogleService } from '../shared/services/google.service';
import { AuthMethodEnum } from '../shared/enum/authMethod.enum';
import { use } from 'passport';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    private googleService: GoogleService,
  ) {}

  // async validateUser(loginUserInput: LoginUserInput) {
  //   const { email, password } = loginUserInput;
  //   const user = await this.userService.findOneByEmail(email);

  //   const isMatch = await bcrypt.compare(password, user?.password);

  //   if (user && isMatch) {
  //     return user;
  //   }

  //   return null;
  // }

  login(user: User) {
    return {
      user,
      authToken: this.jwtService.sign(
        {
          sub: user.id,
          name: user.name,
          email: user.email,
          externalId: user.externalId,
          externalType: user.externalType,
          score: user.score
        },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: '24h'
        },
      ),
    };
  }

  async signup(payload: CreateUserInput) {
    // CHECK IF THE USER ALREADY EXISTS
    // const user = await this.userService.findOneByEmail(payload.email);

    // if (user) {
    //   throw new Error('User already exists, login instead');
    // }

    // // GENERATE HASH PASSWORD TO SAVE
    // const hash = await bcrypt.hash(
    //   payload.password,
    //   Number(this.configService.get<string>('SALT_ROUND')),
    // );

    // return this.userService.createUser({ ...payload, password: hash });
  }

  async socialAuth(socialAuthInput: SocialAuthInput) {
    const { accessToken, method, fcmToken } = socialAuthInput
    let userInfo;

    switch (method) {
      case AuthMethodEnum.GOOGLE:
        userInfo = await this.googleService.verifyToken(accessToken);
        break;
      case AuthMethodEnum.FACEBOOK:
        userInfo = false
        break;
      case AuthMethodEnum.APPLE:
        userInfo = false
        break;
      default:
        throw new UnauthorizedException('Invalid social provider');
    }

    if (!userInfo.email_verified) {
      throw new UnauthorizedException();
    }

    const isUser = await this.userService.findOneBy(userInfo.sub, method);
    if (isUser) {
      return this.login(isUser)
    }

    const createUserInput: CreateUserInput = {
      name: userInfo.name,
      email: userInfo.email,
      externalId: userInfo.sub,
      externalType: method,
      picture: userInfo.picture
    }
    // {
    //   iss: 'https://accounts.google.com',
    //   azp: '365786239682-fl96r6oml4rhr5srqb41mo3fdlirci36.apps.googleusercontent.com',
    //   aud: '365786239682-fl96r6oml4rhr5srqb41mo3fdlirci36.apps.googleusercontent.com',
    //   sub: '114553777137044764933',
    //   hd: 'gtu.ge',
    //   email: 'zedelashvili_le@gtu.ge',
    //   email_verified: true,
    //   at_hash: '_u3wwmG_5PXoMH5LcG7qYw',
    //   nonce: 'e8F5Qqq5O9gjYFQitYa-ZbSqoxGpWnzuBHwG6imPIt0',
    //   name: 'Levani Zedelashvili',
    //   given_name: 'Levani',
    //   family_name: 'Zedelashvili',
    //   iat: 1725976107,
    //   exp: 1725979707
    // }
    const user = await this.userService.createUser(createUserInput)
    return this.login(user)
  }
}
