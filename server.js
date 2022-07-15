// Dependencies
const fs = require('fs');
const express = require('express');
const path = require('path');

// assigning port
const PORT = 3001;

// Initialize app variable 
const app = express();
// initiate empty array  with variable notes
let notes = []
let nextId = 1;

// loading notes 
function loadNotes() {
  fs.readFile('./db/db.json','utf8', (err,data) => {
    if(err) throw err;
    notes = JSON.parse(data);
    if(notes.length) {
      nextId = notes[notes.length - 1]['id']+1;
    }
  });
}

// Middleware for parsing JSON and urlencoded form data
// Invoke app.use() and serve static files from the '/public' folder
app.use(express.static('public'));
app.use(express.urlencoded({extended : true}));
app.use(express.json());


// Create a route that will serve up the `public/notes.html` page
app.get('/notes' , (req, res) => {
  res.sendFile(path.join(__dirname , '/public/notes.html'));
});

// GET Routes for /api/notes
app.get('/api/notes', (req, res) => {
  return res.json(notes);
});

// GET Route for homepage
app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.post('/api/notes', (req,res) => {
  let newNote = req.body;
  newNote['id'] = nextId;
  nextId += 1;
  notes.push(newNote);
  // 
  updateNotes().then((result) => res.json(result)).catch((err) => res.json(err));
  console.log("Added new note: "+newNote.title);
});

function updateNotes() {
  return new Promise((resolve, reject) => {
    fs.writeFile("./db/db.json",JSON.stringify(notes,'\t'),err => {
      if (err) {
        return reject(err);
      } else {
        resolve(notes);
      }
    });
  });
}

// retrive notes with specific id
app.get('/api/notes/:id' , (req, res) => {
  for (let i = 0; i < notes.length; i++) {
    if(notes[i].id == req.params.id){
      res.json(notes[i]);
      return;
    }
  }
  // display json for the notes array indices of the provided id
  res.json('Todo not found');
});


//delete note with the given id
app.delete('/api/notes/:id' , (req,res) => {
  console.log('Hit delete');
  // deleting notes of the requested id using splice method 
  for (let i = 0; i < notes.length; i++) {
    if(notes[i].id == req.params.id){
      notes.splice(i, 1);
      break;
    }
  }
  // updating original notes after deletion
  updateNotes();
  // converting response in to json format 
  res.json(req.params.id);
});

// listen to the port  when deployed
app.listen(PORT, () => {
  loadNotes();
  console.log(`App listening at http://localhost:${PORT} 🚀`)
}
);