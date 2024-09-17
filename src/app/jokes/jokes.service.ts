import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateJokeInput } from './dto/create-joke.input';
import { UpdateJokeInput } from './dto/update-joke.input';
import { InjectModel } from '@nestjs/mongoose';
import { Joke, JokeDocument } from './entities/joke.entity';
import { Model, Schema as MongooSchema } from 'mongoose';
import { PaginationService } from '../common/pagination.service';
import { PaginationArgs } from '../common/dto/get-paginated.args';
import { User, UserDocument } from '../user/entities/user.entity';

@Injectable()
export class JokesService {
  constructor(
    @InjectModel(Joke.name)
    private jokeModel: Model<JokeDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private readonly paginationService: PaginationService,
  ) {}
  create(createJokeInput: CreateJokeInput) {
    const createJoke = new this.jokeModel(createJokeInput)
    return createJoke.save();
  }

  async findAllJokes(pagination: PaginationArgs) {
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
    const currentUser = await this.userModel.findById(user.id);
    const userRank = await this.userModel.countDocuments({ score: { $gt: currentUser.score } }) + 1;
    const updatedJoke = await this.jokeModel.findById(
      id, 
    );
    
    return { 
      joke: updatedJoke, 
      userScored: joke.answers[answerIndex].funnyRank,
      userRank
    };
  }  

  remove(id: number) {
    return `This action removes a #${id} joke`;
  }
}
