import React, { useEffect,useState } from 'react'
import {usePost} from '../hooks/usePost';
import { useStore } from '../context/Store';
import axios from 'axios';
const PostFeed = () => {
    const apiUrl = import.meta.env.VITE_API_URL
    const {user,logout} = useStore();
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
      try{
      const response = await axios.post(apiUrl+'/api/post/like', { postId}, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
     fetchPosts();
    }
    catch(error){
      console.log(error);
    }
  };
 
  const handleComment = async (postId, text) => {
      console.log(postId, text);
      const response = await axios.post(apiUrl+'/api/post/comment', { postId, text }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      console.log(response.data);
    
    setPosts(posts.map(post => post._id === postId ? { ...post, comments: response.data.comments } : post))
  };
  return (
    <>
    
            <h2 className='flex justify-center items-center text-3xl font-bold text-gray-900 dark:text-white'>Posts</h2>
           
            
            
            
            <div class="flex justify-center items-center px-4 py-3">
            {posts.length > 0 ? (<>
                <ul>
                    {posts.map(post => (
                        
                        
                        <div class="bg-pink-300 border rounded-sm max-w-md">
                        <div class="bg-grey-300 p-4">
                        
                        <li key={post._id}>
                            <h3 className='text-lg font-semibold antialiased block leading-tight'>{post.CreatedBy.username}</h3>
                            <h3 className='text-md font-semibold antialiased block leading-tight'>Title: {post.title}</h3>
                            
                            
                            <img src={apiUrl+`/${post.image}`} alt={post.title} />
                            
                              <button onClick={() => handleLike(post._id)}>
                                {post.likes.includes(user._id) ? 'Unlike' : 'Like'} {post.likes.length}
                            </button>  
                            <h4 className='mt-3'>Comments</h4>
                            <input
                                    type="text"
                                    placeholder="Add a comment"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && e.target.value.trim() !== '') {
                                            handleComment(post._id, e.target.value.trim());
                                            e.target.value = '';
                                        }
                                    }}
                                className='mt-3 text-md lg:text-md font-semibold text-gray-900 dark:text-white'/>
                            <p className='mt-2 text-md font-semibold antialiased block leading-tight'>{post.CreatedBy.username} <span className=' text-gray-600 mx-5 '>{post.description}</span></p>
                            <button onClick={() => setShowLikes(!showLikes)}>View Likes</button>
                            {showLikes &&  post.likes.map(like => (
                                <li>
                                    <p>{like.username}</p>
                                </li>
                            ))}
                            <div>
                         
                                <button onClick={() => setShowComments(!showComments)}>View Comments</button>
                                <ul>
                                    {showComments &&post.comments.map(comment => (
                                        <li key={comment._id}>
                                            <p>{comment.user.username}-{comment.text}  </p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <p>{new Date(post.date).toLocaleDateString()}</p>
                        </li>
                        </div>
                        </div>
                        
                    ))}
                </ul>
                <button onClick={logout}>Logout</button>
                </>
            ) : (
                <>
                <p>No posts yet</p>
                <button onClick={logout}>Logout</button>
                </>
            )}
            </div>
            
        
    
    </>
  )
}

export default PostFeed
