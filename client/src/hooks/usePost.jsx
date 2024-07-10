import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL
export const usePost = () => {
    const post = async (title, description, image) => {
        try {
            // Create form data to handle image upload
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('image', image); // Ensure image is a file object

            const response = await axios.post(apiUrl+'/api/post/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            console.log(error);
        }
    };

    const getPosts = async () => {
        try {
            const response = await axios.get(apiUrl+'/api/post/getallpost', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            console.log(error);
        }
    };

    const deletePost = async (postId) => {
        try {
            const response = await axios.delete(apiUrl+`/api/post/delete/${postId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }
    return { post, getPosts ,deletePost};
};
