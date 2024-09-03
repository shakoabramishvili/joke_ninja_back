import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooSchema, Types } from 'mongoose';
import { CreateBookInput } from './dto/create-book.input';
import { UpdateBookInput } from './dto/update-book.input';
import { Book, BookDocument, Edge } from './entities/book.entity';
import { PaginationInput } from '../common/dto/get-paginated.args';
import { PageInfo, paginate } from '../utils/paginationResult';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name)
    private bookModel: Model<BookDocument>,
  ) {}

  createBook(createBookInput: CreateBookInput) {
    const createdBook = new this.bookModel(createBookInput);
    return createdBook.save();
  }

  async findAllBooks(pagination: PaginationInput) {
    const { after, first } = pagination;
    const limit = first || Infinity;

    let query = this.bookModel.find().populate('author');
    if (after) {
      const lastBook = await this.bookModel.findById(after).exec();
      
      if (lastBook) {
        query = query.where('_id').gt(lastBook._id as any);
      }
    }
    
    const books = await query.limit(limit).exec();

    const pages = paginate<Book>(books, limit)
    return pages
  }

  getBookById(
    id: MongooSchema.Types.ObjectId,
    readersSkip: number,
    readersLimit: number,
  ) {
    return this.bookModel
      .findById(id)
      .populate('author')
      .populate({
        path: 'readers',
        options: {
          limit: readersLimit,
          skip: readersSkip,
        },
      });
  }

  updateBook(
    id: MongooSchema.Types.ObjectId,
    updateBookInput: UpdateBookInput,
  ) {
    return this.bookModel.findByIdAndUpdate(id, updateBookInput);
  }

  removeBook(id: MongooSchema.Types.ObjectId) {
    return this.bookModel.deleteOne({ _id: id });
  }
}
