interface Crew {
    director: string;
    editor: string;
    cinematographer: string;
}

interface Movie {
    id: number;
    title: string;
    crew: Crew;
    year: number;
    genres: string[];
}

const movies: Movie[] = [
    {
        id: 1,
        title: "The Shawshank Redemption",
        crew: { director: "Frank Darabont", editor: "Richard Francis-Bruce", cinematographer: "Roger Deakins" },
        year: 1994,
        genres: ["Drama"]
    },
    {
        id: 2,
        title: "The Godfather",
        crew: { director: "Francis Ford Coppola", editor: "William Reynolds", cinematographer: "Gordon Willis" },
        year: 1972,
        genres: ["Crime", "Drama"]
    },
    {
        id: 3,
        title: "Pulp Fiction",
        crew: { director: "Quentin Tarantino", editor: "Sally Menke", cinematographer: "Andrzej Sekuła" },
        year: 1994,
        genres: ["Crime", "Thriller"]
    },
    {
        id: 4,
        title: "Inception",
        crew: { director: "Christopher Nolan", editor: "Lee Smith", cinematographer: "Wally Pfister" },
        year: 2010,
        genres: ["Sci-Fi", "Action", "Thriller"]
    },
    {
        id: 5,
        title: "Spirited Away",
        crew: { director: "Hayao Miyazaki", editor: "Takeshi Seyama", cinematographer: "Atsushi Okui" },
        year: 2001,
        genres: ["Animation", "Fantasy", "Adventure"]
    },
    {
        id: 6,
        title: "Blade Runner",
        crew: { director: "Ridley Scott", editor: "Terry Rawlings", cinematographer: "Jordan Cronenweth" },
        year: 1982,
        genres: ["Sci-Fi", "Thriller"]
    },
    {
        id: 7,
        title: "Das Leben der Anderen",
        crew: { director: "Florian Henckel von Donnersmarck", editor: "Patricia Rommel", cinematographer: "Hagen Bogdanski" },
        year: 2006,
        genres: ["Drama", "Thriller"]
    },
    {
        id: 8,
        title: "The Matrix",
        crew: { director: "Lana & Lilly Wachowski", editor: "Zach Staenberg", cinematographer: "Bill Pope" },
        year: 1999,
        genres: ["Sci-Fi", "Action"]
    },
    {
        id: 9,
        title: "Parasite",
        crew: { director: "Bong Joon-ho", editor: "Yang Jin-mo", cinematographer: "Hong Kyung-pyo" },
        year: 2019,
        genres: ["Thriller", "Drama", "Comedy"]
    },
    {
        id: 10,
        title: "Back to the Future",
        crew: { director: "Robert Zemeckis", editor: "Arthur Schmidt", cinematographer: "Dean Cundey" },
        year: 1985,
        genres: ["Sci-Fi", "Comedy", "Adventure"]
    },
];

export async function getAllMovies(): Promise<Movie[]> {
    return movies;
}

export async function getMovieById(id: number): Promise<Movie | null> {
    return movies.find((m) => m.id === id) ?? null;
}
