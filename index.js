const express = require("express");
const app = express();
const port = 3000;
const path = require("path");

const USERS = [];
const QUESTIONS = [
  {
    title: "Two states",
    description: "Given an array, return the maximum of the array?",
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "5",
      },
    ],
  },
];
const SUBMISSION = [];

function isAdmin(email) {
  // Hardcoded admin email
  const adminEmail = "admin@example.com";
  return email === adminEmail;
}

function authenticateToken(req, res, next) {
  const token = req.header("Authorization");

  // For simplicity, we'll check if the token is a non-empty string
  if (!token || token === "undefined") {
    return res.status(401).send("Access denied. Invalid token.");
  }

  // Continue to the next middleware or route handler
  next();
}
// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json()); // Middleware to parse request bodies as JSON

app.post("/signup", function (req, res) {
  const { email, password } = req.body;

  // Check if the user already exists
  const userExists = USERS.some((user) => user.email === email);
  if (userExists) {
    return res.status(400).send("User already exists.");
  }

  // Create a new user object and add it to the USERS array
  USERS.push({ email, password });

  // Return 200 status code and a success message
  res.status(200).send("User registered successfully.");
});

app.post("/login", function (req, res) {
  const { email, password } = req.body;

  // Find the user with the provided email in the USERS array
  const user = USERS.find((user) => user.email === email);

  // Check if the user exists and if the password matches
  if (!user || user.password !== password) {
    return res.status(401).send("Invalid credentials.");
  }

  // For simplicity, let's generate a random token
  const token = Math.random().toString(36).substr(2);

  // Return 200 status code, success message, and the generated token
  res.status(200).json({ message: "Login successful.", token });
});

app.get("/questions", authenticateToken, function (req, res) {
  // Return the user all the questions in the QUESTIONS array
  res.status(200).json(QUESTIONS);
});

app.get("/submissions", authenticateToken, function (req, res) {
  // Return the user's submissions for this problem
  res.status(200).json(SUBMISSION);
});

app.post("/submissions", authenticateToken, function (req, res) {
  // Let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  SUBMISSION.push(req.body); // Assuming the request body contains the submission
  res.status(200).send("Solution submitted successfully.");
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
