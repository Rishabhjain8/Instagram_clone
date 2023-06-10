import React, { useEffect, useState } from 'react';
import {  useNavigate, useParams } from 'react-router-dom';
import {AiFillEyeInvisible, AiFillEye} from 'react-icons/ai';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NewPassword = () => {
    const footers = ['About', 'Blog', 'Jobs', 'Help', 'API', 'Terms & Conditions', 'Location'];
    const [credentials, setCredentials] = useState({ password: "", confirmPassword: "" });
    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }
    const navigate = useNavigate();
    const {token} = useParams();
    const [visiblePassword, setVisiblePassword] = useState(false);
    const [pwdType, setPwdType] = useState('');

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

    const handleValidation = () => {
        const { password, confirmPassword } = credentials;

        if (password === '') {
            toast.error('Password is required', options);
            return false;
        }
        else if (password.length < 4) {
            toast.error('Password should be of atleast 4 in length', options);
            return false;
        }
        if (confirmPassword === '') {
            toast.error('Confirm Password is required', options);
            return false;
        }
        else if (confirmPassword !== password) {
            toast.error('Confirm Password must be same as Password', options);
            return false;
        }

        return true;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (handleValidation()) {
            const response = await fetch("http://localhost:5000/api/auth/new-password", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ password: credentials.password, confirmPassword: credentials.confirmPassword, resetToken: token})
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Password has been updated successfully');
                setTimeout(() => {
                    navigate("/login");
                }, 1000);

            }
            else {
                toast.error("Please! try again after sometime session may be expired");
                setTimeout(() => {
                    navigate('/signup');
                }, 500);
            }
        }
    }

    const showPassword = (pwdType) => {
        setPwdType(pwdType);
        setVisiblePassword(!visiblePassword);
    }

    return (
        <div className='new_password m-auto px-8 py-4 h-[100vh] smm:px-4 bg-gradient-to-r from-purple-500 to-pink-400'>
            <div className='reset-content flex justify-center items-center h-[76vh] smm:h-auto'>
                {/* <div className='design-logo w-[48%] smm:hidden flex justify-end mdtlg:justify-center'>
                    <img className='smtmd:h-[68vh] smtmd:w-[48vw] h-[60vh] w-[38vw]' src = 'https://shegoeswithpurpose.com/wp-content/uploads/2020/07/city-geotag.png' alt = 'Pinstargram' />
                </div> */}
                <div className='user-details flex flex-col w-[98%] justify-center items-center smm:w-full smm:text-sm'>
                    <div className='reset-form border-2 border-gray-300 rounded-md px-4 py-6 mt-4 space-y-3 w-[40%] smm:w-full mdtlg:w-full'>
                        <h1 className='font-serif text-4xl smm:text-3xl text-center w-full mb-12'>Pinstagram</h1>
                        <form onSubmit={handleSubmit}>
                            <div className='form flex flex-col justify-center items-center w-full'>  
                            <div className='password flex justify-between items-center w-full bg-slate-200 w-[87%] smm:w-full m-3 smm:m-2 p-2 rounded-md border-2 border-black space-x-2'>
                                <input className='outline-none bg-transparent text-sm placeholder:text-sm placeholder:text-gray-600 w-full' type={visiblePassword && pwdType === 'password' ? 'text' : 'password'} name='password' placeholder='New Password' onChange={onChange} />
                                <div className='cursor-pointer' onClick = {() => showPassword('password')}>{visiblePassword && pwdType === 'password' ? <AiFillEye /> : <AiFillEyeInvisible />}</div>
                            </div>

                            <div className='password flex justify-between items-center w-full bg-slate-200 w-[87%] smm:w-full m-3 smm:m-2 p-2 rounded-md border-2 border-black space-x-2'>
                                <input className='w-full outline-none bg-transparent text-sm placeholder:text-sm placeholder:text-gray-600' type={visiblePassword && pwdType === 'confirmPassword' ? 'text' : 'password'} name='confirmPassword' placeholder='Confirm Password' onChange={onChange} />
                                <div className='cursor-pointer' onClick = {() => showPassword('confirmPassword')}>{visiblePassword && pwdType === 'confirmPassword' ? <AiFillEye /> : <AiFillEyeInvisible />}</div>
                            </div>
                            
                            
                                <button className={`text-white ${credentials.password && credentials.confirmPassword ? 'bg-blue-500' : 'bg-blue-400'} font-semibold p-2 rounded-md w-[87%]`}>Update Password</button>
                            </div>
                        </form>
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

export default NewPassword