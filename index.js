const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();

const posts = {};

const handleEvents = (type, data) => {
  if (type === "CommentCreated") {
    const { id, content, postId, status } = data;
    posts[postId].comments.push({ id, content, status });
  }
  if (type === "PostCreated") {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }
  if (type === "CommentUpdated") {
    const comment = posts[data.postId].comments.find(
      (comment) => comment.id == data.id
    );
    comment.status = data.status;
    comment.content = data.content;
  }
};

app.use(bodyParser.json());

app.use(cors());

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;
  handleEvents(type, data);
  res.send({});
});

app.listen(4002, async () => {
  console.log("listening on port 4002");
  const res = await axios.get("http://localhost:4005/events");
  res.data.forEach(({ type, data }) => {
    handleEvents(type, data);
  });
});
