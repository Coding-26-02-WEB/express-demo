import { BookNotFoundError } from "./books.errors.ts";
import { getAverageRating, getAverageRatings } from "../reviews/reviews.repo.ts";

interface Book {
    id: number;
    title: string;
    author: string;
    averageRating: number | null;
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
    const averages = await getAverageRatings(books.map((b) => b.id));
    return books.map((book) => ({ ...book, averageRating: averages.get(book.id) ?? null }));
}

export async function getBookById(id: number): Promise<Book> {
    const book = books.find((b) => b.id === id);
    if (!book) throw new BookNotFoundError(id);
    const averageRating = await getAverageRating(book.id);
    return { ...book, averageRating };
}