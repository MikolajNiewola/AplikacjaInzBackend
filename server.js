const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const DB_PATH = "./db.json";

const readDB = () => JSON.parse(fs.readFileSync(DB_PATH));
const writeDB = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

// DATA-BACKUP ENDPOINTS
// POST /api/data-backup

app.post("/api/data-backup", (req, res) => {
    const { token, data } = req.body;

    if (!token || !data) {
        return res.status(400).json({ error: "Token and data are required" });
    }

    const db = readDB();

    db.tokens[token] = data; 

    writeDB(db);

    res.json({success: true, token });
});

// GET /api/data-backup/:token
app.get("/api/data-backup/:token", (req, res) => {
    const db = readDB();
    const userData = db.tokens[req.params.token];

    if (!userData) {
        return res.status(404).json({error: "Invalid Token"});
    }

    res.json(userData);
});

// DELETE /api/data-backup/:token
app.delete("/api/data-backup/:token", (req, res) => {
    const db = readDB();

    if (!db.tokens[req.params.token]) {
        return res.status(404).json({error: "Invalid Token"});
    }

    delete db.tokens[req.params.token];
    writeDB(db);

    res.json({success: true, message: `token ${req.params.token} deleted`});
});

// EXERCISE ENDPOINTS
// GET /api/exercises
app.get("/api/exercises", (req, res) => {
    const db = readDB();
    res.json(db.exercises);
});

// GET /api/exercises/:id
app.get("/api/exercises/:id", (req, res) => {
    const db = readDB();
    const exercise = db.exercises.find(ex => ex.id === Number(req.params.id));

    if (!exercise) {
        return res.status(404).json({error: "Exercise not found"});
    }

    res.json(exercise);
});

// static
app.use('/imgs', express.static(path.join(__dirname, 'assets/imgs')));
app.use('/gifs', express.static(path.join(__dirname, 'assets/gifs')));


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});