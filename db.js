const fs = require('fs');

// Array to temporary cache notes in memory.
let notes = [];
// id for the next new note.
let nextNoteId = 1;

// Read the saved notes from json file and initialized the im-memory cache.
function initiateNotesDB() {
    fs.readFile('./db/db.json','utf8', (err, data) => {
        // Fail if there is an error.
        if(err) throw err;
        // Initialize the cache.
        notes = JSON.parse(data);
        // Initialize nextNoteId to the id of last note + 1.
        if(notes.length) {
            nextNoteId = notes[notes.length - 1].id + 1;
        }
    });
}

// Return all notes.
function getAllNotes() {
    return notes;
}

// Returns the note with sepcific id, null if it doesn't exist.
function getNoteWithId(noteId) {
    for (let i = 0; i < notes.length; i++) {
        if(notes[i].id == noteId){
          return notes[i];
        }
    }
    return null;
}

// Creates a note with given title and text and save it DB.
function createNote(title, text) {
    // Create a new note with id as nextNoteId.
    let newNote = {
        'id': nextNoteId,
        'title': title,
        'text': text
    }

    // Update in-memory cache with newNote.
    notes.push(newNote);
    // Increment the nextNoteId.
    nextNoteId += 1;

    // Return a promise, while we wait for saving the DB.
    return new Promise((resolve, reject) => {
        // Update db file with new notes.
        fs.writeFile("./db/db.json",JSON.stringify(notes,'\t'),err => {
          if (err) {
            reject(err);
          } else {
            // return the newly created note with id.
            resolve(newNote);
          }
        });
      });
}

// Deletes the note with specific id and returns the deleted note if it exists.
function deleteNoteWithId(noteId) {
  let deletedNote;
  // Find the note with noteId in the in-memory cache.
  for (let i = 0; i < notes.length; i++) {
    if(notes[i].id == noteId){
      // Save the deleted note.
      deletedNote = notes.splice(i, 1);
      break;
    }
  }

  // Return a promise while we wait on the save operation.
  return new Promise((resolve, reject) => {
    // Write the updated notes.
    fs.writeFile("./db/db.json",JSON.stringify(notes,'\t'),err => {
      if (err) {
        reject(err);
      } else {
        // return the deleted note.
        resolve(deletedNote);
      }
    });
  });
}

exports.initiateNotesDB = initiateNotesDB;
exports.getAllNotes = getAllNotes;
exports.getNoteWithId = getNoteWithId;
exports.createNote = createNote;
exports.deleteNoteWithId = deleteNoteWithId;