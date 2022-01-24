require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

app.get("/posts", authenticateToken, (req, res) => {
  console.log(req.user);
  res.json(posts.filter((post) => post.username === req.user.name));
});

app.post("/login", (req, res) => {
  //Authenticate user

  const username = req.body.username;
  const user = { name: username };

  console.log(
    process.env.ACCESS_TOKEN_SECRET,
    "===process.env.ACCESS_TOKEN_SECRET"
  );

  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

  console.log(accessToken, "===accessToken");

  res.json({ accessToken: accessToken, refreshToken: refreshToken });
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

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "25s" });
}

//10 - 15 minutes in a real app

app.listen(4000, () => console.log("Server at 4000"));
