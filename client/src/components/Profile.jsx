import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { usePost } from '../hooks/usePost';
import toast, { Toaster } from 'react-hot-toast';
import Modal from 'react-modal';
import { useStore } from '../context/Store';
import { IoIosHeartEmpty } from "react-icons/io";
import { FaHeart } from "react-icons/fa";
import { LiaCommentSolid } from "react-icons/lia";
import { CgProfile } from "react-icons/cg";
import { MdEmail } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";

const UserProfile = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const { deletePost } = usePost();
    const { user } = useStore();
    const [showLikes, setShowLikes] = useState({});
    const [showComments, setShowComments] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPost, setCurrentPost] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editImage, setEditImage] = useState(null);
    const { getPosts } = usePost();
    const [isloading, setIsloading] = useState(true);
    const [showInput, setShowInput] = useState({});

    const handleButtonClick = (postId) => {
        setShowInput(prev => ({ ...prev, [postId]: !prev[postId] }));
    };

    const fetchProfile = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/users/profile`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setProfile(response.data.profile);
            setPosts(response.data.posts);
            setIsloading(false);
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

    const handleLike = async (postId) => {
        try {
            const response = await axios.post(`${apiUrl}/api/post/like`, { postId }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            fetchProfile();
        } catch (error) {
            console.log(error);
        }
    };

    const handleComment = async (postId, text) => {
        console.log(postId, text);
        try {
            const response = await axios.post(`${apiUrl}/api/post/comment`, { postId, text }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setPosts(posts.map(post => post._id === postId ? { ...post, comments: response.data.comments } : post));
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            {
                isloading ? (
                    <>
                        <h1 className='flex justify-center items-center text-2xl font-bold text-gray-900 dark:text-white'>Loading...</h1>
                    </>
                )
                    : (
                        <div>
                            <h1 className='flex justify-center items-center text-2xl font-bold text-gray-900 dark:text-white'>About</h1>
                            <br />
                            <h2 className='flex justify-center items-center text-xl'><FaUserCircle className='text-xl' />{profile.username}</h2>
                            <h2 className='mt-2 flex justify-center items-center text-xl'><MdEmail className='text-xl' />{profile.email}</h2>
                            <p className='flex justify-center items-center'>Joined: {new Date(profile.createdAt).toLocaleDateString()}</p>
                            <h2 className='mt-3 flex justify-center items-center text-3xl font-bold text-gray-900 dark:text-white'>Posts</h2>
                            <div className="flex justify-center items-center px-4 py-3">
                                {posts.length > 0 ? (
                                    <ul>
                                        {posts.map(post => (
                                            <div key={post._id} className="mt-4 bg-white border-black border-2 rounded-md max-w-md">
                                                <div className="bg-grey-300 p-4">
                                                    <li>
                                                        <h3 className='text-lg font-semibold antialiased block leading-tight flex items-center space-x-2'><CgProfile /> <span>{profile.username}</span></h3>
                                                        <h3 className='text-md font-semibold antialiased block leading-tight'>{post.title}</h3>
                                                        <img src={`${apiUrl}/${post.image}`} alt={post.title} />
                                                        <p className='text-md font-semibold antialiased block leading-tight'>{profile.username} <span className='text-gray-600 mx-5'>{post.description}</span></p>
                                                        <div className='mt-2' />
                                                        <div className='flex space-x-2'>
                                                            <button onClick={() => handleLike(post._id)}>
                                                                {post.likes.some(like => like._id === user._id) ? <FaHeart className='text-xl text-red-500' /> : <IoIosHeartEmpty className='text-xl text-white-500' />} {post.likes.length}
                                                            </button>
                                                            <button onClick={() => handleButtonClick(post._id)}>
                                                                <LiaCommentSolid className='text-xl mb-7' />
                                                            </button>
                                                            {showInput[post._id] && (
                                                                <input
                                                                    type="text"
                                                                    placeholder="Add a comment"
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === 'Enter' && e.target.value.trim() !== '') {
                                                                            handleComment(post._id, e.target.value.trim());
                                                                            e.target.value = '';
                                                                            setShowInput(prev => ({ ...prev, [post._id]: false }));
                                                                        }
                                                                    }}
                                                                    className='mt-3 text-md lg:text-md font-semibold text-gray-900 dark:text-white'
                                                                />
                                                            )}
                                                        </div>
                                                        <div className='flex space-x-2'>
                                                            <div className="relative inline-block">
                                                                <button className='border-grey border-2 rounded-md px-2 py-1' onClick={() => setShowLikes(prev => ({ ...prev, [post._id]: !prev[post._id] }))}>View Likes</button>
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
                                                        <div className='flex space-x-2'>
                                                            <button type='button' className='border-grey border-2 rounded-md px-2 py-1' onClick={() => handleDelete(post._id)}>Delete</button>
                                                            <button type='button' className='border-grey border-2 rounded-md px-2 py-1' onClick={() => openEditModal(post)}>Edit</button>
                                                        </div>
                                                        <div className='flex justify-end'>
                                                            <p className='text-sm'>{new Date(post.date).toLocaleDateString()}</p>
                                                        </div>
                                                    </li>
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
                                    <div className="flex justify-center items-center px-4 py-3">
                                        <form onSubmit={handleEdit}>
                                            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Edit Post</h2>
                                            <div className="sm:col-span-2">
                                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Title</label>
                                                <input
                                                    type="text"
                                                    value={editTitle}
                                                    onChange={(e) => setEditTitle(e.target.value)}
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                />
                                            </div>
                                            <div>
                                                <label>Description</label>
                                                <textarea
                                                    value={editDescription}
                                                    onChange={(e) => setEditDescription(e.target.value)}
                                                    className='block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                                                ></textarea>
                                            </div>
                                            <div className="sm:col-span-2">
                                                <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>Image</label>
                                                <input type="file" onChange={handleFileChange} className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500' />
                                            </div>
                                            <div className='flex space-x-2'>
                                                <button type="submit" className='mt-8 mx-3 flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>Save</button>
                                                <button type="button" className='mt-8 flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={() => setIsModalOpen(false)}>Cancel</button>
                                            </div>
                                        </form>
                                    </div>
                                </Modal>

                                <Toaster position="top-center" reverseOrder={false} />
                            </div>
                        </div>
                    )
            }
        </>
    );
};

export default UserProfile;
