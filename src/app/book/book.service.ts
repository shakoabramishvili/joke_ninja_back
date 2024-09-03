import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooSchema, Types } from 'mongoose';
import { CreateBookInput } from './dto/create-book.input';
import { UpdateBookInput } from './dto/update-book.input';
import { Book, BookDocument, Edge, PageInfo } from './entities/book.entity';
import { PaginationInput } from '../common/dto/get-paginated.args';

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
      // const afterObjectId = new Types.ObjectId(after);
      console.log(typeof lastBook)
      if (lastBook) {
        query = query.where('_id').gt(lastBook._id as any);
      }
    }

    const books = await query.limit(limit).exec();
    // console.log(books)
    const hasNextPage = books.length === limit;
    const endCursor = books.length ? books[books.length - 1]._id.toString() : null;
    console.log(endCursor, 'hasNextPage')
    const edges: Edge[] = books.map(book => ({
      cursor: book._id.toString(),
      node: book,
    }));

    const pageInfo: PageInfo = {
      hasNextPage,
      endCursor,
    };

    return {
      edges,
      pageInfo,
    };
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
