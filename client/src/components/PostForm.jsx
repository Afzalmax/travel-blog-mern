import React, { useState } from 'react';
import { usePost } from '../hooks/usePost'; // Adjust the import path

const CreatePost = () => {
    const { post } = usePost();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (image) {
            const result = await post(title, description, image);
            console.log(result);
        } else {
            console.log("Image is required");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Title" 
                required 
            />
            <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Description" 
                required 
            />
            <input 
                type="file" 
                onChange={(e) => setImage(e.target.files[0])} 
                required 
            />
            <button type="submit">Create Post</button>
        </form>
    );
};

export default CreatePost;
