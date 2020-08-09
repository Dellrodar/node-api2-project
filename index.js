const express = require("express")
const cors = require("cors")
const postsRouter = require("./posts/posts-router")

const server = express();
const port = 8080

server.use(express.json());
server.use(postsRouter);
server.use(cors());


server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})