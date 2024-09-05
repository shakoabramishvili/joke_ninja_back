import { Injectable } from '@nestjs/common';
import { CreateJokeInput } from './dto/create-joke.input';
import { UpdateJokeInput } from './dto/update-joke.input';
import { InjectModel } from '@nestjs/mongoose';
import { Joke, JokeDocument } from './entities/joke.entity';
import { Model } from 'mongoose';
import { PaginationService } from '../common/pagination.service';
import { PaginationArgs } from '../common/dto/get-paginated.args';

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

  update(id: number, updateJokeInput: UpdateJokeInput) {
    return `This action updates a #${id} joke`;
  }

  remove(id: number) {
    return `This action removes a #${id} joke`;
  }
}
