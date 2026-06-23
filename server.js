const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

app.use(express.json());

let blogPosts = [];

const logger = (req, res, next) => {
  const currentTime = new Date().toLocaleTimeString();
  console.log(`[${req.method}] ${req.url} - ${currentTime}`);
  next();
};

app.post("/login", (req, res) => {
  const { name, email, password } = req.body;
  const token = jwt.sign(
    { data: JSON.stringify({ name, email }) },
    process.env.JWT_SECRET || "mock_secret",
    { expiresIn: "720h" },
  );
  res.json({ token });
});

app.get("/posts", logger, (req, res) => {
  res.json({ posts: blogPosts });
});

app.get("/posts/:id", logger, (req, res) => {
  const id = req.params.id;
  const result = blogPosts.find((post) => post.id === id);

  if (!result) {
    return res.status(404).json({ message: "Post not found" });
  }

  res.json({ post: result });
});

app.post("/posts", logger, (req, res) => {
  const { id, content, likes } = req.body;

  if (id === undefined || content === undefined || likes === undefined) {
    return res.status(422).json({ message: "Invalid payload" });
  }

  const newPost = { id, content, likes };
  blogPosts.push(newPost);

  res.status(201).json({ post: newPost });
});

app.put("/posts/:id", logger, (req, res) => {
  const id = req.params.id;
  const { content, likes } = req.body;

  const postIndex = blogPosts.findIndex((post) => post.id === id);

  if (postIndex === -1) {
    return res.status(404).json({ message: "Post not found" });
  }

  blogPosts[postIndex] = { ...blogPosts[postIndex], content, likes };
  res.json({ post: blogPosts[postIndex] });
});

app.delete("/posts/:id", logger, (req, res) => {
  const id = req.params.id;
  const initialLength = blogPosts.length;

  blogPosts = blogPosts.filter((post) => post.id !== id);

  if (blogPosts.length === initialLength) {
    return res.status(404).json({ message: "Post not found" });
  }

  res.json({ message: "Post successfully deleted" });
});

app.listen(5000, () => {
  console.log("Server listening on port 5000");
});
