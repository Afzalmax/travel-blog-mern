import React,{useEffect} from 'react'
import {BrowserRouter as Router, Routes, Route, useNavigate} from 'react-router-dom'
import { useStore } from './context/Store';
import Register from './components/Register';
import Login from './components/Login';
import PostFeed from './components/PostFeed';
import Navbar from './components/Navbar';
import Profile from './components/Profile';
import PostForm from './components/PostForm';
import Footer from './components/Footer';

const App = () => {
  const {token} = useStore();
  const navigate = useNavigate();
  useEffect(()=>{ 
    if(!token) navigate('/login');
  },[]);
 
  return (
    <>
    <Navbar/>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/" element={<PostFeed/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/addpost' element={<PostForm/>}/>
      </Routes>
    <Footer/>
    </>
  )
}

export default App
