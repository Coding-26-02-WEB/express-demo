import { BookNotFoundError, BookSearchNotFoundError, NoSearchQueryError } from "./books.errors.ts";

interface Book {
    id: number;
    title: string;
    author: string;
}

interface OpenLibraryBook {
    key: string;
    title: string;
    author_name?: string[];
}

interface OpenLibrarySearchResult {
    docs: OpenLibraryBook[];
}

const openApiBooks = "https://openlibrary.org/search.json?q=";

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

export async function searchBooksByTitle(title: string | undefined): Promise<{ id: string; title: string; author: string | null }[]> {
    const searchTitle = title?.trim();
    if (!searchTitle) throw new NoSearchQueryError();

    const lowerCaseTitle = searchTitle.toLowerCase();

    const openApiResponse = await fetch(`${openApiBooks}${encodeURIComponent(lowerCaseTitle)}`);
    if (!openApiResponse.ok) {
        throw new Error(`Failed to fetch from Open Library API. Status: ${openApiResponse.status}`);
    }

    const openApiData: OpenLibrarySearchResult = await openApiResponse.json();
    if (openApiData.docs.length === 0) throw new BookSearchNotFoundError(searchTitle);

    return openApiData.docs.map(({ key, title, author_name }) => ({
        id: key,
        title,
        author: author_name?.join(", ") ?? null,
    }));
}