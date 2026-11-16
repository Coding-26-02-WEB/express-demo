import express from "express";

const PORT = 3000;
const app = express();

app.get("/ping", (req, res) => {
    res.status(200).json({ message: "pong" })
})

// app.get("/greeting/:name", (req, res) => {
//     // greeting/Leo?loud=true
//     const { name } = req.params;
//     const { loud } = req.query;

//     const message = `Hallo, ${name}`;

//     res.status(200).json({ message: loud === "true" ? message.toUpperCase() : message })
// })

app.get("/greeting{/:name}", (req, res) => {
    const name = req.params.name ?? "lieber Benutzer";
    const { loud } = req.query;

    const message = `Hallo, ${name}`;

    res.status(200).json({ message: loud === "true" ? message.toUpperCase() : message })
})

app.listen(PORT, () => console.log(`Server läuft jetzt auf port ${PORT}`));