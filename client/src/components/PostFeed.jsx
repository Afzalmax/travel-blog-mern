import React, { useEffect,useState } from 'react'
import {usePost} from '../hooks/usePost';
import { useStore } from '../context/Store';
import axios from 'axios';
const PostFeed = () => {
    const {user} = useStore();
    const [posts, setPosts] = useState([]);
    const [showLikes, setShowLikes] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const {getPosts} = usePost();
    const fetchPosts = async () => {
        const fetchedPosts = await getPosts();
        console.log(fetchedPosts.posts);
        setPosts(fetchedPosts.posts);
    };
    useEffect(() => {
       console.log(user)
        fetchPosts();
    }, []);
    const handleLike = async (postId) => {
      
      const response = await axios.post('http://localhost:5000/api/post/like', { postId}, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const updatedPosts = posts.map(post => post._id === postId ? { ...post, likes: response.data.likes } : post);
      setPosts(updatedPosts);
  };
 
  const handleComment = async (postId, text) => {
      console.log(postId, text);
      const response = await axios.post('http://localhost:5000/api/post/comment', { postId, text }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      console.log(response.data);
    
    setPosts(posts.map(post => post._id === postId ? { ...post, comments: response.data.comments } : post))
  };
  return (
    <div>
      <div>
            <h2>Posts</h2>
            {posts.length > 0 ? (
                <ul>
                    {posts.map(post => (
                        <li key={post._id}>
                            <h3>{post.title}</h3>
                            <p>{post.description}</p>
                            <p>{post.CreatedBy.username}</p>
                            <p>{new Date(post.date).toLocaleDateString()}</p>
                            <img src={`http://localhost:5000/${post.image}`} alt={post.title} />
                              <button onClick={() => handleLike(post._id)}>
                                {post.likes.includes(user._id) ? 'Unlike' : 'Like'} {post.likes.length}
                            </button>  
                            <button onClick={() => setShowLikes(!showLikes)}>View Likes</button>
                            {showLikes &&  post.likes.map(like => (
                                <li>
                                    <p>{like.username}</p>
                                </li>
                            ))}
                            <div>
                                <h4>Comments</h4>
                                
                                <input
                                    type="text"
                                    placeholder="Add a comment"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && e.target.value.trim() !== '') {
                                            handleComment(post._id, e.target.value.trim());
                                            e.target.value = '';
                                        }
                                    }}
                                />
                                <button onClick={() => setShowComments(!showComments)}>View Comments</button>
                                <ul>
                                    {showComments &&post.comments.map(comment => (
                                        <li key={comment._id}>
                                            <p>{comment.text} - {comment.user.username}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No posts available</p>
            )}
        </div>
    </div>
  )
}

export default PostFeed
