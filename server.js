const fs = require('fs');
const express = require('express');
const path = require('path');

const PORT = 3001;

const app = express();
const notes = []

function loadNotes() {
  fs.readFile('/db/db.json','utf8', (err,data) => {
    if(err) throw err;
    notes = JSON.parse(data);
  });
}

app.use(express.static('public'));
app.use(express.urlencoded({extended : true}));
app.use(express.json);

app.get('/notes' , (req, res) => {
  res.sendFile(path.join(__dirname , '/public/notes.html'));
});

app.get("/api/notes", (req, res) => {
  res.json(notes);
});


app.get('*', (req,res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(PORT, () => {
  loadNotes();
  console.log(`App listening at http://localhost:${PORT} 🚀`)
}
);