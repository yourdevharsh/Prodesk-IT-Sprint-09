const express = require("express");

const app = express();

let blogPosts = [];

const logger = (req, res, next) => {
  const currentTime = new Date();
  console.log(`[${req.method}] ${req.url} - ${currentTime}`);
  next();
};

app.get("/posts", logger, (req, res) => {
  res.json({ posts: blogPosts });
});

app.get("/posts/:id", (req, res) => {
  const id = req.params.id;
  const result = blogPosts.filter((post) => {
    post.id == id;
  });
  res.josn({ post: result });
});

app.post("/posts", (req, res) => {
  res.send("Hello");
});

app.put("/posts/:id", (req, res) => {
  res.send("Hello");
});

app.delete("/posts/:id", (req, res) => {
  const id = req.params.id;
  
});

app.listen(5000, () => {
  console.log("Server listening");
});
