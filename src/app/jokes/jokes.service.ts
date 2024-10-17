import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateJokeInput } from './dto/create-joke.input';
import { UpdateJokeInput } from './dto/update-joke.input';
import { InjectModel } from '@nestjs/mongoose';
import { Joke, JokeDocument } from './entities/joke.entity';
import { Model, Schema as MongooSchema } from 'mongoose';
import { PaginationService } from '../common/pagination.service';
import { PaginationArgs } from '../common/dto/get-paginated.args';
import { User, UserDocument } from '../user/entities/user.entity';
import {
  AnsweredJoke,
  AnsweredJokeDocument,
  AnsweredJokeSchema,
} from './entities/answeredJoke.entity';
import { userScore } from '../shared/scores/ScoresCounter';

@Injectable()
export class JokesService {
  constructor(
    @InjectModel(Joke.name)
    private jokeModel: Model<JokeDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @InjectModel(AnsweredJoke.name)
    private answeredJokeModel: Model<AnsweredJokeDocument>,
    private readonly paginationService: PaginationService,
  ) {}
  async create(createJokeInput: CreateJokeInput, user: User) {
    const createJoke = new this.jokeModel({
      ...createJokeInput,
      joker: user,
    });

    const created = await createJoke.save();
    return created;
  }

  async findAllJokes(
    pagination: PaginationArgs,
    user: User,
    getMyJokes: boolean = false,
  ) {
    const answeredJokesId = await this.getAnsweredJokesByUserId(user.id);

    const notInJokes = this.jokeModel.find({
      _id: { $nin: answeredJokesId },
      'joker._id': user.id,
    });

    return await this.paginationService.paginate(notInJokes, pagination);
  }

  async findOne(id: MongooSchema.Types.ObjectId) {
    const joke = await this.jokeModel.findById(id);
    if (!joke) {
      throw new NotFoundException('joke_not_found');
    }

    return joke;
  }

  async updateJoke(
    _id: MongooSchema.Types.ObjectId,
    updateJokeInput: UpdateJokeInput,
    user: User,
  ) {
    const { id, answerIndex } = updateJokeInput;

    const joke = await this.findOne(id);

    const score = userScore(joke.answers, answerIndex);

    if (answerIndex !== undefined && answerIndex !== null) {
      if (answerIndex < 0 || answerIndex >= joke.answers.length) {
        throw new BadRequestException('invalid_answer_index');
      }

      await this.jokeModel.updateOne(
        { _id: id },
        { $inc: { [`answers.${answerIndex}.clickCount`]: 1 } },
      );

      await this.userModel.updateOne(
        { _id: user.id },
        { $inc: { [`score`]: score } },
      );
    }
    const currentUser = await this.userModel.findById(user.id);
    const userRank =
      (await this.userModel.countDocuments({
        score: { $gt: currentUser.score },
      })) + 1;
    const updatedJoke = await this.findOne(id);

    const answeredJoke = new this.answeredJokeModel({
      userId: user.id,
      jokeId: updatedJoke.id,
    });
    await answeredJoke.save();

    return {
      joke: updatedJoke,
      userScored: score,
      userRank,
    };
  }

  async getAnsweredJokesByUserId(
    userId: MongooSchema.Types.ObjectId,
  ): Promise<String[]> {
    const answeredJokes = await this.answeredJokeModel
      .find({ userId })
      .select('jokeId')
      .lean()
      .exec();
    return answeredJokes.map((aq) => aq.jokeId.toString());
  }

  remove(id: number) {
    return `This action removes a #${id} joke`;
  }
}
