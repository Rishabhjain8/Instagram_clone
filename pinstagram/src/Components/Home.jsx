import React, { useContext, useEffect, useState, useRef } from 'react';
import { MdSend, MdDelete } from 'react-icons/md';
import { BiEdit } from 'react-icons/bi';
import { FcLike } from 'react-icons/fc';
import { FaRegComment, FaRegHeart } from 'react-icons/fa';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { useNavigate, Link } from 'react-router-dom';
import { userContext } from '../App';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
    const { state, dispatch } = useContext(userContext);
    const [posts, setPosts] = useState([]);
    const [follow, setFollow] = useState();
    const [edit, setEdit] = useState(false);
    const [comment, setComment] = useState('');
    const [image, setImage] = useState('');
    const [url, setUrl] = useState('');
    const [caption, setCaption] = useState('');
    const [id, setId] = useState('');
    const [likes, setLikes] = useState([]);
    const [like, setLike] = useState(false);
    const navigate = useNavigate();
    const [showComment, setShowComment] = useState(false);
    const [commentId, setCommentId] = useState('');
    const ref = useRef();

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login');
        }
    }, [])

    const onChange = (e) => {
        setComment(e.target.value)
    }

    const handleValidation = () => {
        if (caption.length < 3) {
            toast.error('Body/Caption should be of atleast 3 in length', options);
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

    const deletePost = async (id) => {
        const response = await fetch('http://localhost:5000/api/post/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': JSON.parse(localStorage.getItem('token'))
            },
            body: JSON.stringify({ postId: id })
        })

        const data = await response.json();
        const newPosts = posts.filter(post => {
            return post._id !== id
        })
        setPosts(newPosts);

    }

    useEffect(() => {
        const fetchDetails = async () => {
            const response = await fetch('http://localhost:5000/api/post/allpost', {
                method: 'GET'
            })

            const data = await response.json();
            setPosts(data);
        }
        fetchDetails();
    }, [])

    const updateLike = (id) => {
        // const response = await 
        fetch('http://localhost:5000/api/post/like', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': JSON.parse(localStorage.getItem('token'))
            },
            body: JSON.stringify({ postId: id })
        })
            .then(res => res.json())
            .then(data => {
                const newPosts = posts.map(post => {
                    if (post._id === data._id) {
                        return data;
                    }
                    else {
                        return post;
                    }
                })
                setPosts(newPosts);
            })
            .catch(err => {
                console.log(err)
            })

        // const data = await response.json();

    }


    const updateDislike = (id) => {
        // const response = await 
        fetch('http://localhost:5000/api/post/unlike', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': JSON.parse(localStorage.getItem('token'))
            },
            body: JSON.stringify({ postId: id })
        })
            .then(res => res.json())
            .then(data => {
                const newPosts = posts.map(post => {
                    if (post._id === data._id) {
                        return data;
                    }
                    else {
                        return post;
                    }
                })
                setPosts(newPosts);
            })
            .catch(err => {
                console.log(err)
            })

        // const data = await response.json();

    }

    const postComment = async (id) => {
        const response = await fetch('http://localhost:5000/api/post/comment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': JSON.parse(localStorage.getItem('token'))
            },
            body: JSON.stringify({ text: comment, postId: id })
        })

        const data = await response.json();
        const newPosts = posts.map(post => {
            if (post._id === data._id) {
                return data;
            }
            else {
                return post;
            }
        })
        setPosts(newPosts);
        setComment('');
    }

    const showComments = (id) => {
        setShowComment(!showComment);
        setCommentId(id);
    }

    const deleteComments = (id, pid) => {
        fetch(`http://localhost:5000/api/post/deletecomment/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': JSON.parse(localStorage.getItem('token'))
            },
            body: JSON.stringify({ postId: pid })
        })
            .then(res => res.json())
            .then(result => {
                const newData = posts.map(item => {
                    if (item._id === result._id) {
                        //   result.postedBy=item.postedBy;
                        return result
                    }
                    else {
                        return item
                    }
                })
                setPosts(newData);
            })
    }

    const editPost = (img) => {
        setEdit(true);
        setImage(img);
    }

    const showLikes = (id) => {
        fetch(`http://localhost:5000/api/likes/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => {
                // console.log(data);
                setLike(true);
                setLikes(data.likes);
            })
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
        setUrl(res.secure_url);
    }

    const uploadFields = (id) => {
        if (handleValidation()) {
            fetch(`http://localhost:5000/api/post/update/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': JSON.parse(localStorage.getItem('token'))
                },
                body: JSON.stringify({ body: caption, image: url ? url : image })
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    const newData = posts.map(post => {
                        if (post._id === data._id) {
                            return data;
                        }
                        else {
                            return post;
                        }
                    })
                    setPosts(newData);
                    setEdit(false);
                })
        }
    }

    const handleFollow = () => {
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
                const user = JSON.parse(localStorage.getItem('user'))
                localStorage.setItem("user", { ...user, follow })
                setFollow(false)
            })
    }

    const handleUnfollow = () => {
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
                localStorage.setItem("user", JSON.stringify(data.user));
                setFollow(true)
            })
    }

    useEffect(() => {
        if (image && id) uploadFields(id);
    }, [url])

    const handleSubmit = (e, id) => {
        e.preventDefault();
        setId(id);
        if (image) {
            uploadPic();
        }
        else {
            uploadFields(id);
        }
    }

    return (
        <div className={`p-10 flex flex-col items-center mdm:p-4 smm:mb-2 z-20`}>

            {
                posts && state ? posts.map((post, i) => (
                    <div ref = {ref} key={post._id} className={`card flex flex-col ${like ? 'blur-sm' : ''} justify-center space-y-4 border-2 border-gray-200 rounded-sm py-2 px-2 w-[44%] mb-8 lgm:w-full`}>
                        <div className='user-name flex items-center justify-between bg-slate-100 p-1 rounded-md'>
                            <div className='user-det flex items-center space-x-2'>
                                <img className='rounded-full h-10 w-10 vsmmm:h-8 vsmmm:w-8' src={post['postedBy']['image']} alt='profile' />
                                <Link to={`/user/${post['postedBy']['_id']}`}><h2 className='text-2xl font-semibold vsmmm:text-lg'>{post['postedBy']['name']}</h2></Link>
                            </div>
                            {post['postedBy']['_id'] === state._id ?
                                <>
                                    <div className='flex space-x-2 items-center'>
                                        <BiEdit className='text-2xl cursor-pointer vsmmm:text-lg' onClick={() => editPost(post.image)} />
                                        <MdDelete className='text-2xl cursor-pointer vsmmm:text-lg' onClick={() => deletePost(post._id)} />
                                    </div>
                                    {
                                        edit && state ? <div className={`edit-form-modal bg-gray-400 rounded-md p-6 fixed top-[20%] smm:p-4 left-0 right-0 mx-auto w-[45%] mdm:w-[90%]`}>
                                            <div className='close flex justify-end cursor-pointer' onClick={() => setEdit(false)}>
                                                <AiOutlineCloseCircle className='text-2xl mdm:text-lg' />
                                            </div>
                                            <form onSubmit={(e) => handleSubmit(e, post._id)}>
                                                <div className='form flex flex-col justify-center items-center w-full'>
                                                    <div className='caption flex items-center w-full p-2 smm:text-sm smm:flex-col smm:space-y-2 smm:space-x-0'>
                                                        <label htmlFor='caption' className='w-[22%] text-xl smm:text-sm smm:w-full'>Caption: </label>
                                                        <input className=' smm:w-full w-[75%] outline m-3 smm:m-2 p-2 bg-slate-50 text-sm outline-2 rounded-sm placeholder:text-sm placeholder:text-gray-600 placeholder:font-semibold' type='text' name='caption' defaultValue={post.body} onChange={(e) => setCaption(e.target.value)} />
                                                    </div>
                                                    <div className='post-image flex items-center w-full p-2 smm:text-sm smm:flex-col smm:space-y-2 smm:space-x-0 smm:w-full'>
                                                        {/* <h2 className='w-[36%] mdm:w-full p-2 smm:m-2 text-center text-black text-xl mdm:text-sm'>Profile Pic:</h2> */}
                                                        <label htmlFor='post' className='w-[22%] text-xl smm:text-sm smm:w-full'>Post Pic: </label>
                                                        <input type="file" className="cursor-pointer w-[75%] border-b-2 p-2 border-gray-700 smm:w-full text-lg text-slate-600 file:hidden hover:file:bg-violet-100 smm:text-sm" placeholder='Upload Post Pic' name='image' onChange={(e) => setImage(e.target.files[0])} />
                                                        {/* <button className='px-1 py-2 bg-blue-500 rounded-md mdm:w-full text-sm text-white w-[40%]'>Upload Profile Pic</button> */}
                                                    </div>
                                                    <button className='text-white bg-blue-500 font-semibold p-2 rounded-md w-[88%] smm:w-full m-3 smm:m-2'>Update</button>
                                                </div>
                                            </form>
                                        </div>
                                            : <></>
                                    }
                                </>
                                : <></>
                            }

                        </div>

                        <div className='card-image'>
                            <img className='h-72 w-full' src={post['image'] !== 'no photo' || !post['image'] ? post['image'] : 'https://cdn.pixabay.com/photo/2018/08/14/13/23/ocean-3605547__340.jpg'} alt='post' />
                            {/* {`${post.image} ? ${post.image}: 'https://cdn.pixabay.com/photo/2018/08/14/13/23/ocean-3605547__340.jpg`} */}
                        </div>
                        <div className='card-details space-y-2 vsmmm:text-sm'>
                            <div className='icons flex space-x-4 cursor-pointer'>
                                <h3 className='text-2xl vsmmm:text-lg'>{post.likes.includes(state._id) ? <FcLike onClick={() => { updateDislike(post._id) }} /> : <FaRegHeart onClick={() => { updateLike(post._id) }} />}</h3>
                                <h3 className='text-2xl vsmmm:text-lg' onClick={() => showComments(post._id)}><FaRegComment /></h3>
                            </div>
                            <h3 className='cursor-pointer' onClick={() => showLikes(post._id)}><span className='font-semibold'>{post.likes.length} </span>likes</h3>
                            {post.comments.length > 0 ? <h3 className='text-gray-500 cursor-pointer' onClick={() => showComments(post._id)}><span className='font-semibold '>{post.comments.length} </span>comments</h3> : <></>}
                            <h3 className='font-bold'>{post.body}</h3>
                            {
                                showComment && commentId === post._id ? post.comments.map(comment => (
                                    <div key={comment._id} className='flex justify-between items-center'>
                                        <h3 ><span className='font-semibold'>{comment.postedBy.name}</span> {comment.text}</h3>
                                        <MdDelete className='cursor-pointer' onClick={() => deleteComments(comment._id, post._id)} />
                                    </div>
                                ))
                                    : <></>
                            }
                            <div className='comment flex space-x-2'>
                                <input className='focus:outline-none border-b-2 w-[90%]' name='comment' type='text' placeholder='add your comment' onChange={onChange} value={comment} />
                                {comment.length > 0 ? <MdSend onClick={() => postComment(post._id)} /> : <></>}
                            </div>
                        </div>
                    </div>


                ))


                    : <h2 className='italic text-2xl text-center'>loading...</h2>

            }

            {
                like && likes && likes.length > 0 ?
                    <div className={`likeModal bg-gray-100 rounded-md p-3 fixed top-[20%] bottom-0 smm:p-4 left-0 right-0 mx-auto w-[35%] mdm:w-[95%] smm:max-h-96 max-h-56 min-h-min overflow-y-scroll`}>
                        <div className='close flex justify-end cursor-pointer' onClick={() => setLike(false)}>
                            <AiOutlineCloseCircle className='text-2xl mdm:text-lg mb-1' />
                        </div>
                        {
                            likes.map((lik, i) => (
                                <div className='like border-b-2 border-gray-200 px-2 py-1 bg-gray-50 rounded-md flex items-center justify-between' key={i}>
                                    <Link to={`/user/${lik._id}`} onClick={() => setLike(false)}>
                                        <div className='like-detail flex space-x-2 items-center'>
                                            <img className='like-image h-10 w-10 rounded-full' src={lik.image} alt='profile-image' />
                                            <div className='like-name text-xl smm:text-sm font-semibold'>{lik.name}</div>
                                        </div>
                                    </Link>
                                    {
                                        state.following.includes(lik._id) ?
                                            state._id !== lik._id && <button className='bg-gray-200 rounded-md px-2 py-1 font-semibold smm:text-sm' onClick={handleUnfollow}>Unfollow</button> :
                                            state._id !== lik._id && <button className='bg-gray-200 rounded-md px-2 py-1 font-semibold smm:text-sm' onClick={handleFollow}>Follow</button>
                                    }
                                </div>
                            ))
                        }
                    </div>
                    : <></>
            }

            <ToastContainer />

        </div>
    )
}

export default Home