const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Password for answering questions
const ANSWER_PASSWORD = 'jeabi098ws';

// In-memory storage (replace with database in production)
let questions = [];

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

// Get all questions
app.get('/api/questions', (req, res) => {
  res.json(questions);
});

// Add a new question
app.post('/api/questions', (req, res) => {
  const newQuestion = {
    id: Date.now(),
    title: req.body.title,
    description: req.body.description,
    answered: false,
    answer: null,
    timestamp: Date.now()
  };

  questions.push(newQuestion);
  res.status(201).json(newQuestion);
});

// Answer a question
app.put('/api/questions/:id', (req, res) => {
  const { password, answer } = req.body;
  
  // Check password
  if (password !== ANSWER_PASSWORD) {
    return res.status(401).json({ message: 'Incorrect password' });
  }

  const questionId = parseInt(req.params.id);
  const questionIndex = questions.findIndex(q => q.id === questionId);

  if (questionIndex !== -1) {
    questions[questionIndex] = {
      ...questions[questionIndex],
      answer: answer,
      answered: true
    };
    res.json(questions[questionIndex]);
  } else {
    res.status(404).json({ message: 'Question not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});