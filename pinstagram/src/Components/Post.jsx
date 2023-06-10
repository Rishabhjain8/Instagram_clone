import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Post = () => {
    const navigate = useNavigate();
    useEffect(() => {
        if(!localStorage.getItem('token')){
            navigate('/login');
        }
    }, [])

    const [body, setBody] = useState("");
    const [image, setImage] = useState("");
    const [url, setUrl] = useState("");

    const options = {
        position: "top-right",
        autoClose: 1000,
        pauseOnHover: true,
        draggable: false,
        theme: 'dark'
    };

    const handleValidation = () => {
        if (body === '') {
            toast.error('Post Caption is required', options);
            return false;
        }
        else if (body.length < 3) {
            toast.error('Body/Caption should be of atleast 3 in length', options);
            return false;
        }
        if (image === '') {
            toast.error('Image is required', options);
            return false;
        }
        return true;
    }

    useEffect(() => {
        if(url){
            const fetchDetails = async () => {
                const response = await fetch("http://localhost:5000/api/post/addpost", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': JSON.parse(localStorage.getItem('token'))
                },
                body: JSON.stringify({body: body, image: url})
                })
                
                const data = await response.json();
                if(data.success){
                    toast.success("Post has been created");
                    setTimeout(() => {
                        navigate('/');
                    }, 1000)
                }
            }
            fetchDetails();
        }
    }, [url])

    const postDetails = async () => {
        if(handleValidation()){
            const data = new FormData();
            data.append("file", image);
            data.append("upload_preset", "pinstagram");
            data.append("cloud_name", "pinstagramcn");
            const response = await fetch("https://api.cloudinary.com/v1_1/pinstagramcn/image/upload",{
                method: 'POST',
                body: data
            })
            const res = await response.json();
            setUrl(res.secure_url);
        }
    }

    return (
        <div className='post p-10 h-[91.5vh] flex justify-center items-center bg-gradient-to-r from-purple-500 to-pink-400 mdm:p-4'>
            <div className='card-post flex flex-col space-y-10 w-[44%] border-2 border-gray-200 p-4 rounded-md lgm:w-full'>
                <div className='post-detail'>
                    <input className='focus:outline-none border-b-2 p-2 w-full bg-transparent placeholder:text-slate-600 placeholder:text-lg text-white mdm:placeholder:text-sm' type='text' name='body' placeholder='add a caption' onChange={(e) => setBody(e.target.value)}/>
                </div>
                <div className='post-image flex space-x-2 items-center mdm:text-sm mdm:flex-col mdm:space-y-2 mdm:space-x-0'>
                    <input type="file" className="cursor-pointer border-b-2 p-2 w-full mdm:w-full text-lg text-slate-600 file:mr-2 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-violet-100 mdm:text-sm" name = 'image'  onChange={(e) => setImage(e.target.files[0])}/>
                    {/* <button className='px-1 py-2 bg-blue-500 rounded-md mdm:w-full text-white w-[20%]'>Upload Image</button> */}
                </div>
                <div className='submit-btn flex justify-center mdm:text-sm'>
                    <button className='px-2 py-1 bg-blue-500 rounded-md text-white w-[22%] mdm:w-full' onClick={postDetails}>Submit Post</button>
                </div>

            </div>
            <ToastContainer />
        </div>
    )
}

export default Post