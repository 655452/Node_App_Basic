const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const cors = require('cors'); // Import the cors package


// Enable CORS for all routes


const app = express();
app.use(bodyParser.json());
app.use(cors());

const databaseFile = 'data.json';

// Load data from JSON file
let data = JSON.parse(fs.readFileSync(databaseFile));
app.get('/api/notes', (req, res) => {
    res.json(data.notes);
  });
  
  app.get('/api/notes/:id', (req, res) => {
    const note = data.notes.find(item => item.id === parseInt(req.params.id));
    if (!note) return res.status(404).send('Note not found.');
    res.json(note);
  });
  
  app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    newNote.id = data.notes.length + 1;
    data.notes.push(newNote);
    fs.writeFileSync(databaseFile, JSON.stringify(data, null, 2));
    res.json(newNote);
  });
  
  app.put('/api/notes/:id', (req, res) => {
    console.log(req)
    const note = data.notes.find(item => item.id === parseInt(req.params.id));
    if (!note) return res.status(404).send('Note not found.');
    Object.assign(note, req.body);
    fs.writeFileSync(databaseFile, JSON.stringify(data, null, 2));
    res.json(note);
  });
  
  app.delete('/api/notes/:id', (req, res) => {
    const noteIndex = data.notes.findIndex(item => item.id === parseInt(req.params.id));
    if (noteIndex === -1) return res.status(404).send('Note not found.');
    data.notes.splice(noteIndex, 1);
    fs.writeFileSync(databaseFile, JSON.stringify(data, null, 2));
    res.send('Note deleted successfully.');
  });
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
