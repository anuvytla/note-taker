// Dependencies
const express = require('express');
const path = require('path');
const db = require('./db');

// assigning port
const PORT = 3001;

// Initialize app variable. 
const app = express();

// Invoke app.use() and serve static files from the '/public' folder
app.use(express.static('public'));
// Middleware for parsing JSON and urlencoded form data
app.use(express.urlencoded({extended : true}));
app.use(express.json());


// Create a route for /notes that will serve up the `public/notes.html` page
app.get('/notes' , (req, res) => {
  res.sendFile(path.join(__dirname , '/public/notes.html'));
});

// GET Routes for /api/notes to return all notes.
app.get('/api/notes', (req, res) => {
  return res.json(db.getAllNotes());
});

// GET Route for homepage.
app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

// POST route for /api/routes to create a new note.
app.post('/api/notes', (req,res) => {
  // extract title and text of the note from request body.
  let {title, text} = req.body;
  // Create a new note in the DB.
  db.createNote(title, text).then((result) => res.json(result)).catch((err) => res.json(err));
});

// GET Route to retrive note with specific id.
app.get('/api/notes/:id' , (req, res) => {
  // fetch specific note from db and send it back.
  res.json(db.getNoteWithId(req.params.id));
});


// Delete note with the given id
app.delete('/api/notes/:id' , (req,res) => {
  // Delete the note from DB and respond back with deleted note if succeeded, err if failed.
  db.deleteNoteWithId(req.params.id).then((result) => res.json(result)).catch((err) => res.json(err));
});

// listen to the port  when deployed
app.listen(PORT, () => {
  // Initialize notes DB on starting the server.
  db.initiateNotesDB();
  console.log(`App listening at http://localhost:${PORT} 🚀`)
});