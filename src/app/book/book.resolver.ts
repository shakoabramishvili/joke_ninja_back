// import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
// import { BookService } from './book.service';
// import { Book, PaginatedBooks } from './entities/book.entity';
// import { CreateBookInput } from './dto/create-book.input';
// import { UpdateBookInput } from './dto/update-book.input';
// import { PaginationArgs } from '../common/dto/get-paginated.args';
// import { GetPaginatedSubDocumentsArgs } from '../common/dto/get-paginated-sub-document.args';
// import { Schema as MongooSchema } from 'mongoose';
// import { UseGuards } from '@nestjs/common';
// import { JwtAuthGuard } from '../auth/jwt-auth.gards';

// @Resolver(() => Book)
// export class BookResolver {
//   // constructor(private readonly bookService: BookService
//   //   ) {}

//   // Only connected users with valid jwt tokens must create a book(Authentication)
//   // @Mutation(() => Book)
//   // @UseGuards(JwtAuthGuard)
//   // createBook(@Args('createBookInput') createBookInput: CreateBookInput) {
//   //   return this.bookService.createBook(createBookInput);
//   // }

//   // @Query(() => PaginatedBooks, { name: 'books' })
//   // findAllBooks(@Args() args: PaginationArgs) {
//   //   return this.bookService.findAllBooks(args);
//   // }

//   // @Query(() => Book, { name: 'book' })
//   // findOne(@Args() args: GetPaginatedSubDocumentsArgs) {
//   //   const { first, id } = args;
//   //   return this.bookService.getBookById(id, first);
//   // }

//   // @Mutation(() => Book)
//   // @UseGuards(JwtAuthGuard)
//   // updateBook(@Args('updateBookInput') updateBookInput: UpdateBookInput) {
//   //   return this.bookService.updateBook(updateBookInput.id, updateBookInput);
//   // }

//   // @Mutation(() => Book)
//   // @UseGuards(JwtAuthGuard)
//   // removeBook(
//   //   @Args('id', { type: () => String }) id: MongooSchema.Types.ObjectId,
//   // ) {
//   //   return this.bookService.removeBook(id);
//   // }
// }
