import React, { useState } from 'react';
import { usePost } from '../hooks/usePost'; // Adjust the import path
import {Link} from 'react-router-dom'
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
        <section class="bg-white dark:bg-gray-900">
  <div class="py-8 px-4 mx-auto max-w-2xl lg:py-16">
    <div className='flex justify-center items-center'>
      <h2 class="mb-4 text-3xl font-bold text-gray-900 dark:text-white">Add a new post</h2>
      </div>
        <form onSubmit={handleSubmit}>
        <div class="sm:col-span-2">
                  <label for="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Post Title</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Type product name" required=""/>
              </div>
            <div class="sm:col-span-2">
                  <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="8" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Your description here"></textarea>
              </div>
              <div class="sm:col-span-2">
              <label for="Post" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Image to Post</label>
            <input className='class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                type="file" 
                onChange={(e) => setImage(e.target.files[0])} 
                required 
            /></div>
            
            <div className='flex justify-center items-center '>
            <button className='mt-8 mx-3 flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' type="submit" >Create Post</button>
            <Link to='/'>
            <button className='mt-8 flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>Cancel</button>
            </Link>
            </div>       
        </form>
        </div>
        </section>
    );
};

export default CreatePost;
