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

interface BookSearchResult {
    title: string;
    author: string;
    id: string;
}

export async function searchBooks(query: string): Promise<BookSearchResult[]> {
    try {
        const response = await fetch(
            `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`,
        );
        if (!response.ok) throw new BookSearchFailedError();

        const data: unknown = await response.json();
        if (
            typeof data !== "object" ||
            data === null ||
            !("docs" in data) ||
            !Array.isArray(data.docs)
        ) {
            throw new BookSearchFailedError();
        }

        const docs: unknown[] = data.docs;
        return docs.flatMap((book): BookSearchResult[] => {
            if (
                typeof book !== "object" ||
                book === null ||
                !("title" in book) ||
                !("key" in book)
            ) {
                return [];
            }

            const title = book.title;
            const id = book.key;
            if (typeof title !== "string" || typeof id !== "string") return [];

            const authors = "author_name" in book && Array.isArray(book.author_name)
                ? book.author_name.filter((author): author is string => typeof author === "string")
                : [];

            return [{
                title,
                author: authors.join(", ") || "Unknown",
                id,
            }];
        });
    } catch (error) {
        if (error instanceof BookSearchFailedError) throw error;
        throw new BookSearchFailedError();
    }
}