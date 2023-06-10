import React, { useEffect, useState, useContext } from 'react';
import { userContext } from '../App';
import { useNavigate, Link } from 'react-router-dom';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
    const { state, dispatch } = useContext(userContext);
    const [myPost, setMyPost] = useState([]);
    const [edit, setEdit] = useState(false);
    const [userdet, setUserDet] = useState(false); //to check whether user has changes his data or not
    const [followersData, setFollowersData] = useState([]);
    const [followingData, setFollowingData] = useState([]);
    const [followers, setFollowers] = useState(false);
    const [following, setFollowing] = useState(false);
    const [credentials, setCredentials] = useState({ name: "", username: "", email: "" });
    const [image, setImage] = useState('');
    const [url, setUrl] = useState(undefined);
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login');
        }
    }, [])

    useEffect(() => {
        const fetchDetails = async () => {
            const response = await fetch('http://localhost:5000/api/post/mypost', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': JSON.parse(localStorage.getItem('token'))
                }
            })

            const data = await response.json();
            setMyPost(data);
        }

        fetchDetails();
    }, [])

    const handleValidation = () => {
        const { name, email, username } = credentials;

        if (email === '') {
            credentials.email = state.email;
        }
        else if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            toast.error("Please! Enter valid email");
            return false;
        }
        if (name === '') {
            credentials.name = state.name;
        }
        else if (name.length < 3) {
            toast.error('Name should be of atleast 3 in length', options);
            return false;
        }
        if (username === '') {
            credentials.username = state.username;
        }
        else if (username.length < 3) {
            toast.error('Username should be of atleast 3 in length', options);
            return false;
        }


        return true;
    }

    const options = {
        position: "top-right",
        autoClose: 1000,
        pauseOnHover: true,
        draggable: false,
        theme: 'dark'
    };

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }

    const uploadPic = async () => {
        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", "pinstagram");
        data.append("cloud_name", "pinstagramcn");
        const response = await fetch("https://api.cloudinary.com/v1_1/pinstagramcn/image/upload", {
            method: 'POST',
            body: data
        })
        const res = await response.json();
        localStorage.setItem('user', JSON.stringify({ ...state, image: res.secure_url }));
        dispatch({ type: 'UPDATEIMAGE', payload: res.secure_url });
        setUrl(res.secure_url);
    }

    const uploadFields = () => {
        if (handleValidation()) {
            fetch('http://localhost:5000/api/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': JSON.parse(localStorage.getItem('token'))
                },
                body: JSON.stringify({ name: credentials.name ? credentials.name : state.name, username: credentials.username ? credentials.username : state.username, email: credentials.email ? credentials.email : state.email, image: url })
            })
                .then(res => res.json())
                .then(data => {
                    dispatch({ type: 'USER', payload: data });
                    localStorage.setItem('user', JSON.stringify(data));
                    setEdit(false);
                })
        }
    }

    useEffect(() => {
        if (image) uploadFields();
    }, [url])

    const handleSubmit = (e) => {
        e.preventDefault();
        if (image) {
            uploadPic();
        }
        else {
            uploadFields();
        }
    }

    const handleDelete = () => {
        fetch('http://localhost:5000/api/delete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': JSON.parse(localStorage.getItem('token'))
            }
        })
            .then(res => res.json())
            .then(data => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/signup');
            })
    }

    const handleEdit = () => {
        setEdit(true);
    }

    const showFollowers = (modal) => {
        fetch(`http://localhost:5000/api/allfollow/${state._id}`, {
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

                dispatch({ type: "UPDATE", payload: { following: data.user.following, followers: data.user.followers } })
                localStorage.setItem("user", JSON.stringify(data.user))
                //  setUser(data.newUser)
                // setUser((prevState)=>{
                //     return {
                //         ...prevState,
                //             followers:[...prevState.followers,data.user._id]
                //     }
                // })
                //  setFollow(false)
            })
    }

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
                // setUser((prevState)=>{
                //     const newFollower = prevState.followers.filter(item=>item != data.user._id )
                //      return {
                //          ...prevState,
                //         followers:newFollower
                //      }
                //  })
            })
    }

    return (
        <>
            <div className={edit || followers || following ? 'blur-sm profile p-10 flex flex-col justify-center items-center mx-auto smm:p-4 space-y-4' : 'profile p-10 flex flex-col justify-center items-center mx-auto smm:p-4 space-y-4'}>
                <div className='user-details flex items-center justify-start space-x-20 smm:space-x-0 smm:flex-col smm:justify-start'>
                    <div className='smm-header smm:flex smm:justify-start smm:items-center smm:space-x-7'>
                        <div className='image'>
                            <img className='h-40 w-40 rounded-full smm:h-20 smm:w-20' src={state ? state.image : "loading"} alt='profile pic' />
                        </div>
                        <div className='name flex space-x-10 items-center smm:flex-col smm:space-y-4 smm:justify-center smm:space-x-0 mdmsb:hidden'>
                            <h1 className='text-2xl smm:text-lg'>{state ? state.username : "loading"}</h1>
                            <div className='button space-x-6 smm:space-x-2 smm:text-sm'>
                                {/* <button className='bg-gray-200 rounded-md px-2 py-1 font-semibold'>Follow</button>
                            <button className='bg-gray-200 rounded-md px-2 py-1 font-semibold'>Message</button> */}
                            </div>
                        </div>
                    </div>
                    <div className='user-info space-y-6 flex flex-col'>
                        <div className='name flex space-x-10 items-center smm:flex-col smm:space-y-4 smm:justify-center smm:space-x-0 smm:hidden'>
                            <h1 className='text-2xl smm:text-lg'>{state ? state.username : "loading"}</h1>
                            <div className='button space-x-6 smm:space-x-4 smm:text-sm'>
                                {/* <button className='bg-gray-200 rounded-md px-2 py-1 font-semibold'>Follow</button>
                            <button className='bg-gray-200 rounded-md px-2 py-1 font-semibold'>Message</button> */}
                            </div>
                        </div>
                        <div className='follower-details flex space-x-8 smm:text-sm smm:space-x-4'>
                            <h2><span className='font-semibold'>{myPost ? myPost.length : "loading"}</span> posts</h2>
                            <h2 onClick={() => showFollowers('followers')} className='cursor-pointer'><span className='font-semibold'>{state ? state.followers.length : "loading"}</span> followers</h2>
                            <h2 onClick={() => showFollowers('following')} className='cursor-pointer'><span className='font-semibold'>{state ? state.following.length : "loading"}</span> following</h2>
                        </div>
                        <div className='user-detail text-sm smm:w-full'>
                            <h3 className='font-semibold'>{state ? state.name : "loading"}</h3>
                            <h3 className='text-gray-400'>User</h3>
                            <h3>Pinstagram User💯</h3>
                            <h3>📩{state ? state.email : "loading"}</h3>
                        </div>
                    </div>
                </div>
                <div className='edit-profile w-[40%] smm:w-[100%] flex items-center space-x-2 smm:flex-col smm:space-x-0 smm:space-y-2'>
                    <button className='border-2 border-gray-300 text-gray-700 rounded-md px-2 py-1 w-full hover:text-green-500' onClick={handleEdit}>Edit Profile</button>
                    <button className='border-2 border-gray-300 text-gray-700 rounded-md px-2 py-1 w-full hover:text-red-500' onClick={handleDelete}>Delete Profile</button>
                </div>
                <div className='break w-[90%] smm:w-full mt-4 border-t-2'>
                </div>
                <div className='posts flex flex-wrap w-[90%] justify-center items-center cursor-pointer'>
                    {
                        myPost && myPost.map((post, i) => (
                            <img key={i} className='h-56 w-56 m-4 mdmh:h-32 mdmh:w-32 mdmh:m-2 vsmm:h-24 vsmm:w-24 vsmm:m-1' src={post.image} alt='post' />
                        ))
                    }
                </div>
            </div>
            {
                (edit && state) ? <div className='edit-form-modal bg-gray-100 rounded-md p-6 absolute top-[20%] smm:p-4 left-0 right-0 mx-auto w-[55%] mdm:w-[90%]'>
                    <div className='close flex justify-end cursor-pointer' onClick={() => setEdit(false)}>
                        <AiOutlineCloseCircle className='text-2xl mdm:text-lg' />
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className='form flex flex-col justify-center items-center w-full'>
                            <div className='email flex items-center w-full p-2 smm:text-sm smm:flex-col smm:space-y-2 smm:space-x-0'>
                                <label htmlFor='email' className='w-[22%] text-xl smm:text-sm smm:w-full'>Email: </label>
                                <input className=' smm:w-full w-[75%] outline m-3 smm:m-2 p-2 bg-slate-50 text-sm outline-2 rounded-sm placeholder:text-sm placeholder:text-gray-600 placeholder:font-semibold' type='text' name='email' defaultValue={state.email} onChange={onChange} />
                            </div>
                            <div className='name flex items-center w-full p-2 smm:text-sm smm:flex-col smm:space-y-2 smm:space-x-0 smm:w-full'>
                                <label htmlFor='name' className='w-[22%] text-xl smm:text-sm smm:w-full'>Name: </label>
                                <input className=' smm:w-full w-[75%] outline m-3 smm:m-2 p-2 bg-slate-50 text-sm outline-2 rounded-sm placeholder:text-sm placeholder:text-gray-600 placeholder:font-semibold' type='text' name='name' defaultValue={state.name} onChange={onChange} />
                            </div>
                            <div className='email flex items-center w-full p-2 smm:text-sm smm:flex-col smm:space-y-2 smm:space-x-0 smm:w-full'>
                                <label htmlFor='email' className='w-[22%] text-xl smm:text-sm smm:w-full'>Username: </label>
                                <input className=' smm:w-full w-[75%] outline m-3 smm:m-2 p-2 bg-slate-50 text-sm outline-2 rounded-sm placeholder:text-sm placeholder:text-gray-600 placeholder:font-semibold' type='text' name='username' defaultValue={state.username} onChange={onChange} />
                            </div>
                            <div className='post-image flex items-center w-full p-2 smm:text-sm smm:flex-col smm:space-y-2 smm:space-x-0 smm:w-full'>
                                {/* <h2 className='w-[36%] mdm:w-full p-2 smm:m-2 text-center text-black text-xl mdm:text-sm'>Profile Pic:</h2> */}
                                <label htmlFor='profile' className='w-[22%] text-xl smm:text-sm smm:w-full'>Profile Pic: </label>
                                <input type="file" className="cursor-pointer w-[75%] border-b-2 p-2 border-gray-700 smm:w-full text-lg text-slate-600 file:hidden hover:file:bg-violet-100 smm:text-sm" placeholder='Upload Profile Pic' name='image' onChange={(e) => setImage(e.target.files[0])} />
                                {/* <button className='px-1 py-2 bg-blue-500 rounded-md mdm:w-full text-sm text-white w-[40%]'>Upload Profile Pic</button> */}
                            </div>
                            <button className='text-white bg-blue-500 font-semibold p-2 rounded-md w-[88%] smm:w-full m-3 smm:m-2'>Update</button>
                        </div>
                    </form> : <></>
                </div>
                    : <></>
            }
            {
                followers && followersData && followersData.length > 0 ?
                    <div className='followersModal bg-gray-100 rounded-md p-3 absolute top-[20%] smm:p-4 left-0 right-0 mx-auto w-[35%] mdm:w-[95%] smm:max-h-96 max-h-56 overflow-y-scroll'>
                        <div className='close flex justify-end cursor-pointer' onClick={() => setFollowers(false)}>
                            <AiOutlineCloseCircle className='text-2xl mdm:text-lg mb-1' />
                        </div>
                        {
                            followersData.map((follower, i) => (
                                <div className='follower border-b-2 border-gray-200 px-2 py-1 bg-gray-50 rounded-md flex items-center justify-between' key={i}>
                                    <Link to={`/user/${follower._id}`}>
                                        <div className='follower-detail flex space-x-2 items-center'>
                                            <img className='follower-image h-10 w-10 rounded-full' src={follower.image} alt='profile-image' />
                                            <div className='follower-name  text-xl smm:text-sm font-semibold'>{follower.name}</div>
                                        </div>
                                    </Link>
                                    {
                                        state.following.includes(follower._id) ?
                                            <button className='bg-gray-200 rounded-md px-2 py-1 font-semibold smm:text-sm' onClick={() => handleUnfollow(follower._id)}>Unfollow</button> :
                                            <button className='bg-gray-200 rounded-md px-2 py-1 font-semibold smm:text-sm' onClick={() => handleFollow(follower._id)}>Follow</button>
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
                                    <Link to={`/user/${following._id}`}>
                                        <div className='following-detail flex space-x-2 items-center'>
                                            <img className='following-image h-10 w-10 rounded-full' src={following.image} alt='profile-image' />
                                            <div className='following-name text-xl smm:text-sm font-semibold'>{following.name}</div>
                                        </div>
                                    </Link>
                                    {
                                            <button className='bg-gray-200 rounded-md px-2 py-1 font-semibold smm:text-sm' onClick={() => handleUnfollow(following._id)}>Unfollow</button> 
                                    }
                                </div>
                            ))
                        }
                    </div> : <></>
            }
            <ToastContainer />
        </>
    )
}

export default Profile