'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { response } = require('express');
const mongoose = require('mongoose'); // 0 - import mongoose

const server = express();

server.use(cors()); //make my server open for any request
server.use(express.json());

//IP : http://localhost:PORT

const PORT = process.env.PORT || 3010;

const mongoURL = process.env.MONGO
// mongoose config
mongoose.connect(`${mongoURL}`, { useNewUrlParser: true, useUnifiedTopology: true }); // 1 - connect mongoose with DB (301d35-books)

const bookSchema = new mongoose.Schema({ //define the schema (structure)
  title: String,
  description: String,
  status: String,
  userName: String
});

const BookModel = mongoose.model('Book', bookSchema); //compile the schema into a model

//seed data (insert initial data)
async function seedData() {
  const firstBook = new BookModel({
    title: "Origin",
    description: "Origin is a 2017 mystery thriller novel by American author Dan Brown and the fifth installment in his Robert Langdon series, following Inferno. The book was released on October 3, 2017, by Doubleday. The book is predominantly set in Spain and features minor sections in Sharjah and Budapest.",
    status: "available",
    userName: "Admin"
  })

  const secondBook = new BookModel({
    title: "Animal Farm",
    description: "Animal Farm is a beast fable, in form of satirical allegorical novella, by George Orwell, first published in England on 17 August 1945. It tells the story of a group of farm animals who rebel against their human farmer, hoping to create a society where the animals can be equal, free, and happy.",
    status: "low stock",
    userName: "Admin"
  })

  const thirdBook = new BookModel({
    title: "Nineteen Eighty-Four",
    description: "Nineteen Eighty-Four is a dystopian social science fiction novel and cautionary tale written by the English writer George Orwell. It was published on 8 June 1949 by Secker & Warburg as Orwell's ninth and final book completed in his lifetime.",
    status: "sold-out",
    userName: "Admin"
  })

  await firstBook.save();
  await secondBook.save();
  await thirdBook.save();
}

// seedData();

//Routes
server.get('/', homeHandler);
server.get('/test', testHandler);
server.get('/Books', getBooksHandler);
server.post('/Books', addBooksHandler);
server.delete('/Books/:id', deleteBookHandler);
server.put('/Books/:id', updateBookHandler);



// http://localhost:3000/
function homeHandler(req, res) {
  res.send("Hi from the home route");
}

// http://localhost:3000/test
function testHandler(req, res) {
  res.status(200).send("You are requesting the test route");
}

// http://localhost:3000/*
function defualtHandler(req, res) {
  res.status(404).send("Sorry, Page not found");
}

// http://localhost:3000/getBooks
function getBooksHandler(req, res) {
  const userName = req.query.userName
  BookModel.find({ userName: userName }, (err, result) => {
    if (err) {
      console.log(err);
    }
    else {
      // console.log(result);
      res.send(result);
    }
  })
}

// http://localhost:3000/addBooks
async function addBooksHandler(req, res) {
  const { title, description, status, userName } = req.body;

  await BookModel.create({
    title: title,
    description: description,
    status: status,
    userName: userName
  });

  BookModel.find({ userName: userName }, (err, result) => {
    if (err) {
      console.log(err);
    }
    else {
      console.log(result);
      res.send(result);
    }
  })
}

// http://localhost:3000/deleteBooks/:id
function deleteBookHandler(req, res) {
  const bookID = req.params.id;
  const userName = req.query.userName
  // console.log(req.params.id)
  BookModel.deleteOne({ _id: bookID }, (err, result) => {
    BookModel.find({ userName: userName }, (err, result) => {
      if (err) {
        console.log(err);
      }
      else {
        // console.log(result);
        res.send(result);
      }
    })
  })
}

// http://localhost:3000/updateBooks/:id
function updateBookHandler(req, res) {
  const id = req.params.id;
  const { title, description, status, userName } = req.body;

  BookModel.findByIdAndUpdate(id, { title, description, status, userName }, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      book.find({ userName: userName }, (err, result) => {
        if (err) {
          console.log(err);
        }
        else {
          res.send(result);
        }
      })
    }
  })

}

server.get('*', defualtHandler);

// listener
server.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
})