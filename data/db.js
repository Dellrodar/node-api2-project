const knex = require('knex');
const knexConfig = require('../knexfile.js');
const db = knex(knexConfig.development);

module.exports = {
  find,
  findById,
  insert,
  update,
  remove,
  findPostComments,
  findCommentById,
  insertComment,
  parseId
};

function find() {
  return db('posts');
}

function findById(id) {
  return db('posts').where({ id: Number(id) });
}

function insert(post) {
  return db('posts')
    .insert(post, 'id')
    .then(ids => ({ id: ids[0] }));
}

async function update(id, post) {
  await db('posts')
    .where('id', Number(id))
    .update(post);
    return findById(id);
}

function remove(id) {
  return db('posts')
    .where('id', Number(id))
    .del();
}

function findPostComments(postId) {
  return db('comments')
    .join('posts', 'posts.id', 'post_id')
    .select('comments.*', 'title as post')
    .where('post_id', postId);
}

function findCommentById(id) {
  return db('comments')
    .join('posts', 'posts.id', 'post_id')
    .select('comments.*', 'title as post')
    .where('comments.id', id);
}

function insertComment(comment) {
  return db('comments')
    .insert(comment)
    .then(ids => ({ id: ids[0] }));
}
function parseId (id, res) {
  const parsedId = parseInt(id, 10);
  if (isNaN(parsedId)) {
    return res.status(500).json({ error: 'Invalid ID passed' });
  }
  return parsedId;
};