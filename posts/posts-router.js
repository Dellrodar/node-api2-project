const express = require("express")
const posts = require("../data/db")

const router = express.Router()

router.post("/api/posts", (req, res) => {
  posts.insert(req.body)
    .then((post) => {
      if (!req.body.title || !req.body.contents) {
        return res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
      }
      return res.status(201).json(post)
    })
    .catch((error) => {
      return res.status(500).json({ error: "There was an error while saving the post to the database" })
    })
})

router.post("/api/posts/:id/comments", (req, res) => {
  posts.findPostComments(req.params.id)
  if (!post) {
    return res.status(404).json({ message: "The post with the specified ID does not exist." })
  }
  posts.insertComment(req.body)
    .then((comment) => {
      if (!req.params.text) {
        return res.status(400).json({ errorMessage: "Please provide text for the comment." })
      }
      return res.status(201).json(comment)
    })
    .catch((error) => {
      return res.status(500).json({ error: "There was an error while saving the comment to the database" })
    })
})

router.get("/api/posts", (req, res) => {
  posts.find(req.query)
    .then((posts) => {
      return res.json(posts)
    })
    .catch((error) => {
      return res.status(500).json({ error: "The posts information could not be retrieved." })
    })
})

router.get("/api/posts/:id", (req, res) => {
  posts.findById(req.params.id)
    .then((post) => {
      if (!post) {
        return res.status(404).json({ message: "The post with the specified ID does not exist." })
      }
      return res.json(post)
    })
    .catch((error) => {
      return res.status(500).json({ error: "The post information could not be retrieved." })
    })
})

router.get("/api/posts/:id/comments", (req, res) => {
  posts.findPostComments(req.params.id)
    .then((post) => {
      if (!post) {
        return res.status(404).json({ message: "The post with the specified ID does not exist." })
      }
      return res.json(post)
    })
    .catch((error) => {
      return res.status(500).json({ error: "The comments information could not be retrieved." })
    })
})

router.delete("/api/posts/:id", (req, res) => {
  const userPost = posts.findById(req.params.id);
  posts.remove(req.params.id)
    .then((post) => {
      if (!post) {
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
  const userPost = posts.findById(id)
  if (!userPost) {
    return res.status(404).json({ message: "The post with the specified ID does not exist." })
  }
  posts.update(id, userPost)
    .then((post) => {
      if (!req.body.title || !req.body.contents){
        return res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
      }
      res.status(200).json(post)
    })
    .catch((error) => {
      return res.status(500).json({ error: "The post information could not be modified." })
    })
})

module.exports = router;