import React, { useContext, useEffect, useState, useRef } from 'react';
import { MdSend, MdDelete } from 'react-icons/md';
import { FcLike } from 'react-icons/fc';
import { FaRegComment, FaRegHeart } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { userContext } from '../App';

const FollowingPost = () => {
    const { state } = useContext(userContext);
    const [posts, setPosts] = useState("");
    const [comment, setComment] = useState('');
    const ref = useRef();
    const navigate = useNavigate();
    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login');
        }
    }, [])

    const onChange = (e) => {
        setComment(e.target.value)
    }

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
            .catch(err=>{
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
            .catch(err=>{
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

    const showComments = () => {
        
    }

    const deleteComments = (id, pid) => {
        fetch(`http://localhost:5000/api/post/deletecomment/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
                'auth-token' : JSON.parse(localStorage.getItem('token'))
            },
            body: JSON.stringify({postId: pid})
        })
        .then(res => res.json())
        .then(result => {
            const newData = posts.map(item=>{
                if(item._id===result._id){
                //   result.postedBy=item.postedBy;
                  return result
                }
                else{
                  return item
                }
            })
            setPosts(newData);
        })
    }

    return (
        <div className='p-10 flex flex-col items-center mdm:p-4'>
            {
                posts && posts.map((post, i) => (
                    <div key={i} className='card flex flex-col justify-center space-y-4 border-2 border-gray-200 rounded-sm py-2 px-2 w-[44%] mb-8 lgm:w-full'>
                        <div className='user-name flex items-center justify-between'>
                            <div className='user-det flex items-center space-x-2'>
                                <img className='rounded-full h-10 w-10 vsmmm:h-8 vsmmm:w-8' src={post['postedBy']['image']} alt='profile' />
                                <Link to = {`/user/${post['postedBy']['_id']}`}><h2 className='text-2xl font-semibold vsmmm:text-lg'>{post['postedBy']['name']}</h2></Link>
                            </div>
                            {post['postedBy']['_id'] === state._id ? <MdDelete className='text-2xl cursor-pointer vsmmm:text-lg' onClick={() => deletePost(post._id)}/> : <></>}
                        </div>

                        <div className='card-image'>
                            <img className='w-full' src={post['image'] !== 'no photo' || !post['image'] ? post['image'] : 'https://cdn.pixabay.com/photo/2018/08/14/13/23/ocean-3605547__340.jpg'} alt='post' />
                            {/* {`${post.image} ? ${post.image}: 'https://cdn.pixabay.com/photo/2018/08/14/13/23/ocean-3605547__340.jpg`} */}
                        </div>
                        <div className='card-details space-y-2 vsmmm:text-sm'>
                            <div className='icons flex space-x-4 cursor-pointer'>
                                <h3 className='text-2xl vsmmm:text-lg'>{post.likes.includes(state._id) ? <FcLike onClick={() => {updateDislike(post._id)}}/> : <FaRegHeart onClick={() => {updateLike(post._id)}}/>}</h3>
                                <h3 className='text-2xl vsmmm:text-lg' onClick = {showComments}><FaRegComment /></h3>
                            </div>
                            <h3><span className='font-semibold'>{post.likes.length} </span>likes</h3>
                            <h3>{post.body}</h3>
                            {
                                post.comments.map(comment => (
                                    <div key = {comment._id} className='flex justify-between items-center'>
                                    <h3 ><span className='font-semibold'>{comment.postedBy.name}</span> {comment.text}</h3>
                                    <MdDelete className='cursor-pointer' onClick={() => deleteComments(comment._id, post._id)}/>
                                    </div>
                                ))
                            }
                            <div className='comment flex space-x-2'>
                                <input className='focus:outline-none border-b-2 w-[90%]' name='comment' type='text' placeholder='add your comment' onChange={onChange} value={comment} />
                                {comment.length > 0 ? <MdSend onClick={() => postComment(post._id)} /> : <></>}
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default FollowingPost