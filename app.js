const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();

app.get("/api", (req, res) => {
  res.json({
    message: "Welcome to the API",
  });
});

app.post("/api/posts", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      console.log(err);
      res.sendStatus(403);
    } else {
      res.json({
        message: "Post Created",
        authData,
      });
    }
  });
});

app.post("/api/login", (req, res) => {
  //Mock user
  const user = {
    id: 1,
    username: "luka",
    email: "luka@gmail.com",
  };

  jwt.sign({ user: user }, "secretkey", { expiresIn: "30s" }, (err, token) => {
    res.json({ token: token });
  });
});

// FORMAT OF TOKEN
// Authorization: Bearer <access_token>

// Verify Token middleware
function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers["authorization"];
  //Check if bearer is undefined
  if (typeof bearerHeader !== "undefined") {
    //Split at spaces
    const bearer = bearerHeader.split(" ");

    //Get token from array
    const bearerToken = bearer[1];

    //set the token
    req.token = bearerToken;

    //next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }
}

app.listen(5000, () => console.log("Server started on 5000"));
