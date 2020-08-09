const express = require("express");
const Posts = require("../data/db.js");

const router = express.Router();

router.post("/api/posts", (req, res) => {
  Posts.insert(req.body)
    .then((post) => {
      if (!req.body.title || !req.body.contents) {
        return res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
      }
      return res.status(201).json({ message: "Post sucessfully created!", post })
    })
    .catch((error) => {
      return res.status(500).json({ error: "There was an error while saving the post to the database" })
    })
})

router.post("/api/posts/:id/comments", (req, res) => {
  Posts.findById(req.params.id)
    .then(post => {
      if (post.length === 0) {
        return res.status(404).json({ message: "The post with the specified ID does not exist." })
      }
      Posts.insertComment(req.body)
        .then((comment) => {
          if (!req.body.text) {
            return res.status(400).json({ errorMessage: "Please provide text for the comment." })
          }
          return res.status(201).json(comment)
        })
        .catch((error) => {
          return res.status(500).json({ error: "There was an error while saving the comment to the database" })
        })
    })
    .catch((error) => {
      return res.status(500).json({ error: "First level: There was an error while saving the comment to the database" })
    })
})

router.get("/api/posts", (req, res) => {
  Posts.find(req.query)
    .then(posts => {
      return res.json(posts)
    })
    .catch((error) => {
      return res.status(500).json({ error: "The posts information could not be retrieved." })
    })
})

router.get("/api/posts/:id", (req, res) => {
  Posts.findById(req.params.id)
    .then(post => {
      if (post.length === 0) {
        return res.status(404).json({ message: "The post with the specified ID does not exist." })
      }
      return res.json(post)
    })
    .catch((error) => {
      return res.status(500).json({ error: "The post information could not be retrieved." })
    })
})

router.get("/api/posts/:id/comments", (req, res) => {
  Posts.findById(req.params.id)
    .then(post => {
      if (post.length === 0) {
        return res.status(404).json({ message: "The post with the specified ID does not exist." })
      }
      Posts.findPostComments(req.params.id)
        .then(comments => {
          return res.json(comments)
        })
        .catch((error) => {
          return res.status(500).json({ error: "The comments information could not be retrieved." })
        })
    })
    .catch((error) => {
      return res.status(500).json({ error: "First Level: The comments information could not be retrieved." })
    })
})


router.delete("/api/posts/:id", (req, res) => {
  const userPost = Posts.findById(req.params.id);
  Posts.remove(userPost.id)
    .then((post) => {
      if ((post.length === 0)) {
        return res.status(404).json({ message: "The post with the specified ID does not exist." })
      }
      return res.status(204).json({ message: "Post sucessfully deleted.", userPost })
    })
    .catch((error) => {
      return res.status(500).json({ error: "The post could not be removed" })
    })
})

router.put("/api/posts/:id", (req, res) => {
  const id = req.params.id
  const userPost = Posts.findById(id)
  if (!userPost) {
    return res.status(404).json({ message: "The post with the specified ID does not exist." })
  }
  Posts.update(id, userPost)
    .then((post) => {
      if (!req.body.title || !req.body.contents) {
        return res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
      }
      res.status(200).json(post)
    })
    .catch((error) => {
      return res.status(500).json({ error: "The post information could not be modified." })
    })
})

module.exports = router;