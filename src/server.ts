import express from "express";

const PORT = 3000;
const app = express();

app.get("/ping", (req, res) => {
    res.status(200).json({ message: "pong" })
})

app.get("/greeting{/:name}", (req, res) => {
    const name = req.params.name ?? "lieber Benutzer";
    const { loud } = req.query;

    const message = `Hallo, ${name}`;

    res.status(200).json({ message: loud === "true" ? message.toUpperCase() : message })
})

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

app.get("/books", (_, res) => {
    res.status(200).json({
        success: true, 
        data: books
    })
});

app.get("/books/:id", (req, res) => {
    const book = books.find((b) => b.id === Number(req.params.id));
    if (!book) return res.status(404).json({ success: false, error: "Book not found" });
    res.status(200).json({ 
        success: true, 
        data: book
    });
});

app.listen(PORT, () => console.log(`Server läuft jetzt auf port ${PORT}`));