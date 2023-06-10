import React, { useRef, useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoIosAddCircle, IoMdPersonAdd, IoMdClose } from 'react-icons/io';
import { FaSignInAlt } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import { MdSearch } from 'react-icons/md';
import { userContext } from '../App';
import { BsChat } from 'react-icons/bs';
import { RxCross1 } from 'react-icons/rx';
import { FaBars } from 'react-icons/fa';

const Navbar = () => {
    const [search, setSearch] = useState(false);
    const { state, dispatch } = useContext(userContext);
    const [userSearch, setUserSearch] = useState([]);
    const [user, setUser] = useState('');
    const [nav, setNav] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        if (localStorage.getItem('token')) {
            localStorage.removeItem('token');
            dispatch({ type: 'CLEAR' });
            navigate('/login');
        }
    }

    const onChange = (e) => {
        setUser(e.target.value)
    }

    useEffect(() => {
        if (search) {
            fetch('http://localhost:5000/api/alluser', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(res => res.json())
                .then(data => {
                    // console.log(data);
                    setUserSearch(data.users);
                })
        }
    }, [search])

    const handleClick = () => {
        setNav(!nav);
        // console.log(ref.current)
        // if(ref.current.classList.contains('left-[-800px]')){
        //     ref.current.classList.remove('left-[-800px]');
        //     ref.current.classList.add('left-[0px]');
        // }
        // else{
        //     ref.current.classList.add('left-[-800px]');
        //     ref.current.classList.remove('left-[0px]');
        // } 
        // if(ref.current.classList.contains('left-[-1px]')){
        //     ref.current.classList.remove('left-[-1px]');
        //     ref.current.classList.add('left-[0px]');
        // }
        // else{
        //     ref.current.classList.add('left-[-1px]');
        //     ref.current.classList.remove('left-[0px]');
        // } 
    }

    const closeSearch = () => {
        setUser('');
        setSearch(false);
    }

    return (
        <div className='navbar shadow-lg flex justify-between items-center w-full p-4 cursor-pointer sticky'>
            <Link to='/'><h2 className='text-2xl font-semibold italic mdm:text-sm'>Pinstagram</h2></Link>
            <div className='profile-links text-lg'>
                {
                    !localStorage.getItem('token') ?
                        <div className='flex space-x-10 mdm:text-sm mdm:space-x-4 items-center'>
                            <Link to='/signup'>
                                <div className='profile'>
                                    <h3 className='vsmmm:hidden'>Sign Up</h3>
                                    <h3 className='vsmmm:block vsmmm:text-xl hidden'><IoMdPersonAdd /></h3>
                                </div>
                            </Link>
                            <Link to='/login'>
                                <div className='profile'>
                                    <h3 className='vsmmm:hidden'>Sign In</h3>
                                    <h3 className='vsmmm:block vsmmm:text-xl hidden'><FaSignInAlt /></h3>
                                </div>
                            </Link>
                        </div > :
                        <div className='flex space-x-10 mdm:text-sm mdmh:space-x-4 vsmm:space-x-2 items-center'>
                            <div className='search'>

                                {
                                    search ?
                                        <div className='flex flex-col justify-center vsmmm:w-20 vsmmsb:w-28 w-56' onMouseLeave={closeSearch} >
                                            <input className='border-2 border-gray-400 py-1 px-2 outline-none h-8 text-sm font-semibold  vsmm:h-6 rounded-md' type='text' name='user' onChange={onChange} placeholder='search' defaultValue={user}/>
                                            {
                                                <div className={`users-list top-12 absolute bg-white w-56 max-h-56 vsmmsb:w-28 vsmmm:w-24 overflow-auto`} onMouseOver={() => setSearch(true)}>
                                                    {
                                                        userSearch && state && userSearch.filter((item) => {
                                                            let searchName = user.toLowerCase();
                                                            let dbName = item.name.toLowerCase();
                                                            return (searchName && dbName.includes(searchName));
                                                        })
                                                            .map((user, i) => (
                                                                <Link to={user._id === state._id ? '/profile' : `/user/${user._id}`}>
                                                                    <div key={i} className='user-det flex items-center space-x-4 border-b-2 border-gray-200 p-2 hover:bg-slate-200 rounded-md' onClick={() => setSearch(false)}>
                                                                        <img className='h-8 w-8 rounded-full vsmmm:hidden' src={user.image} alt='profile' />
                                                                        <h4 className='font-semibold'>{user.name}</h4>
                                                                    </div>
                                                                </Link>
                                                            ))
                                                    }

                                                    {/* <div className='user-det flex items-center space-x-4 border-b-2 border-gray-200 p-2'>
                                                    <img className='h-8 w-8 rounded-full' src='https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEilraKlUfxCr6iftN-KOngtBV_lE5TTVpoPTui0OtGqBHGnVv2tEZQ2Ahm7rymOgMMesO2isttJ45NVefTabPI8mKfLIhJcg8VUcyWZeCvMCdS82HyxmO45P4a3m22l0YIIabWP3olDaFCbEct7uEO_33JyD2hhrSIbxaJNSLV_lP3Eua5TaB_DNxU1/s708/Rhea%20Sharma.jpg' alt='profile' />
                                                    <h4 className=''>Akash Mittal</h4>
                                                </div> */}
                                                </div>
                                            }
                                        </div>
                                        : <h3 className='text-xl mt-2'><MdSearch onClick={() => setSearch(true)} /></h3>
                                }
                            </div>
                            <div className='logout' onClick={handleLogout}>
                                <h3 className='vsmmm:hidden'>Logout</h3>
                                <h3 className='vsmmm:block vsmmm:text-xl hidden'><FiLogOut /></h3>
                            </div>
                            <Link to='/profile' className='smm:hidden'>
                                <div className='profile'>
                                    <h3>Profile</h3>
                                </div>
                            </Link>
                            <Link to='/createpost'>
                                <div className='post'>
                                    <h3 className='vsmmm:hidden'>Create Post</h3>
                                    <h3 className='vsmmm:block vsmmm:text-xl hidden'><IoIosAddCircle /></h3>
                                </div>
                            </Link>
                            <Link to='/chat'>
                                <div className='chat'>
                                    <h3 className='smm:hidden'><BsChat /></h3>
                                </div>
                            </Link>
                        </div>
                }
            </div>
        </div>


    )
}

export default Navbar