import axios from 'axios';

export const useRegister = () => {

    const register = async (username, password) => {
        try {   
            const response = await axios.post('http://localhost:5000/api/users/register', {
                username,
                password
            });

            return response.data;
        } catch (error) {
            console.log(error);
        }
    }

    return { register };
}

