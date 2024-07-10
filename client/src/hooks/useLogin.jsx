import axios from 'axios';

export const useLogin = () => {
    const apiUrl = import.meta.env.VITE_API_URL
    const login = async (username, password) => {
        try {   
            const response = await axios.post(apiUrl+'/api/users/login', {
                username,
                password
            });
        
            console.log(response.data);
            return response.data;
            
        } catch (error) {
            console.log(error);
        }
    }

    return { login };
}

