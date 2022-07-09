const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const dbConnect = require("./db/dbConnect");
const User = require("./db/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("./auth");

dbConnect();

// Curb CORS Error by adding a header here
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

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

app.post("/login", (request, response) => {
  // Check if email exists
  User.findOne({ email: request.body.email })
    // If email exists
    .then(user => {
      bcrypt
        .compare(request.body.password, user.password)
        .then(passwordCheck => {
          // Check if passwords match
          if (!passwordCheck) {
            return response.status(400).send({
              message: "Password does not match",
              error,
            });
          }
          // If the passwords match, create JWT token
          const token = jwt.sign(
            {
              userId: user._id,
              userEmail: user.email,
            },
            "RANDOM-TOKEN",
            { expiresIn: "24h" }
          );
          // Return success response
          response.status(200).send({
            message: "Login successful",
            email: user.email,
            token,
          });
        })
        .catch(error => {
          response.status(404).send({
            message: "Password does not match",
            error,
          });
        });
    })
    .catch(error => {
      response.status(404).send({
        message: "Email not found",
        error,
      });
    });
});

// Free endpoint
app.get("/free-endpoint", (request, response) => {
  response.json({ message: "You are free to access me anytime" });
});

// Authentication endpoint
// Add `auth` as a 2nd argument
app.get("/auth-endpoint", auth, (request, response) => {
  response.json({ message: "You are authorized to access me" });
});

module.exports = app;
