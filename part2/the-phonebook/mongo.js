const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as arguement");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://rakshan_kumar:${password}@cluster0.5jgurff.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", phonebookSchema);

if (process.argv.length === 3) {
  Person.find({}).then((results) => {
    mongoose.connection.close();
    console.log("phonebook:");
    results.forEach((result) => {
      console.log(result.name, result.number);
    });
    mongoose.connection.close();
  });
}

if (process.argv.length > 3) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });

  person.save().then((result) => {
    console.log(`added ${result.name} ${result.number} to phonebook`);
    mongoose.connection.close();
  });
}
