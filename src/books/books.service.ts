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

export interface SearchResult {
    title: string;
    author: string;
    id: string;
}

interface OpenLibraryDoc {
    title?: unknown;
    author_name?: unknown;
    key?: unknown;
}

interface OpenLibraryResponse {
    docs?: unknown;
}

export async function searchBooks(query: string, limit?: number): Promise<SearchResult[]> {
    const params = new URLSearchParams({ q: query });
    if (limit !== undefined) params.set("limit", String(limit));
    const url = `https://openlibrary.org/search.json?${params.toString()}`;

    let response: Response;
    try {
        response = await fetch(url);
    } catch (error) {
        throw new BookSearchFailedError(query, "Open-Library is not reachable");
    }

    if (!response.ok) {
        throw new BookSearchFailedError(query, `Open-Library answered with status ${response.status}`);
    }

    let payload: OpenLibraryResponse;
    try {
        payload = (await response.json()) as OpenLibraryResponse;
    } catch (error) {
        throw new BookSearchFailedError(query, "Open-Library answered with invalid JSON");
    }

    const docs: OpenLibraryDoc[] = Array.isArray(payload.docs) ? (payload.docs as OpenLibraryDoc[]) : [];
    const results = docs.map((doc) => ({
        title: typeof doc.title === "string" && doc.title ? doc.title : "unknown",
        author: Array.isArray(doc.author_name) && doc.author_name.length > 0
            ? doc.author_name.join(", ")
            : "unknown",
        id: typeof doc.key === "string" ? doc.key : "unknown",
    }));

    return limit !== undefined ? results.slice(0, limit) : results;
}