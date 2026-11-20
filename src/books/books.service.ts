import { ApiError, BookNotFoundError } from "./books.errors.ts";

interface Book {
    id: number | string;
    title: string;
    author: string;
}

interface OpenLibraryData {
    docs: BookOpenLibrary[]
}

type BookOpenLibrary = {
    author_name?: string[]
    title: string
    key: string
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

export async function searchBooks(query: string): Promise<Book[]> {
    const data = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`)
    if (!data.ok) {
        throw new ApiError(`${data.status}: ${data.statusText}`)
    }

    const books: OpenLibraryData = await data.json() as unknown as OpenLibraryData
    
    const response: Book[] = books.docs.map((book => ({
        id: book?.key || "--",
        title: book?.title || "--",
        author: book?.author_name?.join(", ") || "--"
    })))

    if (response.length < 1) {
        throw new BookNotFoundError()
    }

    return response
}