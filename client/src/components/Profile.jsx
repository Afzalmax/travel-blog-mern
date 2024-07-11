import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { usePost } from '../hooks/usePost';
import toast, { Toaster } from 'react-hot-toast';
import Modal from 'react-modal';
import { useStore } from '../context/Store';
import { FaHeart } from "react-icons/fa";


const UserProfile = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const { deletePost } = usePost();
    const { user } = useStore();
    const [showLikes, setShowLikes] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPost, setCurrentPost] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editImage, setEditImage] = useState(null);
    const {getPosts} = usePost();

    const fetchProfile = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/users/profile', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setProfile(response.data.profile);
            setPosts(response.data.posts);
        } catch (err) {
            setError(err.response ? err.response.data.message : 'An error occurred');
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await deletePost(id);
            toast.success(response.message);
            setPosts(posts.filter(post => post._id !== id));
        } catch (error) {
            console.log(error);
            toast.error('Failed to delete post');
        }
    };

    const openEditModal = (post) => {
        setCurrentPost(post);
        setEditTitle(post.title);
        setEditDescription(post.description);
        setIsModalOpen(true);
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', editTitle);
        formData.append('description', editDescription);
        if (editImage) {
            formData.append('image', editImage);
        }

        try {
            const response = await axios.put(`http://localhost:5000/api/post/editpost/${currentPost._id}`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success(response.data.message);
            fetchProfile();
            setIsModalOpen(false);
            setPosts(posts.map(post => (post._id === currentPost._id ? { ...post, ...response.data.post } : post)));
        } catch (err) {
            console.log(err);
            toast.error(err.response ? err.response.data.message : 'An error occurred');
        }
    };

    const handleFileChange = (e) => {
        setEditImage(e.target.files[0]);
    };
    const fetchPosts = async () => {
        const fetchedPosts = await getPosts();
        console.log(fetchedPosts.posts);
        setPosts(fetchedPosts.posts);
    };
    useEffect(() => {
     
         fetchProfile();
        
       
       }, []);

    if (!profile) {
        return <div>Loading...</div>;
    }

   
    
    const handleLike = async (postId) => {
      try{
      const response = await axios.post(apiUrl+'/api/post/like', { postId}, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
     fetchProfile();
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
        <div>
            <h1 className='flex justify-center items-center text-2xl font-bold text-gray-900 dark:text-white'><span></span>{profile.username}'s Profile</h1>
            <h2 className='mt-2 flex justify-center items-center text-xl'><span></span>Email: {profile.email}</h2>
            <p className='flex justify-center items-center'><span></span>Joined: {new Date(profile.createdAt).toLocaleDateString()}</p>
            <h2 className='mt-3 flex justify-center items-center text-3xl font-bold text-gray-900 dark:text-white'>Posts</h2>
            <div className="flex justify-center items-center px-4 py-3">
            
                {posts.length > 0 ? (
                    <ul>
                        {posts.map(post => (
                            <div key={post._id} className="mt-5 bg-pink-300 border rounded-sm max-w-md">
                                <div className="bg-grey-300 p-4">
                                    <h3 className='text-lg font-semibold antialiased block leading-tight'>{post.CreatedBy.username}</h3>
                                    <h3 className='text-md font-semibold antialiased block leading-tight'>Title: {post.title}</h3>
                                    <img src={apiUrl + `/${post.image}`} alt={post.title} />
                                    <button onClick={() => handleLike(post._id)}>
                                        {post.likes.includes(user._id) ? <FaHeart className='text-red-500'/>:<FaHeart className='text-white'/> } {post.likes.length}
                                    </button>
                                    <p> {post.comments.length}</p>
                                    <input
                                        type="text"
                                        placeholder="Add a comment"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && e.target.value.trim() !== '') {
                                                handleComment(post._id, e.target.value.trim());
                                                e.target.value = '';
                                            }
                                        }}
                                        className='mt-3 text-md lg:text-md font-semibold text-gray-900 dark:text-white'
                                    />
                                    <p className='mt-2 text-md font-semibold antialiased block leading-tight'>{post.CreatedBy.username} <span className='text-gray-600 mx-5'>{post.description}</span></p>
                                    <button onClick={() => setShowLikes(!showLikes)}>View Likes</button>
                                    {showLikes && post.likes.map(like => (
                                        <li key={like._id}>
                                            <p>{like.username}</p>
                                        </li>
                                    ))}
                                    <div>
                                        <button onClick={() => setShowComments(!showComments)}>View Comments</button>
                                        {showComments && post.comments.map(comment => (
                                            <li key={comment._id}>
                                                <p>{comment.user.username} - {comment.text}</p>
                                            </li>
                                        ))}
                                    </div>
                                    <p>{new Date(post.date).toLocaleDateString()}</p>
                                    <button type='button' onClick={() => handleDelete(post._id)}>Delete</button>
                                    <button type='button' onClick={() => openEditModal(post)}>Edit</button>
                                </div>
                            </div>
                        ))}
                    </ul>
                ) : (
                    <p>No posts found.</p>
                )}

                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={() => setIsModalOpen(false)}
                    contentLabel="Edit Post"
                    ariaHideApp={false}
                >
                    <h2>Edit Post</h2>
                    <div className="flex justify-center items-center px-4 py-3">
                        <form onSubmit={handleEdit}>
                            <div>
                                <label>Title</label>
                                <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                />
                            </div>
                            <div>
                                <label>Description</label>
                                <textarea
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                ></textarea>
                            </div>
                            <div>
                                <label>Image</label>
                                <input type="file" onChange={handleFileChange} />
                            </div>
                            <button type="submit">Save</button><br></br>
                            <button type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
                        </form>
                    </div>
                </Modal>

                <Toaster position="top-center" reverseOrder={false} />
            </div>
        </div>
    );
};

export default UserProfile;
