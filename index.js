const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(express.json());

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

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

const generateId = () => {
  const maxInt = 2147483647;
  return Math.floor(Math.random() * maxInt) + 1;
};

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.post('/api/persons', (request, response) => {
  const { body } = request;

  if (!body.name) {
    return response.status(404).json({ error: 'Name is missing' });
  }

  if (!body.number) {
    return response.status(404).json({ error: 'Number is missing' });
  }

  if (persons.find((person) => person.name === body.name)) {
    return response.status(409).json({ error: 'The name already exists in the phonebook' });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  response.json(person);
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

app.get('/info', (request, response) => {
  response.send(`
    <div>Phonebook has info for ${persons.length} people</div>
    <br>
    <div>${Date()}</div>
  `);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
