const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const dbConnect = require("./db/dbConnect");
const User = require("./db/userModel");
const bcrypt = require("bcrypt");

// Body parser configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (request, response, next) => {
  response.json({ message: "Hey! This is your server response!" });
  next();
});

app.post("/register", (request, response) => {
  // Hash password before saving email and password into the database
  // Hash the password received from request body 10 times /  10 salt rounds
  bcrypt
    .hash(request.body.password, 10)
    .then(hashedPassword => {
      // Create a new user instance and collect the data
      const user = new User({
        email: request.body.email,
        password: hashedPassword,
      });
      // Save the new user
      user
        .save()
        .then(result => {
          response.status(201).send({
            message: "User created successfully",
            result,
          });
        })
        .catch(error => {
          response.status(500).send({
            message: "Error creating user",
            error,
          });
        });
    })
    .catch(error => {
      response.status(500).send({
        message: "Password was not hashed successfully",
        error,
      });
    });
});

dbConnect();

module.exports = app;
