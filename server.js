const fs = require('fs');
const express = require('express');
const path = require('path');

const PORT = 3001;

const app = express();
let notes = []

function loadNotes() {
  fs.readFile('./db/db.json','utf8', (err,data) => {
    if(err) throw err;
    notes = JSON.parse(data);
  });
}

app.use(express.static('public'));
app.use(express.urlencoded({extended : true}));
app.use(express.json());

app.get('/notes' , (req, res) => {
  res.sendFile(path.join(__dirname , '/public/notes.html'));
});

app.get('/api/notes', (req, res) => {
  return res.json(notes);
});

app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.post('/api/notes', (req,res) => {
 
  let newNote = req.body;
  notes.push(newNote);
  updateNotes();
  console.log("Added new note: "+newNote.title);

});



function updateNotes() {
  fs.writeFile("./db/db.json",JSON.stringify(notes,'\t'),err => {
    if (err) {
      return res.status(400).json({err});
    }
    res.json(notes);
  });
}



app.get('/api/notes/:id' , (req, res) => {
  res.json(notes[req.params.id]);
});



app.delete('/api/notes/:id' , (req,res) => {
  notes.splice(req.params.id , 1);
  updateNotes();
  console.log('Deleted notes of id' + req.params.id);
});

app.listen(PORT, () => {
  loadNotes();
  console.log(`App listening at http://localhost:${PORT} 🚀`)
}
);