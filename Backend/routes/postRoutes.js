const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/Authmiddleware');
const upload = require('../middleware/multerConfig');  // Assuming the multer setup is in a file named multerConfig.js

router.post('/create', authMiddleware, upload.single('image'), postController.createPost);
router.get('/getallpost',authMiddleware,postController.getAllPosts);
router.delete('/delete/:id',authMiddleware,postController.deletepost);
router.post('/like',authMiddleware, postController.likePost);
router.post('/comment',authMiddleware, postController.addComment);
module.exports = router;