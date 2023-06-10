import React, { useEffect, useState, useContext, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { IoMdSend } from 'react-icons/io';
import { BiArrowBack } from 'react-icons/bi';
import { userContext } from '../App';
import io from 'socket.io-client';

const ChatBox = () => {
    const { state } = useContext(userContext);
    const [following, setFollowing] = useState();
    const { id } = useParams();
    let navigate = useNavigate();
    const [userDet, setUserDet] = useState('');
    const chatroomNameRef = useRef();

    const socket = io('http://localhost:5000', {
        query: {
            'token' : localStorage.getItem('token')
        }
    })

    const createChatroom = () => {
        if(userDet) {
        const chatroomName = userDet.name;
    
        axios
          .post("http://localhost:5000/chatroom/chat", {
            name: chatroomName,
          }, {
            headers: {
              'auth-token': JSON.parse(localStorage.getItem("token")),
            },
          })
          .then((response) => {
          })
          .catch((err) => {
            console.log(err)
            
          })
        }
      };

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login');
        }
        if (id) {
            fetch(`http://localhost:5000/api/user/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(res => res.json())
                .then(data => {
                    setUserDet(data.user);
                })
        }

        // else {
        //     setUserDet(user);
        // }
    }, [id])

    useEffect(() => {
        if (state) {
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
    }, [state])

    return (
        <div className='chat-box flex h-[91.5vh] items-center'>
            <div className='following-users flex flex-col w-[30%] bg-slate-100 px-2 py-1 rounded-md smm:w-full h-full smm:hidden'>
                {
                    following ?
                        following.map((user) => (
                            <Link key={user._id} to={`/message/${user._id}`}>
                                <div key={user._id} className={`user-det flex justify-between w-full items-center border-b-2 border-gray-200 p-2 cursor-pointer hover:bg-slate-200 ${id === user._id ? 'bg-slate-300' : 'bg-transparent'}`}>
                                    <img className='h-10 w-10 rounded-full' src={user.image} alt='profile' />
                                    <h2>{user.name}</h2>
                                </div>
                            </Link>
                        )) :
                        <h3 className='text-black italic text-2xl top-36 text-center'>loading...</h3>
                }
            </div>
            <div className='box flex bg-slate-200 h-full w-[70%] smm:w-full'>
                {
                    id ?
                        <div className='flex flex-col w-full'>
                            <Link to={`/user/${userDet._id}`}>
                                <div key={userDet._id} className='user-det rounded-sm w-full smm:w-full flex items-center justify-between p-2 cursor-pointer bg-slate-50 hover:bg-slate-100'>
                                    <div className='images flex items-center space-x-2'>
                                        <Link to = '/chat'><BiArrowBack className='mdmsb:hidden font-bold' /></Link>
                                        <img className='h-10 w-10 rounded-full' src={userDet.image} alt='profile' />
                                    </div>

                                    <h2>{userDet.name}</h2>
                                </div>
                            </Link>
                            <div className='messages w-full p-2 flex flex-col justify-between h-[90%] smm:h-[82%]'>
                                <div className='chats w-full h-[90%] overflow-y-scroll'>
                                    <div className='user-receive flex flex-col justify-start'>
                                        <div className='message-by-user bg-slate-300 w-fit p-2 rounded-lg'>
                                            <p className='text-lg smm:text-sm'>See you</p>
                                            <h6 className='text-xs text-gray-400'>{new Date().toLocaleDateString() + ""}</h6>
                                        </div>

                                    </div>
                                    <div className='user-sent flex justify-end'>
                                        <div className='message-by-user bg-slate-100 w-fit p-2 rounded-lg'>
                                            <p className='text-lg smm:text-sm'>Good Morning</p>
                                            <h6 className='text-xs text-gray-400'>{new Date().toLocaleDateString() + ""}</h6>
                                        </div>
                                    </div>
                                    <div className='user-receive flex flex-col justify-start'>
                                        <div className='message-by-user bg-slate-300 w-fit p-2 rounded-lg'>
                                            <p className='text-lg smm:text-sm'>See you</p>
                                            <h6 className='text-xs text-gray-400'>{new Date().toLocaleDateString() + ""}</h6>
                                        </div>

                                    </div>
                                    <div className='user-sent flex justify-end'>
                                        <div className='message-by-user bg-slate-100 w-fit p-2 rounded-lg'>
                                            <p className='text-lg smm:text-sm'>Good Morning</p>
                                            <h6 className='text-xs text-gray-400'>{new Date().toLocaleDateString() + ""}</h6>
                                        </div>
                                    </div>
                                    <div className='user-receive flex flex-col justify-start'>
                                        <div className='message-by-user bg-slate-300 w-fit p-2 rounded-lg'>
                                            <p className='text-lg smm:text-sm'>See you</p>
                                            <h6 className='text-xs text-gray-400'>{new Date().toLocaleDateString() + ""}</h6>
                                        </div>

                                    </div>
                                    <div className='user-sent flex justify-end'>
                                        <div className='message-by-user bg-slate-100 w-fit p-2 rounded-lg'>
                                            <p className='text-lg smm:text-sm'>Good Morning</p>
                                            <h6 className='text-xs text-gray-400'>{new Date().toLocaleDateString() + ""}</h6>
                                        </div>
                                    </div>
                                    <div className='user-receive flex flex-col justify-start'>
                                        <div className='message-by-user bg-slate-300 w-fit p-2 rounded-lg'>
                                            <p className='text-lg smm:text-sm'>See you</p>
                                            <h6 className='text-xs text-gray-400'>{new Date().toLocaleDateString() + ""}</h6>
                                        </div>

                                    </div>
                                    <div className='user-sent flex justify-end'>
                                        <div className='message-by-user bg-slate-100 w-fit p-2 rounded-lg'>
                                            <p className='text-lg smm:text-sm'>Good Morning</p>
                                            <h6 className='text-xs text-gray-400'>{new Date().toLocaleDateString() + ""}</h6>
                                        </div>
                                    </div>
                                    <div className='user-receive flex flex-col justify-start'>
                                        <div className='message-by-user bg-slate-300 w-fit p-2 rounded-lg'>
                                            <p className='text-lg smm:text-sm'>See you</p>
                                            <h6 className='text-xs text-gray-400'>{new Date().toLocaleDateString() + ""}</h6>
                                        </div>

                                    </div>
                                    <div className='user-sent flex justify-end'>
                                        <div className='message-by-user bg-slate-100 w-fit p-2 rounded-lg'>
                                            <p className='text-lg smm:text-sm'>Good Morning</p>
                                            <h6 className='text-xs text-gray-400'>{new Date().toLocaleDateString() + ""}</h6>
                                        </div>
                                    </div>
                                </div>
                                <div className='submit flex items-center gap-2 w-full h-[6%]'>
                                    <input className=' w-[94%] smm:w-[88%] outline-none border-2 border-gray-500 px-2 py-1 rounded-full italic' type='text' name='chat' placeholder='enter your message here' />
                                    <IoMdSend className='w-[4%] smm:w-[10%] text-xl cursor-pointer' />
                                </div>
                            </div>
                        </div>
                        :
                        <div className='flex justify-center items-center w-full'>
                            <h2 className='text-xl italic text-gray-500'>Start something fun with your friends</h2>
                        </div>
                }

            </div>
        </div>
    )
}

export default ChatBox