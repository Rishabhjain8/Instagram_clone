import React, { useEffect, useState, useContext } from 'react';
import { SiGmail } from 'react-icons/si';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { userContext } from '../App';

const Registeration = () => {
    const footers = ['About', 'Blog', 'Jobs', 'Help', 'API', 'Terms & Conditions', 'Location'];
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ name: "", username: "", email: "", password: "" });
    const [image, setImage] = useState('');
    const [url, setUrl] = useState(undefined);
    const { dispatch } = useContext(userContext);
    const [visiblePassword, setVisiblePassword] = useState(false);

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }

    const options = {
        position: "top-right",
        autoClose: 1000,
        pauseOnHover: true,
        draggable: false,
        theme: 'dark'
    };

    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/');
        }
    }, [])

    useEffect(() => {
        if (url) {
            uploadFields();
        }
    }, [url])

    const handleValidation = () => {
        const { name, password, email, username } = credentials;

        if (email === '') {
            toast.error('Email is required', options);
            return false;
        }
        else if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            toast.error("Please! Enter valid email");
            return false;
        }
        if (name === '') {
            toast.error('Name is required', options);
            return false;
        }
        else if (name.length < 3) {
            toast.error('Name should be of atleast 3 in length', options);
            return false;
        }
        if (username === '') {
            toast.error('Username is required', options);
            return false;
        }
        else if (username.length < 3) {
            toast.error('Username should be of atleast 3 in length', options);
            return false;
        }
        if (password === '') {
            toast.error('Password is required', options);
            return false;
        }
        else if (password.length < 4) {
            toast.error('Password should be of atleast 4 in length', options);
            return false;
        }


        return true;
    }

    const uploadFields = async () => {
        if (handleValidation()) {
            const response = await fetch("http://localhost:5000/api/auth/signup", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: credentials.name, username: credentials.username, email: credentials.email, password: credentials.password, image: url })
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('token', JSON.stringify(data.authToken));
                localStorage.setItem('user', JSON.stringify(data.user));
                dispatch({ type: 'USER', payload: data.user });
                toast.success("Registered Successfully");
                setTimeout(() => {
                    navigate("/");
                }, 1000);

            }
            else {
                toast.error("Please try again after sometime!")
            }
        }
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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (image) {
            uploadPic();
        }
        else {
            uploadFields();
        }
    }

    const showPassword = () => {
        setVisiblePassword(!visiblePassword);
    }

    return (
        <div className='Registeration px-8 py-4 h-auto smm:px-4 bg-gradient-to-r from-purple-500 to-pink-400'>
            <div className='Registeration-content flex justify-center items-center space-x-2 h-auto '>
                <div className='design-logo w-[48%] smm:hidden flex justify-end mdtlg:justify-center'>
                    <img className='h-[60vh] w-[38vw]' src='https://cdni.iconscout.com/illustration/premium/thumb/new-user-registration-4489362-3723269.png' alt='Pinstargram' />
                </div>
                <div className='user-details flex flex-col w-[48%] justify-center vlg:items-start items-center smm:w-full smm:text-sm'>
                    <div className='Registeration-form border-2 border-gray-300 rounded-md px-4 py-6 mt-4 space-y-3 w-[60%] smm:w-full mdtlg:w-full'>
                        <h1 className='font-serif text-4xl smm:text-3xl text-center w-full mb-5 smm:mb-3'>Pinstagram</h1>
                        <h2 className='text-center text-lg smm:text-base font-semibold text-gray-700'>Sign Up to see videos and photos of your friends</h2>
                        <div className='gmail-Registeration text-red-700 cursor-pointer font-bold'>
                            <h5 className='flex justify-center items-center gap-2'><SiGmail /> Log in with Gmail</h5>
                        </div>
                        <div className='option flex space-x-4'>
                            <p className='border-t-2 border-gray-300 mt-3 w-[45%]'></p>
                            <p>Or</p>
                            <p className='border-t-2 border-gray-300 mt-3 w-[45%]'></p>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className='form flex flex-col justify-center items-center w-full'>
                                <input className='w-[87%] smm:w-full outline m-3 smm:m-2 p-2 bg-slate-200 text-sm outline-2 rounded-sm placeholder:text-sm placeholder:text-gray-600' type='text' name='email' placeholder='Email address' onChange={onChange} />
                                <input className='w-[87%] smm:w-full outline m-3 smm:m-2 p-2 bg-slate-200 text-sm outline-2 rounded-sm placeholder:text-sm placeholder:text-gray-600' type='text' name='name' placeholder='Full Name' onChange={onChange} />
                                <input className='w-[87%] smm:w-full outline m-3 smm:m-2 p-2 bg-slate-200 text-sm outline-2 rounded-sm placeholder:text-sm placeholder:text-gray-600' type='text' name='username' placeholder='Username' onChange={onChange} />
                                <div className='password flex justify-between items-center w-full bg-slate-200 w-[87%] smm:w-full m-3 smm:m-2 p-2 rounded-md border-2 border-black space-x-2'>
                                    <input className='outline-none bg-transparent text-sm placeholder:text-sm placeholder:text-gray-600 w-full' type={visiblePassword ? 'text' : 'password'} name='password' placeholder='Password' onChange={onChange} />
                                    <div className='cursor-pointer' onClick={() => showPassword()}>{visiblePassword ? <AiFillEye /> : <AiFillEyeInvisible />}</div>
                                </div>
                                <div className='post-image flex space-x-2 items-center mdm:text-sm mdm:flex-col mdm:space-y-2 mdm:space-x-0 mdm:w-full'>
                                    <h2 className='w-[35%] mdm:w-full p-2 smm:m-2 text-center text-slate-200 text-xl mdm:text-sm'>Profile Pic:</h2>
                                    <input type="file" className="cursor-pointer border-b-2 p-2 mdm:w-full text-lg text-slate-600 w-[58%] file:mr-2 file:hidden file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-violet-100 mdm:text-sm" placeholder='Upload Profile Pic' name='image' onChange={(e) => setImage(e.target.files[0])} />
                                    {/* <button className='px-1 py-2 bg-blue-500 rounded-md mdm:w-full text-sm text-white w-[40%]'>Upload Profile Pic</button> */}
                                </div>
                                <button className='text-white bg-blue-500 font-semibold p-2 rounded-md w-[87%] smm:w-full m-3 smm:m-2'>Sign Up</button>
                            </div>
                        </form>
                    </div>
                    <div className='registeration border-2 border-gray-300 px-2 py-4 rounded-md mt-4 w-[60%] smm:w-full smm:text-sm mdtlg:w-full'>
                        <Link to='/login'> <h5 className='text-center'>Have an account? <span className='text-blue-700 font-semibold cursor-pointer'>Log In</span></h5></Link>
                    </div>
                </div>
            </div>
            <div className='footer flex gap-8 flex-wrap items-center justify-center text-gray-700 cursor-pointer p-4 mt-6 smm:gap-4 smm:text-sm h-auto'>
                {
                    footers.map((footer, index) => (
                        <h6 key={index}>{footer}</h6>
                    ))
                }
            </div>
            <ToastContainer />
        </div>
    )
}

export default Registeration