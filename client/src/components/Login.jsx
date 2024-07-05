import React, { useState } from 'react';
import { useLogin } from '../hooks/useLogin';
import { useStore } from '../context/Store';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useLogin();
  const {setToken,setUser} = useStore();

  const handleSubmit = async(e) => {
    e.preventDefault();
   const response =await login(username, password);
   console.log(response.user);
   setToken(response.token);
    setUser(response.user);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="username">Username</label>
      <input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <label htmlFor="password">Password</label>
      <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
