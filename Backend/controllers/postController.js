const post = require('../models/Post');
const fs = require('fs');
const path = require('path');

exports.createPost = async (req, res) => {
    try {
        const { title, description } = req.body;
        
        const newPost = new post({
            title,
            description,
            image: req.file.path,   
            CreatedBy: req.user.id
        });
        await newPost.save();
        res.status(201).json({ message: 'Post created successfully' });
    } catch (error) {
        console.error('Error creating post:', error.message);
        res.status(500).json({ message: error.message });
    }
};
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await post.find()
            .populate('CreatedBy', 'username')
            .populate('likes', 'username')
            .populate('comments.user', 'username');
        res.status(200).json({ posts });
    } catch (error) {
        console.error('Error getting posts:', error.message);
        res.status(500).json({ message: error.message });
    }
};
exports.editPost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;

        const Post = await post.findById(id);
        if (!Post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (Post.CreatedBy.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Unauthorized to edit this post' });
        }

        // Check each field and update or delete it if provided
        if (title !== undefined) {
            if (title === "") {
                Post.title = undefined;
            } else {
                Post.title = title;
            }
        }

        if (description !== undefined) {
            if (description === "") {
                Post.description = undefined;
            } else {
                Post.description = description;
            }
        }

        if (req.file) {
            // If a new image is uploaded, set the new image path
            Post.image = req.file.path;
        }

        await Post.save();
        res.status(200).json({ message: 'Post updated successfully' });
    } catch (error) {
        console.error('Error editing post:', error.message);
        res.status(500).json({ message: error.message });
    }
}

exports.deletepost = async (req, res) => {
    try {
        const { id } = req.params;
        const Post = await post.findById(id);


        if(!Post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        if(Post.CreatedBy.toString() !== req.user.id)
 {
            return res.status(401).json({ message: 'Unauthorized to delete this post' });
       
        }

    const deletePostImage =    await post.findByIdAndDelete(id);

    const imgpath = path.join(__dirname, `../${deletePostImage.image}`);
    fs.unlinkSync(imgpath);
    

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error.message);
        res.status(500).json({ message: error.message });
    }
};

exports.likePost = async (req, res) => {
    try {
        const { postId } = req.body;
        
        const Post = await post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        if (Post.likes.includes(req.user.id)) {
            Post.likes = Post.likes.filter((like) => like !== req.user.id);
        } else {
            Post.likes.push(req.user.id);
        }
        await Post.save();
        res.status(200).json({ likes: post.likes });
    } catch (error) {
        console.error('Error liking post:', error.message);
        res.status(500).json({ message: error.message });
    }
};
exports.addComment = async (req, res) => {
    try {
        const { postId, text } = req.body;
        const Post = await post.findById(postId);
        if (!Post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        
        // Push the new comment
        Post.comments.push({ user: req.user.id, text });
        await Post.save();

        // Populate the user field in comments
        const populatedPost = await post.findById(postId).populate('comments.user', 'username');
        
        res.status(200).json({ comments: populatedPost.comments });
    } catch (error) {
        console.error('Error adding comment:', error.message);
        res.status(500).json({ message: error.message });
    }
};
   