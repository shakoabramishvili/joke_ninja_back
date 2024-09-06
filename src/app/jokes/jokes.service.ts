import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateJokeInput } from './dto/create-joke.input';
import { UpdateJokeInput } from './dto/update-joke.input';
import { InjectModel } from '@nestjs/mongoose';
import { Joke, JokeDocument } from './entities/joke.entity';
import { Model, Schema as MongooSchema } from 'mongoose';
import { PaginationService } from '../common/pagination.service';
import { PaginationArgs } from '../common/dto/get-paginated.args';
import { IncrementAnswerCountInput } from './dto/increment-answer-count.input';

@Injectable()
export class JokesService {
  constructor(
    @InjectModel(Joke.name)
    private jokeModel: Model<JokeDocument>,
    private readonly paginationService: PaginationService
  ) {}
  create(createJokeInput: CreateJokeInput) {
    return 'This action adds a new joke';
  }

  async findAllJokes(pagination: PaginationArgs) {
    return await this.paginationService.paginate(this.jokeModel, pagination)
  }

  findOne(id: number) {
    return `This action returns a #${id} joke`;
  }

  updateJoke(id: MongooSchema.Types.ObjectId, updateJokeInput: UpdateJokeInput) {
    return this.jokeModel.findByIdAndUpdate(id, updateJokeInput);
  }

  async incrementAnswerCount(id: MongooSchema.Types.ObjectId, incrementAnswerCountInput: IncrementAnswerCountInput) {
    const { _id, answerIndex } = incrementAnswerCountInput;

    // Fetch the joke by its ID
    const joke = await this.jokeModel.findById(_id);

    if (!joke) {
      throw new NotFoundException('joke_not_found');
    }

    // Check if the index is valid
    if (answerIndex < 0 || answerIndex >= joke.answers.length) {
      throw new BadRequestException('invalid_answer_index');
    }

    // Use MongoDB positional operator to increment clickCount for the answer at the specified index
    await this.jokeModel.updateOne(
      { _id, [`answers.${answerIndex}`]: { $exists: true } },
      { $inc: { [`answers.${answerIndex}.clickCount`]: 1 } }
    );
    
    return this.jokeModel.findById(_id);
  }

  remove(id: number) {
    return `This action removes a #${id} joke`;
  }
}
