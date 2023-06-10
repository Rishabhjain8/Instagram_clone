import React, { useEffect, useState, useContext } from 'react';
import { userContext } from '../App';
import { SiGmail } from 'react-icons/si';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Reset = () => {
    const { state, dispatch } = useContext(userContext);
    const footers = ['About', 'Blog', 'Jobs', 'Help', 'API', 'Terms & Conditions', 'Location'];
    const [credentials, setCredentials] = useState({ email: "" });
    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }
    const navigate = useNavigate();

    const options = {
        position: "top-right",
        autoClose: 1000,
        pauseOnHover: true,
        draggable: false,
        theme: 'dark'
    };

    const handleValidation = () => {
        const { email } = credentials;

        if (email === '') {
            toast.error('Email is required', options);
            return false;
        }
        else if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            toast.error("Please! Enter valid email");
            return false;
        }

        return true;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (handleValidation()) {
            const response = await fetch("http://localhost:5000/api/auth/reset-password", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: credentials.email})
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Check your email');
                setTimeout(() => {
                    navigate("/login");
                }, 1000);

            }
            else {
                toast.error("Please! Try to Sign Up");
                setTimeout(() => {
                    navigate('/signup');
                }, 500);
            }
        }
    }

    return (
        <div className='reset m-auto px-8 py-4 h-[100vh] smm:px-4 bg-gradient-to-r from-purple-500 to-pink-400'>
            <div className='reset-content flex justify-center items-center h-[76vh] smm:h-auto'>
                {/* <div className='design-logo w-[48%] smm:hidden flex justify-end mdtlg:justify-center'>
                    <img className='smtmd:h-[68vh] smtmd:w-[48vw] h-[60vh] w-[38vw]' src = 'https://shegoeswithpurpose.com/wp-content/uploads/2020/07/city-geotag.png' alt = 'Pinstargram' />
                </div> */}
                <div className='user-details flex flex-col w-[98%] justify-center items-center smm:w-full smm:text-sm'>
                    <div className='reset-form border-2 border-gray-300 rounded-md px-4 py-6 mt-4 space-y-3 w-[40%] smm:w-full mdtlg:w-full'>
                        <h1 className='font-serif text-4xl smm:text-3xl text-center w-full mb-12'>Pinstagram</h1>
                        <form onSubmit={handleSubmit}>
                            <div className='form flex flex-col justify-center items-center w-full'>
                                <input className='w-[88%] smm:w-full outline m-4 p-2 bg-slate-200 text-sm outline-2 rounded-sm placeholder:text-sm placeholder:text-gray-600' type='text' name='email' placeholder='Email address' onChange={onChange} />
                                <button className={`text-white ${!credentials.email ? 'bg-blue-400' : 'bg-blue-500'} font-semibold p-2 rounded-md w-[88%]`}>Reset Password</button>
                            </div>
                        </form>
                    </div>
                    <div className='registeration border-2 border-gray-300 px-2 py-4 rounded-md mt-4 w-[40%] smm:w-full smm:text-sm mdtlg:w-full'>
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

export default Reset