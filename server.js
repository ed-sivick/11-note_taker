// Require Dependencies
const express = require("express");
const fs = require("fs");
const uuid = require("uuid/v1");
const path = require("path");
// Sets up the Express App and identifies port 3000
const app = express();
const PORT = process.env.PORT || 3000;
const mainDir = path.join(__dirname, "/public");

// Express app that will handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Route that sends the user to the index page
app.get("/", function (req, res) {
    res.sendFile(path.join(mainDir, "index.html"));
});

// Route that sends the user to the notes page
app.get("/notes", function (req, res) {
    res.sendFile(path.join(mainDir, "notes.html"));
});

// Route to POST notes
app.post("/api/notes", function (req, res) {
    let savedNotes = require("./db/db.json");

    // Assign newNote for added note
    let newNote = req.body;

    // Assigns a new note unique id
    newNote.id = uuid();
    // Pushes the new note to savedNotes and use JSON stringify
    savedNotes.push(newNote);
    savedNotes = JSON.stringify(savedNotes);

    // create writeFile function to save user's notes with JSON parse  
    fs.writeFile("./db/db.json", savedNotes, "utf8", (err) => {
        if (err) throw err;
        console.log("A note was saved to file");
        res.json(JSON.parse(savedNotes));
    });

});

// Route to GET notes 
app.get("/api/notes", function (req, res) {
    let savedNotes = require("./db/db.json");
    res.json(savedNotes);
});

// Route to delete notes
app.delete("/api/notes/:id", function (req, res) {
    let id = req.params.id;

    let savedNotes = require("./db/db.json");
    for (let i = 0; i < savedNotes.length; i++) {
        if (id === savedNotes[i].id) {
            savedNotes.splice(i, 1);
        }
    }
    savedNotes = JSON.stringify(savedNotes);

    // create writeFile function for saved notes, throws error if note was deleted   
    fs.writeFile("./db/db.json", savedNotes, "utf8", (err) => {
        if (err) throw err;
        console.log("A note was deleted from file");
    });
    res.send(JSON.parse(savedNotes));

});

// use GET Route to send to home page if user types an un-identified route
app.get("*", function (req, res) {
    res.sendFile(path.join(mainDir, "index.html"));
});

// Starts server to listen on port 3000
app.listen(PORT, function () {
    console.log(`App is listening on http://localhost:${PORT}`);
});