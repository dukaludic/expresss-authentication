require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

const posts = [
  {
    username: "luka",
    title: "post1",
  },
  {
    username: "jim",
    title: "post2",
  },
];

app.get("/posts", authenticateToken, (req, res) => {
  console.log(req.user);
  res.json(posts.filter((post) => post.username === req.user.name));
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log(token);
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    //user is a decoded payload
    req.user = user;
    next();
  });
}

app.listen(5000, () => console.log("Server at 5000"));
