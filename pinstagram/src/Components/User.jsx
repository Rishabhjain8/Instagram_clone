import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { userContext } from '../App';
import { AiOutlineCloseCircle } from 'react-icons/ai';

const Profile = () => {
    const { state, dispatch } = useContext(userContext);
    const { id } = useParams();
    // const [follow, setFollow] = useState(state ? !state.following.includes(id) : true);
    const [follow, setFollow] = useState();
    const [userPost, setUserPost] = useState([]);
    const [user, setUser] = useState('');
    const navigate = useNavigate();
    const [followersData, setFollowersData] = useState([]);
    const [followingData, setFollowingData] = useState([]);
    const [followers, setFollowers] = useState(false);
    const [following, setFollowing] = useState(false);

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login');
        }

        if (state) {
            if (state._id === id) {
                navigate('/profile');
            }
        }
    }, [state])



    // useEffect(() => {
    //     if(state) {
    //         if(state.following.includes(id)){
    //             setFollow(false);
    //         }
    //         else{
    //             setFollow(true);
    //         }
    //     }
    // }, [follow])

    useEffect(() => {
        const fetchDetails = () => {
            fetch(`http://localhost:5000/api/user/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json())
                .then(data => {
                    setUser(data.user);
                    if (state) {
                        if (data.user.followers.includes(state._id)) {
                            setFollow(false);
                        }
                        else {
                            setFollow(true)
                        }
                    }
                    setUserPost(data.allPosts);
                })

            // const data = await response.json();

        }

        fetchDetails();
    }, [id])

    // const handleFollow = async () => {
    const handleFollow = (id) => {
        // const response = await 
        fetch('http://localhost:5000/api/follow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': JSON.parse(localStorage.getItem('token'))
            },
            body: JSON.stringify({ userId: id })
        }).then(res => res.json())
            .then(data => {
                console.log(data)
                dispatch({ type: "UPDATE", payload: { following: data.user.following, followers: data.user.followers } })
                localStorage.setItem("user", JSON.stringify(data.user));
                //  setUser(data.newUser)
                setUser((prevState) => {
                    return {
                        ...prevState,
                        followers: [...prevState.followers, data.user._id]
                    }
                })
                setFollow(false)
            })

        // const data = await response.json();
        // console.log(data)
        // setFollow(false);
        // dispatch({ type: 'UPDATE', payload: { following: data.following, followers: data.followers } })
        // localStorage.setItem('user', JSON.stringify(data.user));
        // setUser(data.newUser);

        // setUser((...prevState) => {
        //     return {
        //         ...prevState,
        //         user: {
        //             ...prevState.user,
        //             followers: [...prevState.user.followers, data._id]
        //         }
        //     }
        // })
    }

    // const handleUnfollow = async () => {
    const handleUnfollow = (id) => {
        // const response = await 
        fetch('http://localhost:5000/api/unfollow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': JSON.parse(localStorage.getItem('token'))
            },
            body: JSON.stringify({ userId: id })
        })
            .then(res => res.json())
            .then(data => {

                dispatch({ type: "UPDATE", payload: { following: data.user.following, followers: data.user.followers } })
                localStorage.setItem("user", JSON.stringify(data.user))
                //  setUser(data.newUser)
                setUser((prevState) => {
                    const newFollower = prevState.followers.filter(item => item != data.user._id)
                    return {
                        ...prevState,
                        followers: newFollower
                    }
                })
                setFollow(true)
            })

        // const data = await response.json();
        // dispatch({ type: 'UPDATE', payload: { following: data.user.following, followers: data.user.followers } })
        // localStorage.setItem('user', JSON.stringify(data.user));
        // setUser(data.newUser);
        // console.log(data)
        // setFollow(true);
    }

    const showFollowers = async (modal) => {
        fetch(`http://localhost:5000/api/allfollow/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': JSON.parse(localStorage.getItem('token'))
            }
        }).then(response => response.json())
        .then(data => {
            setFollowingData(data.following);
            setFollowersData(data.followers);

            modal === 'following' ? followingData.length > 0 && setFollowing(true) : followersData.length > 0 && setFollowers(true)
        })
        
    }

    return (
        <>
            {
                user ? <><div className={`${followers || following ? 'blur-sm' : ''} profile p-10 flex flex-col justify-center items-center mx-auto smm:p-4`}>
                    <div className='user-details flex items-center justify-start space-x-20 smm:space-x-0 smm:flex-col smm:justify-start'>
                        <div className='smm-header smm:flex smm:justify-start smm:items-center smm:space-x-7'>
                            <div className='image'>
                                <img className='h-40 w-40 rounded-full smm:h-20 smm:w-20' src={user.image} alt='profile pic' />
                            </div>
                            <div className='name flex space-x-10 items-center smm:flex-col smm:space-y-4 smm:justify-center smm:space-x-0 mdmsb:hidden'>
                                <h1 className='text-2xl smm:text-lg'>{user ? user.username : "loading"}</h1>
                                <div className='button space-x-6 vsmm:space-x-0 smmsb:space-x-2 smm:text-sm vsmm:space-y-1'>
                                    {
                                        // !user.followers.includes(state._id)
                                        follow ? <button className='bg-gray-200 rounded-md px-2 py-1 font-semibold' onClick={() => handleFollow(user._id)}>Follow</button> : <button className='bg-gray-200 rounded-md px-2 py-1 font-semibold' onClick={() => handleUnfollow(user._id)}>Unfollow</button>
                                    }
                                    {/* <button className='bg-gray-200 rounded-md px-2 py-1 font-semibold' onClick={() => handleFollow(user._id)}>Follow</button> */}
                                    <button className='bg-gray-200 rounded-md px-2 py-1 font-semibold'>Message</button>
                                </div>
                            </div>
                        </div>
                        <div className='user-info space-y-6 flex flex-col'>
                            <div className='name flex space-x-10 items-center smm:flex-col smm:space-y-4 smm:justify-center smm:space-x-0 smm:hidden'>
                                <h1 className='text-2xl smm:text-lg'>{user ? user.username : "loading"}</h1>
                                <div className='button space-x-6 smm:space-x-4 smm:text-sm'>
                                    {
                                        follow ? <button className='bg-gray-200 rounded-md px-2 py-1 font-semibold' onClick={() => handleFollow(user._id)}>Follow</button> : <button className='bg-gray-200 rounded-md px-2 py-1 font-semibold' onClick={() => handleUnfollow(user._id)}>Unfollow</button>
                                    }
                                    {/* <button className='bg-gray-200 rounded-md px-2 py-1 font-semibold' onClick={() => handleFollow(user._id)}>Follow</button> */}
                                    <button className='bg-gray-200 rounded-md px-2 py-1 font-semibold'>Message</button>
                                </div>
                            </div>
                            <div className='follower-details flex space-x-8 smm:text-sm smm:space-x-4'>
                                <h2><span className='font-semibold'>{userPost ? userPost.length : "loading"}</span> posts</h2>
                                <h2 onClick={() => showFollowers('followers')} className='cursor-pointer'><span className='font-semibold'>{user ? user.followers.length : "loading"}</span> followers</h2>
                                <h2 onClick={() => showFollowers('following')} className='cursor-pointer'><span className='font-semibold'>{user ? user.following.length : "loading"}</span> following</h2>
                            </div>
                            <div className='user-detail text-sm smm:w-full'>
                                <h3 className='font-semibold'>{user ? user.name : "loading"}</h3>
                                <h3 className='text-gray-400'>User</h3>
                                <h3>Pinstagram User💯</h3>
                                <h3>📩{user ? user.email : "loading"}</h3>
                            </div>
                        </div>
                    </div>
                    <div className='break w-[90%] mt-4 border-t-2'>
                    </div>
                    <div className='posts flex flex-wrap w-[90%] justify-center items-center cursor-pointer'>
                        {
                            userPost && userPost.map((post, i) => (
                                <img key={i} className='h-56 w-56 m-4 mdmh:h-32 mdmh:w-32 mdmh:m-2 vsmm:h-24 vsmm:w-24 vsmm:m-1' src={post.image} alt='post' />
                            ))
                        }
                    </div>
                </div>
                {
                    followers && followersData && followersData.length > 0 ?
                        <div className='followersModal bg-gray-100 rounded-md p-3 absolute top-[20%] smm:p-4 left-0 right-0 mx-auto w-[35%] mdm:w-[95%] smm:max-h-96 max-h-56 overflow-y-scroll'>
                            <div className='close flex justify-end cursor-pointer' onClick={() => setFollowers(false)}>
                                <AiOutlineCloseCircle className='text-2xl mdm:text-lg mb-1' />
                            </div>
                            {
                                followersData.map((follower, i) => (
                                    <div className='follower border-b-2 border-gray-200 px-2 py-1 bg-gray-50 rounded-md flex items-center justify-between' key={i}>
                                        <Link to={`/user/${follower._id}`} onClick={() => setFollowers(false)}>
                                            <div className='follower-detail flex space-x-2 items-center'>
                                                <img className='follower-image h-10 w-10 rounded-full' src={follower.image} alt='profile-image' />
                                                <div className='follower-name text-xl smm:text-sm font-semibold'>{follower.name}</div>
                                            </div>
                                        </Link>
                                        {
                                            state.following.includes(follower._id) ?
                                                state._id !== follower._id && <button className='bg-gray-200 rounded-md px-2 py-1 font-semibold smm:text-sm' onClick={() => handleUnfollow(follower._id)}>Unfollow</button> :
                                                state._id !== follower._id && <button className='bg-gray-200 rounded-md px-2 py-1 font-semibold smm:text-sm' onClick={() => handleFollow(follower._id)}>Follow</button>
                                        }
                                    </div>
                                ))
                            }
                        </div> : <></>
                }
                {
                    following && followingData && followingData.length > 0 ?
                        <div className='followingModal bg-gray-100 rounded-md p-3 absolute top-[20%] smm:p-4 left-0 right-0 mx-auto w-[35%] mdm:w-[95%] smm:max-h-96 max-h-56 overflow-y-scroll'>
                            <div className='close flex justify-end cursor-pointer' onClick={() => setFollowing(false)}>
                                <AiOutlineCloseCircle className='text-2xl mdm:text-lg mb-1' />
                            </div>
                            {
                                followingData.map((following, i) => (
                                    <div className='following border-b-2 border-gray-200 px-2 py-1 bg-gray-50 rounded-md flex items-center justify-between' key={i}>
                                        <Link to={`/user/${following._id}`} onClick = {() => setFollowing(false)}>
                                            <div className='following-detail flex space-x-2 items-center'>
                                                <img className='following-image h-10 w-10 rounded-full' src={following.image} alt='profile-image' />
                                                <div className='following-name text-xl smm:text-sm font-semibold'>{following.name}</div>
                                            </div>
                                        </Link>
                                        {
                                            !state.following.includes(following._id) ?
                                            state._id !== following._id && <button className='bg-gray-200 rounded-md px-2 py-1 font-semibold smm:text-sm' onClick={() => handleFollow(following._id)}>Follow</button> :
                                            state._id !== following._id && <button className='bg-gray-200 rounded-md px-2 py-1 font-semibold smm:text-sm' onClick={() => handleUnfollow(following._id)}>Unfollow</button>
                                                
                                        }
                                    </div>
                                ))
                            }
                        </div> : <></>
                }
                </>
                    :
                    <h2 className='text-italic'>loading...</h2>
            }
            
        </>
    )
}

export default Profile