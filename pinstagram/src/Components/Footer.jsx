import React from 'react';
import { Link } from 'react-router-dom';
import { BsChat } from 'react-icons/bs';
import { CgProfile } from 'react-icons/cg';
import {AiOutlineHome} from 'react-icons/ai';

const Footer = () => {
    return (
        <div>
            <div className='icons fixed bottom-0 w-full h-8 bg-slate-100 px-4 py-2 mdmsb:hidden z-10'>
                <ul className='flex justify-between items-center cursor-pointer'>
                <Link to = '/'>
                    <li className='text-xl font-semibold'><AiOutlineHome /></li>
                    </Link>
                    <Link to = '/chat'>
                    <li className='text-xl font-semibold'><BsChat /></li>
                    </Link>
                    <Link to='/profile'>
                        <li className='text-xl font-semibold'><CgProfile /></li>
                    </Link>
                </ul>
            </div>
        </div>
    )
}

export default Footer