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
      if (!req.body.text) {
        return res.status(400).json({ errorMessage: "Please provide text for the comment." })
      }
      Posts.insertComment(req.body)
        .then((comment) => {
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
  Posts.findById(req.params.id)
    .then(post => {
      if (post.length === 0) {
        return res.status(404).json({ message: "The post with the specified ID does not exist." })
      }
      Posts.remove(req.params.id)
        .then((post) => {
          return res.status(204).json({ message: "Post sucessfully deleted." })
        })
        .catch(error => {
          return res.status(500).json({ error: "The post could not be removed" })
        })
    })
    .catch(error => {
      return res.status(500).json({ error: "The post could not be removed" })
    })
});

router.put("/api/posts/:id", (req, res) => {
  const id = Posts.parseId(req.params.id, res);
  const userPost = Posts.findById(id)
  if (userPost.length === 0) {
    return res.status(404).json({ message: "The post with the specified ID does not exist." })
  }
  if (!req.body.title || !req.body.contents) {
    return res.status(400).json({ errorMessage: "Inside Catch: Please provide title and contents for the post." })
  }
  Posts.update(id, req.body)
    .then((post) => {
      console.log(post);
      return res.status(200).json(post)
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ error: "The post information could not be modified." })
    })
})

module.exports = router;