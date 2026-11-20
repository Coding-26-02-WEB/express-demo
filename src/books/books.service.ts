import { BookNotFoundError, BookSearchFailedError } from "./books.errors.ts";

interface Book {
    id: number;
    title: string;
    author: string;
}

const books = [
    { id: 1, title: "The Hobbit", author: "J.R.R. Tolkien" },
    { id: 2, title: "Dune", author: "Frank Herbert" },
    { id: 3, title: "A Game of Thrones", author: "George R.R. Martin" },
    { id: 4, title: "Foundation", author: "Isaac Asimov" },
    { id: 5, title: "The Name of the Wind", author: "Patrick Rothfuss" },
    { id: 6, title: "Neuromancer", author: "William Gibson" },
    { id: 7, title: "Die unendliche Geschichte", author: "Michael Ende" },
    { id: 8, title: "The Left Hand of Darkness", author: "Ursula K. Le Guin" },
    { id: 9, title: "Mistborn: The Final Empire", author: "Brandon Sanderson" },
    { id: 10, title: "The Hitchhiker's Guide to the Galaxy", author: "Douglas Adams" },
];

export async function getAllBooks(): Promise<Book[]> {
    return books;
}

export async function getBookById(id: number): Promise<Book> {
    const book = books.find((b) => b.id === id);
    if (!book) throw new BookNotFoundError(id);
    return book;
}

export interface BookSearchResult {
    title: string;
    author: string;
    id: string;
    firstPublishYear: number | null;
}

interface OpenLibraryDoc {
    title?: unknown;
    author_name?: unknown;
    key?: unknown;
    first_publish_year?: unknown;
}

interface OpenLibrarySearchResponse {
    docs?: unknown;
}

const OPEN_LIBRARY_SEARCH_URL = "https://openlibrary.org/search.json";

function textOrUnknown(value: unknown): string {
    return typeof value === "string" && value.trim() !== "" ? value : "Unknown";
}

function authorFrom(authorName: unknown): string {
    if (!Array.isArray(authorName)) return "Unknown";
    const names = authorName.filter((name): name is string => typeof name === "string" && name.trim() !== "");
    return names.length > 0 ? names.join(", ") : "Unknown";
}

function toSearchResult(doc: OpenLibraryDoc): BookSearchResult {
    return {
        title: textOrUnknown(doc.title),
        author: authorFrom(doc.author_name),
        id: textOrUnknown(doc.key),
        firstPublishYear: typeof doc.first_publish_year === "number" ? doc.first_publish_year : null,
    };
}

export async function searchBooks(query: string, limit?: number): Promise<BookSearchResult[]> {
    let url = `${OPEN_LIBRARY_SEARCH_URL}?q=${encodeURIComponent(query)}`;
    if (limit !== undefined) {
        url += `&limit=${limit}`;
    }

    let response: Response;
    try {
        response = await fetch(url);
    } catch {
        throw new BookSearchFailedError();
    }

    if (!response.ok) {
        throw new BookSearchFailedError();
    }

    let payload: OpenLibrarySearchResponse;
    try {
        payload = await response.json() as OpenLibrarySearchResponse;
    } catch {
        throw new BookSearchFailedError();
    }

    const docs = Array.isArray(payload.docs) ? payload.docs as OpenLibraryDoc[] : [];
    const results = docs.map(toSearchResult);
    return limit === undefined ? results : results.slice(0, limit);
}