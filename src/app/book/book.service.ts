// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model, Schema as MongooSchema } from 'mongoose';
// import { CreateBookInput } from './dto/create-book.input';
// import { UpdateBookInput } from './dto/update-book.input';
// import { Book, BookDocument } from './entities/book.entity';
// import { PaginationArgs } from '../common/dto/get-paginated.args';
// import { PaginationService } from '../common/pagination.service';

// @Injectable()
// export class BookService {
//   constructor(
//     @InjectModel(Book.name)
//     private bookModel: Model<BookDocument>,
//     private readonly paginationService: PaginationService
//   ) {}

//   createBook(createBookInput: CreateBookInput) {
//     const createdBook = new this.bookModel(createBookInput);
//     return createdBook.save();
//   }

//   async findAllBooks(pagination: PaginationArgs) {
//     return await this.paginationService.paginate(this.bookModel, pagination, ['author']);
//   }

//   getBookById(
//     id: MongooSchema.Types.ObjectId,
//     readersLimit: number,
//   ) {
//     return this.bookModel
//       .findById(id)
//       .populate('author')
//       .populate({
//         path: 'readers',
//         options: {
//           limit: readersLimit,
//         },
//       });
//   }

//   updateBook(
//     id: MongooSchema.Types.ObjectId,
//     updateBookInput: UpdateBookInput,
//   ) {
//     return this.bookModel.findByIdAndUpdate(id, updateBookInput);
//   }

//   removeBook(id: MongooSchema.Types.ObjectId) {
//     return this.bookModel.deleteOne({ _id: id });
//   }
// }
