import { Module } from '@nestjs/common';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { BookModule } from './book/book.module';
import { AuthorModule } from './author/author.module';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { ApolloServerPluginLandingPageLocalDefault, ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { JokesModule } from './jokes/jokes.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
      // sortSchema: true,
      // plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
      cors: true,
      introspection: true,
      // cache: 'bounded',
      // csrfPrevention: true,
      debug: true,
      installSubscriptionHandlers: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): MongooseModuleOptions => {
        const username = encodeURIComponent(configService.get<string>('MONGODB_USERNAME'));
        const password = encodeURIComponent(configService.get<string>('MONGODB_PASSWORD'));
        const databaseName = encodeURIComponent(configService.get<string>('MONGODB_DATABASE_NAME'))
        const uri = configService.get<string>('MONGODB_URI');
        const options: MongooseModuleOptions = {
          uri: `mongodb+srv://${username}:${password}@${uri}/${databaseName}`,
        };
        return options;
        
      },
    }),
    ConfigModule.forRoot({
      cache: true,
    }),
    UserModule,
    // BookModule,
    // AuthorModule,
    CommonModule,
    AuthModule,
    JokesModule,
    SharedModule
  ],
  providers: [],
})
export class AppModule {}
