import { BookDataInvalidError, BookNotFoundError, BookSearchFailedError } from "./books.errors.ts";
import { createBook as createBookRepo, getAllBooks as getAllBooksRepo, getBookById as getBookByIdRepo, searchBook as searchBookRepo} from "./books.repo.ts";

export interface Book {
    id: number | string;
    title: string;
    author: string;
    release_date: string | null; // "YYYY-MM-DD"
    average_rating: number | null; // Durchschnitt aller Rezensionen, null ohne Rezensionen
}

export type NewBook = Omit<Book, "id" | "average_rating">;

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

export async function createBook(data: unknown): Promise<Book> {
    const book = validateNewBook(data);
    return await createBookRepo(book);
}

// Prüft die Daten aus dem Request-Body, bevor sie in der DB landen
function validateNewBook(data: unknown): NewBook {
    if (typeof data !== "object" || data === null) throw new BookDataInvalidError("The request body must be a JSON object.");
    const { title, author, release_date } = data as Record<string, unknown>;

    if (typeof title !== "string" || !title.trim()) throw new BookDataInvalidError("The title is required.");
    if (typeof author !== "string" || !author.trim()) throw new BookDataInvalidError("The author is required.");

    let releaseDate: string | null = null;
    if (release_date !== undefined && release_date !== null) {
        if (!isValidDate(release_date)) throw new BookDataInvalidError("The release_date must be a valid date (YYYY-MM-DD).");
        releaseDate = release_date;
    }

    return { title: title.trim(), author: author.trim(), release_date: releaseDate };
}

function isValidDate(value: unknown): value is string {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    // "YYYY-MM-DD" wird als UTC gelesen; ungültige Tage wie 2023-02-30 rollen weiter und passen dann nicht mehr
    const date = new Date(value);
    return !isNaN(date.getTime()) && date.toISOString().startsWith(value);
}