import React, { useEffect,useState } from 'react'
import {usePost} from '../hooks/usePost';
import { useStore } from '../context/Store';
import axios from 'axios';
import { IoIosHeartEmpty } from "react-icons/io";
import { FaHeart } from "react-icons/fa";
import { LiaCommentSolid } from "react-icons/lia";
import { CgProfile } from "react-icons/cg";

const PostFeed = () => {
    const apiUrl = import.meta.env.VITE_API_URL
    const {user,logout} = useStore();
    const [posts, setPosts] = useState([]);
    const [showLikes, setShowLikes] = useState({});
    const [showComments, setShowComments] = useState({});
    const {getPosts} = usePost();
    const [showInput, setShowInput] = useState({});
    const handleButtonClick = () => {
        setShowInput(prev => ({ ...prev, [postId]: !prev[postId] }));
      };
    const fetchPosts = async () => {
        const fetchedPosts = await getPosts();
        console.log(fetchedPosts.posts);
        setPosts(fetchedPosts.posts);
    };
    useEffect(() => {
       console.log(user)
        fetchPosts();
        console.log(posts);
    }, []);
    const handleLike = async (postId) => {
      try{
      const response = await axios.post(apiUrl+'/api/post/like', { postId}, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
    await  fetchPosts();
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
            <h2 className='flex justify-center items-center text-3xl font-bold text-gray-900 dark:text-white'>POSTS</h2>
            <div class="flex justify-center items-center px-4 py-3">
            {posts.length > 0 ? (<>
                <ul>
                    {posts.map(post => (
                        
                        
                        <div class="mt-4 bg-white border-black border-2 rounded-md  max-w-md">
                        <div class="bg-grey-300 p-4">
                        
                        <li key={post._id}>
                            <h3 className='text-lg font-semibold antialiased block leading-tight flex items-center space-x-2'><span><CgProfile /></span><span>{post.CreatedBy.username}</span></h3>
                            <h3 className='text-md font-semibold antialiased block leading-tight'>{post.title}</h3>
                            
                            
                            <img src={apiUrl+`/${post.image}`} alt={post.title} />
                            <p className='text-md font-semibold antialiased block leading-tight'>{post.CreatedBy.username} <span className=' text-gray-600 mx-5 '>{post.description}</span></p>
                            <div className='mt-2'/>
                            <div className='flex space-x-2'>
                              <button  onClick={() => handleLike(post._id)}>
                                {post.likes.some(like => like._id === user._id) ? <FaHeart className='text-xl text-red-500'/>:<IoIosHeartEmpty className='text-xl text-white-500' />  } {post.likes.length}
                            </button>  
                            <button onClick={handleButtonClick}>
                            <LiaCommentSolid className='text-xl mb-7'/>
                    </button>
                    {showInput[post._id] && (
                    <input
                       type="text"
                       placeholder="Add a comment"
                       onKeyDown={(e) => {
                       if (e.key === 'Enter' && e.target.value.trim() !== '') {
                        handleComment(post._id, e.target.value.trim());
                       e.target.value = '';
                        setShowInput(prev => ({ ...prev, [post._id]: false })); // Optionally hide input after comment is added
                       }
                        }}
                        className='mt-3 text-md lg:text-md font-semibold text-gray-900 dark:text-white'
                        />
                       )}
                        </div>
                            <div className='flex space-x-2'>
                            <div className="relative inline-block">
                            <button className='border-grey border-2 rounded-md px-2 py-1'onClick={() => setShowLikes(prev => ({ ...prev, [post._id]: !prev[post._id] }))}>View Likes</button>
                            
                            {showLikes[post._id] && (
  <ul className="absolute left-0 mt-2 bg-white border border-gray-300 rounded-md shadow-lg w-48 py-2 z-10">
    {post.likes.length > 0 ? (
      post.likes.map(like => (
        <li key={like._id} className="px-4 py-1 hover:bg-gray-100">
          <p className="text-sm">{like.username}</p>
        </li>
      ))
    ) : (
      <li className="px-4 py-1 text-center text-sm text-gray-500">No likes yet</li>
    )}
  </ul>
)}
                            </div>
                            
                            <div className="relative inline-block">
                                <button className='border-grey border-2 rounded-md px-2 py-1' onClick={() => setShowComments(prev => ({ ...prev, [post._id]: !prev[post._id] }))}>View Comments</button>
                                
                                {showComments[post._id] && (
  <ul className="absolute left-0 mt-2 bg-white border border-gray-300 rounded-md shadow-lg w-48 py-2 z-10">
    {post.comments.length > 0 ? (
      post.comments.map(comment => (
        <li key={comment._id} className="px-4 py-1 hover:bg-gray-100">
          <p className="text-sm">{comment.user.username}: {comment.text}</p>
        </li>
      ))
    ) : (
      <li className="px-4 py-1 text-center text-sm text-gray-500">No comments yet</li>
    )}
  </ul>
)}
                            </div>
                            </div>
                            <div className='flex justify-end'>
                            <p className='text-sm'>{new Date(post.date).toLocaleDateString()}</p>
                            </div>
                        </li>
                        </div>
                        </div>
                        
                    ))}
                </ul>
                
                
                </>
            ) : (
                <>
                <p>No posts yet</p>
                </>
            )}
            </div>
    </>
  )
}

export default PostFeed
