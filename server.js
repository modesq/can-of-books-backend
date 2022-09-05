'use strict';

const express = require('express');
const cors = require('cors');
const { response } = require('express');
require('dotenv').config();
const mongoose = require('mongoose'); // 0 - import mongoose

const server = express();

server.use(cors()); //make my server open for any request

//IP : http://localhost:PORT

const PORT = process.env.PORT || 3010;

// mongoose config
mongoose.connect('mongodb://localhost:27017/301d35-books', { useNewUrlParser: true, useUnifiedTopology: true }); // 1 - connect mongoose with DB (301d35-books)

const bookSchema = new mongoose.Schema({ //define the schema (structure)
  title: String,
  description: String,
  status: String
});

const BookModel = mongoose.model('Book', bookSchema); //compile the schema into a model

//seed data (insert initial data)
async function seedData() {
  const firstBook = new BookModel({
    title: "Da Vinci Code",
    description: "Symbologist Robert Langdon travels from Paris to London to unravel a bizarre murder. Accompanied by a cryptographer, he soon comes across a religious enigma protected by an age-old secret society.",
    state: "available"
  })

  const secondBook = new BookModel({
    title: "Harry Potter and the Deathly Hallows",
    description: "After Voldemort takes over the Ministry of Magic, Harry, Ron and Hermione are forced into hiding. They try to decipher the clues left to them by Dumbledore to find and destroy Voldemort's Horcruxes.",
    state: "available"
  })

  const thirdBook = new BookModel({
    title: "Life of Pi",
    description: "Molitor Pi Patel, a Tamil boy from Pondicherry, explores issues of spirituality and practicality from an early age. He survives 227 days after a shipwreck while stranded on a boat in the Pacific Ocean with a Bengal tiger named Richard Parker.",
    state: "sold-out"
  })

  await firstBook.save();
  await secondBook.save();
  await thirdBook.save();
}

seedData();

//Routes
server.get('/', homeHandler);
server.get('/test', testHandler);
server.get('/getBooks', getBooksHandler);
server.get('*', defualtHandler);


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


function getBooksHandler(req, res) {
  BookModel.find({}, (err, result) => {
    if (err) {
      console.log(err);
    }
    else {
      console.log(result);
      res.send.json(result);
    }
  })
}

server.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
})