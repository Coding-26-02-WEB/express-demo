import { BookNotFoundError, BookSearchFailedError } from "./books.errors.ts";
import { createBook as createBookRepo, getAllBooks as getAllBooksRepo, getBookById as getBookByIdRepo, searchBook as searchBookRepo} from "./books.repo.ts";

export interface Book {
    id: number | string;
    title: string;
    author: string;
}

export type NewBook = Omit<Book, "id">;

interface OpenLibrarySearchResponse {
    docs: {
        author_name?: string[];
        title: string;
        key: string;
    }[]
}

export async function getAllBooks(): Promise<Book[]> {
    return await getAllBooksRepo();
}

export async function getBookById(id: number): Promise<Book> {
    const book = await getBookByIdRepo(id);
    if (!book) throw new BookNotFoundError(id);
    return book;
}

export async function searchBook(query: string): Promise<Book[]> {
    return await searchBookRepo(query);
}

export async function createBook(book: NewBook): Promise<Book> {
    return await createBookRepo(book);
}