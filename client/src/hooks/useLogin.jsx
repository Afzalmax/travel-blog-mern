import axios from 'axios';

export const useLogin = () => {

    const login = async (username, password) => {
        try {   
            const response = await axios.post('http://localhost:5000/api/users/login', {
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

