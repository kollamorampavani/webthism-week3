const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/', postController.getAllPosts);
router.post('/', authenticate, postController.createPost);
router.get('/:id', postController.getPostById);
router.put('/:id', authenticate, postController.updatePost);
router.delete('/:id', authenticate, postController.deletePost);
router.post('/:id/comments', authenticate, postController.addComment);

module.exports = router;
