require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const Person = require('./models/person');

const app = express();
app.use(express.static('build'));
app.use(express.json());
app.use(cors());
app.use(
  morgan((tokens, req, res) => {
    const method = tokens.method(req, res);
    const format = [
      method,
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'),
      '-',
      tokens['response-time'](req, res),
      'ms',
    ];
    if (method === 'POST') {
      format.push(JSON.stringify(req.body));
    }
    return format.join(' ');
  }),
);

app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then((person) => {
    if (person) {
      response.json(person);
    } else {
      response.status(404).end();
    }
  });
});

app.post('/api/persons', (request, response) => {
  const { body } = request;

  if (!body.name) {
    return response.status(404).json({ error: 'Name is missing' });
  }

  if (!body.number) {
    return response.status(404).json({ error: 'Number is missing' });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndDelete(request.params.id, (err) => {
    if (err) {
      console.log(err);
    } else {
      response.status(204).end();
    }
  });
});

app.get('/info', (request, response) => {
  response.send(`
    <div>Phonebook has info for ${persons.length} people</div>
    <br>
    <div>${Date()}</div>
  `);
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
