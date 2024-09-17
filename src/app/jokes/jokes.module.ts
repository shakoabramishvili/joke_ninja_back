import { Module } from '@nestjs/common';
import { JokesService } from './jokes.service';
import { JokesResolver } from './jokes.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Joke, JokeSchema } from './entities/joke.entity';
import { CommonModule } from '../common/common.module';
import { UserModule } from '../user/user.module';
import { User, UserSchema } from '../user/entities/user.entity';
import { SharedModule } from '../shared/shared.module';

@Module({
  providers: [JokesResolver, JokesService],
  imports: [
    MongooseModule.forFeature([
      { name: Joke.name, schema: JokeSchema }, 
      {name: User.name, schema: UserSchema}
    ]),
    CommonModule,
    SharedModule
  ]
})
export class JokesModule {}