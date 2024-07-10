import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { usePost } from '../hooks/usePost';
import toast, { Toaster } from 'react-hot-toast';
import Modal from 'react-modal';

const UserProfile = () => {
    const apiUrl = import.meta.env.VITE_API_URL
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const { deletePost } = usePost();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPost, setCurrentPost] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editImage, setEditImage] = useState(null);
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
            // Remove deleted post from the state
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
            console.log('Response:', response.data);

            // Update post in the state
            setPosts(posts.map(post => (post._id === currentPost._id ? { ...post, ...response.data.post } : post)));
        } catch (err) {
            console.log(err);
            toast.error(err.response ? err.response.data.message : 'An error occurred');
        }
    };

    const handleFileChange = (e) => {
        setEditImage(e.target.files[0]);
    };

    useEffect(() => {
      

        fetchProfile();
    }, []);

    if (!profile) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{profile.username}'s Profile</h1>
            <p>Email: {profile.email}</p>
            <p>Joined: {new Date(profile.createdAt).toLocaleDateString()}</p>

            <h2>Posts</h2>
            {posts.length > 0 ? (
                <ul>
                    {posts.map(post => (
                        <li key={post._id}>
                            <h3>{post.title}</h3>
                            <p>{post.description}</p>
                            <p>Posted on: {new Date(post.createdAt).toLocaleDateString()}</p>
                            <img src={apiUrl+'/'+post.image} alt='posts'/>
                            <button type='button' onClick={() => handleDelete(post._id)}>Delete</button>
                            <button type='button' onClick={() => openEditModal(post)}>Edit</button>
                        </li>
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
            </Modal>

            <Toaster position="top-center" reverseOrder={false} />
        </div>
    );
};

export default UserProfile;
