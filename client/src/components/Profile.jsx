import React,{useState,useEffect} from 'react'
import { useStore } from '../context/Store'
import axios from 'axios';
const Profile = () => {
    const { user } = useStore();
    const [myposts, setMyPosts] = useState([])
    const fetchProfile = async () => {
        const response = await axios.get('http://localhost:5000/api/user/profile', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        setMyPosts(response.data.posts)
    }

    useEffect(() => {
        fetchProfile()
    }, [])
  return (
    <div>
      <p>{user}</p>
      {
        myposts?.map(post => (
          <div key={post._id}>
            <p>{post.title}</p>
            <p>{post.description}</p>
            <img src={`http://localhost:5000/${post.image}`} alt="" />
          </div>
        ))
      }
    </div>
  )
}

export default Profile
