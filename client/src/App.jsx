import React, { useEffect } from 'react'
import { useStore } from './context/Store'
import Login from './components/Login';
import Register from './components/Register';
import CreatePost from './components/PostForm';
import PostFeed from './components/PostFeed';
import Profile from './components/Profile';

const App = () => {
  const {token,logout,user} = useStore();
  
  return (
    <div>
      {
        token ? (
          <>
          <h1>welcome {user}</h1>
          <Profile/>
         <CreatePost/>
         <PostFeed/>
          <button onClick={logout}>logout</button>
          </>):(
            <>
            <Login/>
            <Register/>

            </>
          )
      }
    </div>
  )
}

export default App
