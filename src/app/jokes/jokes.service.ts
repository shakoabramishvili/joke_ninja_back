import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateJokeInput } from './dto/create-joke.input';
import { UpdateJokeInput } from './dto/update-joke.input';
import { InjectModel } from '@nestjs/mongoose';
import { Joke, JokeDocument } from './entities/joke.entity';
import { Model, Schema as MongooSchema } from 'mongoose';
import { PaginationService } from '../common/pagination.service';
import { PaginationArgs } from '../common/dto/get-paginated.args';
import { User, UserDocument } from '../user/entities/user.entity';
import { OpenAIService } from '../shared/services/openai.service';
import { RedisCacheService } from '../shared/services/redis.service';

@Injectable()
export class JokesService {
  constructor(
    @InjectModel(Joke.name)
    private jokeModel: Model<JokeDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private readonly paginationService: PaginationService,
    private readonly openaiService: OpenAIService,
    private readonly redisCacheService: RedisCacheService
  ) {}
  create(createJokeInput: CreateJokeInput) {
    const createJoke = new this.jokeModel(createJokeInput)
    return createJoke.save();
  }

  async findAllJokes(pagination: PaginationArgs) {
    // const ai = await this.openaiService.main()
    const leaderBoard = await this.redisCacheService.getMembersWithScores('leaderboard', 0 , 5)
    console.log(leaderBoard)
    return await this.paginationService.paginate(this.jokeModel, pagination)
  }

  findOne(id: number) {
    return `This action returns a #${id} joke`;
  }

  async updateJoke(_id: MongooSchema.Types.ObjectId, updateJokeInput: UpdateJokeInput, user: User) {
    const { id, answerIndex } = updateJokeInput;
    
    const joke = await this.jokeModel.findById(id);
    if (!joke) {
      throw new NotFoundException('joke_not_found');
    }
    
    if (answerIndex !== undefined && answerIndex !== null) {
      if (answerIndex < 0 || answerIndex >= joke.answers.length) {
        throw new BadRequestException('invalid_answer_index');
      }
  
      await this.jokeModel.updateOne(
        { _id: id },
        { $inc: { [`answers.${answerIndex}.clickCount`]: 1 } }
      );

      await this.userModel.updateOne(
        { _id: user.id },
        { $inc: { [`score`]: joke.answers[answerIndex].funnyRank}}
      )
    }
    
    const updatedJoke = await this.jokeModel.findById(
      id, 
    );
    const updatedUser = await this.userModel.findById(
      {_id: user.id}
    )
    // {
    //   _id: new ObjectId("66e2e13d173f6828f01a27fe"),
    //   question: 'What did the vampire say to the comedian?',
    //   answers: [
    //     {
    //       text: '“You really know how to make my blood boil.”',
    //       funnyRank: 2,
    //       clickCount: 1
    //     },
    //     {
    //       text: '“I’m dying for a good laugh, but not literally!”',
    //       funnyRank: -1,
    //       clickCount: 0
    //     },
    //     {
    //       text: '“Your jokes are just the ‘bite’ I needed.”',
    //       funnyRank: 1,
    //       clickCount: 0
    //     }
    //   ],
    //   coverImage: 'https://jokeninja.s3.eu-central-1.amazonaws.com/jokes/0d65cbbb-c5cf-4b8a-8749-cb8d667268fa.png'
    // }
    
    // console.log(updatedJoke)
    await this.redisCacheService.addMemberToSortedSet('leaderboard', updatedUser.score, updatedUser.name)
    return { 
      joke: updatedJoke, 
      userScored: joke.answers[answerIndex].funnyRank 
    };
  }  

  remove(id: number) {
    return `This action removes a #${id} joke`;
  }
}
