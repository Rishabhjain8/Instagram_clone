import React, { useContext, useEffect, useState } from 'react';
import { userContext } from '../App';
import { useNavigate, Link } from 'react-router-dom';
import ChatBox from './ChatBox';

const Chat = () => {
  let navigate = useNavigate();
  const { state } = useContext(userContext);
  const [following, setFollowing] = useState([]);
  const [user, setUser] = useState('');
  // const [width, setWidth] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate("/login");
    }
    else if (state) {
      fetch(`http://localhost:5000/api/allfollow/${state._id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': JSON.parse(localStorage.getItem('token'))
        }
      })
        .then(res => res.json())
        .then(data => {
          setFollowing(data.following);
          // dispatch({type: 'FOLLOWINGDATA', payload: data.following});
        })
    }
    // else if(window.innerWidth <= '678px'){
    //   setWidth(true);
    // }
  }, [state])

  return (
    <div className='user-following flex h-[100vh] items-center'>
      <div className='following-users flex flex-col w-[30%] bg-slate-100 px-2 py-1 rounded-md smm:w-full h-full'>
        {
          following ? following.map((user) => (
            <Link key={user._id} to={`/message/${user._id}`}>
              <div key={user._id} className='user-det flex justify-between items-center border-b-2 border-gray-200 p-2 cursor-pointer hover:bg-slate-200' onClick={() => setUser(user)}>

                <img className='h-10 w-10 rounded-full' src={user.image} alt='profile' />
                <h2>{user.name}</h2>

              </div>
            </Link>
            // width ? 
            // <Link key={user._id} to = {`/message/${user._id}`}>
            // <div className='user-det flex justify-between items-center border-b-2 border-gray-200 p-2 cursor-pointer hover:bg-slate-200'>
            //   <img className='h-10 w-10 rounded-full' src={user.image} alt='profile' />
            //   <h2>{user.name}</h2>
            // </div>
            // </Link>
            // :
            // <div key = {user._id} className='user-det flex justify-between items-center border-b-2 border-gray-200 p-2 cursor-pointer hover:bg-slate-200' onClick={() =>setUser(user)}>
            //   <img className='h-10 w-10 rounded-full' src={user.image} alt='profile' />
            //   <h2>{user.name}</h2>
            // </div>
          )) :
            <h3>loading...</h3>
        }
      </div>
      <div className='chat-box w-[70%] smm:hidden h-full'>
        {
          <div className='flex justify-center items-center w-full bg-slate-200 h-full'>
            <h2 className='text-xl italic text-gray-500'>Start something fun with your friends</h2>
          </div>
        }
      </div>

    </div>
  )
}

export default Chat