interface Movie {
    id: number;
    title: string;
    director: string;
    year: number;
}

const movies = [
    { id: 1, title: "The Shawshank Redemption", director: "Frank Darabont", year: 1994 },
    { id: 2, title: "The Godfather", director: "Francis Ford Coppola", year: 1972 },
    { id: 3, title: "Pulp Fiction", director: "Quentin Tarantino", year: 1994 },
    { id: 4, title: "Inception", director: "Christopher Nolan", year: 2010 },
    { id: 5, title: "Spirited Away", director: "Hayao Miyazaki", year: 2001 },
    { id: 6, title: "Blade Runner", director: "Ridley Scott", year: 1982 },
    { id: 7, title: "Das Leben der Anderen", director: "Florian Henckel von Donnersmarck", year: 2006 },
    { id: 8, title: "The Matrix", director: "Lana & Lilly Wachowski", year: 1999 },
    { id: 9, title: "Parasite", director: "Bong Joon-ho", year: 2019 },
    { id: 10, title: "Back to the Future", director: "Robert Zemeckis", year: 1985 },
];

export async function getAllMovies(): Promise<Movie[]> {
    return movies;
}

export async function getMovieById(id: number): Promise<Movie | null> {
    return movies.find((m) => m.id === id) ?? null;
}
