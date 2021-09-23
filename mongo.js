const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>');
  process.exit(1);
}

const [password, name, number] = process.argv.slice(2);

const url = `mongodb+srv://fullstack:${password}@cluster0.p2cpa.mongodb.net/phonebook-app?retryWrites=true&w=majority`;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

if (name && number) {
  const newPerson = new Person({ name, number });

  newPerson.save().then(() => {
    console.log('person saved!');
    mongoose.connection.close();
  });
} else {
  Person.find({}).then((persons) => {
    console.log('phonebook:');
    persons.forEach(({ name, number }) => {
      console.log(`${name} ${number}`);
    });
    mongoose.connection.close();
    process.exit(1);
  });
}
