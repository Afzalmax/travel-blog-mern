import axios from 'axios';

export const useRegister = () => {
    const apiUrl = import.meta.env.VITE_API_URL
    const register = async (username,email,password) => {
        try {   
            const response = await axios.post(apiUrl+'/api/users/register', {
                username,
                email,
                password
            });

            return response.data;
        } catch (error) {
            console.log(error);
        }
    }

    return { register };
}

