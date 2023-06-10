import React, { useEffect, useState, useContext } from 'react';
import { userContext } from '../App';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';
import { SiGmail } from 'react-icons/si';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const { state, dispatch } = useContext(userContext);
    const footers = ['About', 'Blog', 'Jobs', 'Help', 'API', 'Terms & Conditions', 'Location'];
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }
    const navigate = useNavigate();
    const [visiblePassword, setVisiblePassword] = useState(false);

    const options = {
        position: "top-right",
        autoClose: 1000,
        pauseOnHover: true,
        draggable: false,
        theme: 'dark'
    };

    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/')
        }
    }, [])

    const handleValidation = () => {
        const { password, email } = credentials;

        if (email === '') {
            toast.error('Email is required', options);
            return false;
        }
        else if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            toast.error("Please! Enter valid email");
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (handleValidation()) {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: credentials.email, password: credentials.password })
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('token', JSON.stringify(data.authToken));
                localStorage.setItem('user', JSON.stringify(data.user));
                dispatch({ type: 'USER', payload: data.user })
                toast.success('Logged In successfully');
                setTimeout(() => {
                    navigate("/");
                }, 1000);

            }
            else {
                navigate("/signup");
            }
        }
    }

    const showPassword = () => {
        setVisiblePassword(!visiblePassword);
    }

    return (
        <div className='login m-auto px-8 py-4 h-[100vh] smm:px-4 bg-gradient-to-r from-purple-500 to-pink-400'>
            <div className='login-content flex justify-center items-center space-x-2 h-[86vh] smm:h-auto'>
                <div className='design-logo w-[48%] smm:hidden flex justify-end mdtlg:justify-center'>
                    <img className='smtmd:h-[68vh] smtmd:w-[48vw] h-[60vh] w-[38vw]' src='https://shegoeswithpurpose.com/wp-content/uploads/2020/07/city-geotag.png' alt='Pinstargram' />
                </div>
                <div className='user-details flex flex-col w-[48%] justify-center vlg:items-start items-center smm:w-full smm:text-sm'>
                    <div className='login-form border-2 border-gray-300 rounded-md px-4 py-6 mt-4 space-y-3 w-[60%] smm:w-full mdtlg:w-full'>
                        <h1 className='font-serif text-4xl smm:text-3xl text-center w-full mb-12'>Pinstagram</h1>
                        <form onSubmit={handleSubmit}>
                            <div className='form flex flex-col justify-center items-center w-full'>
                                <input className='w-[87%] smm:w-full outline m-4 p-2 bg-slate-200 text-sm outline-2 rounded-sm placeholder:text-sm placeholder:text-gray-600' type='text' name='email' placeholder='Email address' onChange={onChange} />
                                <div className='password flex justify-between items-center w-full bg-slate-200 w-[87%] smm:w-full m-3 smm:m-2 p-2 rounded-md border-2 border-black space-x-2'>
                                    <input className='outline-none bg-transparent text-sm placeholder:text-sm placeholder:text-gray-600 w-full' type={visiblePassword ? 'text' : 'password'} name='password' placeholder='Password' onChange={onChange} />
                                    <div className='cursor-pointer' onClick={() => showPassword()}>{visiblePassword ? <AiFillEye /> : <AiFillEyeInvisible />}</div>
                                </div>
                                <button className='text-white bg-blue-500 font-semibold p-2 rounded-md w-[87%]'>Log In</button>
                            </div>
                        </form>
                        <div className='option flex space-x-4'>
                            <p className='border-t-2 border-gray-300 mt-3 w-[45%]'></p>
                            <p>Or</p>
                            <p className='border-t-2 border-gray-300 mt-3 w-[45%]'></p>
                        </div>
                        <div className='gmail-login text-red-700 cursor-pointer font-bold'>
                            <h5 className='flex justify-center items-center gap-2'><SiGmail /> Log in with Gmail</h5>
                        </div>
                        <Link to='/reset'><div className='forgot-pwd text-center cursor-pointer'>
                            <p className='text-gray-700'>Forgotten your password?</p>
                        </div></Link>
                    </div>
                    <div className='registeration border-2 border-gray-300 px-2 py-4 rounded-md mt-4 w-[60%] smm:w-full smm:text-sm mdtlg:w-full'>
                        <Link to='/signup'><h5 className='text-center'>Don't have an account? <span className='text-blue-700 font-semibold cursor-pointer'>Sign Up</span></h5></Link>
                    </div>
                </div>
            </div>
            <div className='footer flex gap-8 flex-wrap items-center justify-center text-gray-700 cursor-pointer py-4 smm:gap-4 smm:text-sm h-auto'>
                {
                    footers.map((footer, i) => (
                        <h6 key={i}>{footer}</h6>
                    ))
                }
            </div>
            <ToastContainer />
        </div>
    )
}

export default Login