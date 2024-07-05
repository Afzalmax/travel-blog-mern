import React, { useState } from 'react';

import { useRegister } from '../hooks/useRegister';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useRegister();

  const handleSubmit = async  (e) => {
    e.preventDefault();
   const  response =await register(username, password);
   alert(response.message);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="username">Username</label>
      <input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <label htmlFor="password">Password</label>
      <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Register</button>
    </form>
  );
}

export default Register;
