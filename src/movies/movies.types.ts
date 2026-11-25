export interface Crew {
    director: string;
    editor: string;
    cinematographer: string;
}

export interface Movie {
    id: number;
    title: string;
    crew: Crew;
    year: number;
    genres: string[];
}
