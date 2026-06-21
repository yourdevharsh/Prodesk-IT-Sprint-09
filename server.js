const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

app.use(express.json());

let blogPosts = [
  {
    id: "12345",
    content: "Content 1",
    likes: "39280",
  },
  {
    id: "23456",
    content: "Content 2",
    likes: "583",
  },
];

const logger = (req, res, next) => {
  const currentTime = new Date();
  console.log(`[${req.method}] ${req.url} - ${currentTime}`);
  next();
};

const verifyJwt = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Missing Token" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send("Invalid Token");
    }

    // No full implementation of JWT as it is not required in project.
    next();
  });
};

app.post("/login", (req, res) => {
  const { name, email, password } = req.body;
  jwt.sign(
    { data: JSON.stringify({ name: name, email: email }) },
    process.env.JWT_SECRET,
    { expiresIn: "720h" },
  );
  res.json({ token: token });
});

app.get("/posts", logger, verifyJwt, (req, res) => {
  res.json({ posts: blogPosts });
});

app.get("/posts/:id", logger, verifyJwt, (req, res) => {
  const id = req.params.id;
  const result = blogPosts.filter((post) => {
    post.id == id;
  });
  res.josn({ post: result[0] });
});

app.post("/posts", logger, verifyJwt, (req, res) => {
  const { id, content, likes } = req.body;

  if (id === undefined || content === undefined || likes === undefined) {
    req.status(422).json({ message: "Invalid ID" });
  }

  blogPosts.push({
    id: id,
    content: content,
    likes: likes,
  });
});

app.put("/posts/:id", logger, verifyJwt, (req, res) => {
  const { id, content, likes } = req.body;

  if (id === undefined) {
    req.status(422).json({ message: "Invalid ID" });
  }
});

app.delete("/posts/:id", logger, verifyJwt, (req, res) => {
  const id = req.params.id;

  if (id === undefined) {
    req.status(422).json({ message: "Invalid ID" });
  }

  blogPosts = blogPosts.filter((post) => {
    post.id != id;
  });
});

app.listen(process.env.PORT, () => {
  console.log("Server listening");
});
