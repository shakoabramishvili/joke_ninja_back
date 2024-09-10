import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UserModule } from '../user/user.module';
import { JwtModule, JwtModuleOptions, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from '../shared/strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '../shared/strategies/local.strategy';
import { GoogleService } from '../shared/services/google.service';

@Module({
  providers: [
    AuthService,
    AuthResolver,
    JwtService,
    JwtStrategy,
    LocalStrategy,
    GoogleService
  ],
  // We nedd to make sure we've imported the userModule, because we're using it's service
  imports: [
    UserModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const properties: JwtModuleOptions = {
          // secret: configService.get<string>('JWT_SECRET'),
          // signOptions: {
          //   expiresIn: '1m',
          // },
        };
        return properties;
      },
    }),
  ],
})
export class AuthModule {}
