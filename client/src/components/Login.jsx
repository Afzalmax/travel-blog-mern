import React, { useState } from 'react';
import { useLogin } from '../hooks/useLogin';
import { useStore } from '../context/Store';
import {Link ,useNavigate} from 'react-router-dom'
import img1 from '../assets/iceland.jpeg'
function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useLogin();
  const navigate = useNavigate();
  const { setToken, setUser, user } = useStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await login(username, password);
    if (response) {
      setToken(response.token);
      setUser(response.user);
      navigate('/');
    }
  };

  return (
    <>
      
      <div className='flex flex-col gap-[29px] mt-[30px]'>
        {user && (
          <div>
            <h2>Welcome, {user.username}</h2>
            <p>User ID: {user._id}</p>
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit}>
      <div className="flex items-center justify-center h-screen w-full px-5 sm:px-0">
      <div className="flex bg-white rounded-lg shadow-lg border overflow-hidden max-w-sm lg:max-w-4xl w-full">
        <div
          className="hidden md:block lg:w-1/2 bg-cover bg-blue-700"
          style={{
            backgroundImage: `url(${img1})`,
          }}
        ></div>
        <div className="w-full p-8 lg:w-1/2">
          <p className="text-xl text-gray-600 text-center">Welcome back!</p>
          <div className="mt-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Username
            </label>
            <input
              className="text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mt-4 flex flex-col justify-between">
            <div className="flex justify-between">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>
            </div>
            <input
              className="text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <a
              href="#"
              className="text-xs text-gray-500 hover:text-gray-900 text-end w-full mt-2"
            >
              Forget Password?
            </a>
          </div>
          <div className="mt-8">
            <button className="bg-blue-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-blue-600">
              Login
            </button>
          </div>
          <div className="mt-4 flex items-center w-full text-center">
            
            <Link
              to="/register"
              className="text-xs text-gray-500 capitalize text-center w-full"
            >
              Don&apos;t have any account yet?
              <span className="text-blue-700"> Sign Up</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
      </form>
    </>
  );
}

export default Login;
