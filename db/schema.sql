CREATE TABLE books ( 
    id serial primary key, 
    title varchar NOT NULL, 
    author varchar NOT NULL
);

INSERT INTO books (title, author) VALUES
    ('The Hobbit', 'J.R.R. Tolkien'),
    ('Dune', 'Frank Herbert'),
    ('A Game of Thrones', 'George R.R. Martin'),
    ('Foundation', 'Isaac Asimov'),
    ('The Name of the Wind', 'Patrick Rothfuss'),
    ('Neuromancer', 'William Gibson'),
    ('Die unendliche Geschichte', 'Michael Ende'),
    ('The Left Hand of Darkness', 'Ursula K. Le Guin'),
    ('Mistborn: The Final Empire', 'Brandon Sanderson'),
    ('The Hitchhiker''s Guide to the Galaxy', 'Douglas Adams');
