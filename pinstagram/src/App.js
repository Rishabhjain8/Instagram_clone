// import logo from './logo.svg';
import './App.css';
import { createContext, useEffect, useReducer, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './Components/Login';
import Registeration from './Components/Registeration';
import Profile from './Components/Profile';
import Navbar from './Components/Navbar';
import Home from './Components/Home';
import Post from './Components/Post';
import { user, initialValue } from './reducers/userReducer';
// import {followingData, initialValue} from './reducers/followingReducer';
import User from './Components/User';
import FollowingPost from './Components/FollowingPost';
import Reset from './Components/Reset';
import NewPassword from './Components/NewPassword';
import Footer from './Components/Footer';
import Chat from './Components/Chat';
import ChatBox from './Components/ChatBox';

export const userContext = createContext();
export const followingDataContext = createContext();

const Routing = () => {
  const navigate = useNavigate();
  const {dispatch} = useContext(userContext);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user) {
      dispatch({ type: 'USER', payload: user })
    }
    else {
      if(!window.location.pathname.startsWith('/reset'))
        navigate('/login');
    }
  }, [])

  return (
    <Routes>
      <Route exact path='/' element={<Home />} />
      <Route exact path='/login' element={<Login />} />
      <Route exact path='/signup' element={<Registeration />} />
      <Route exact path='/createpost' element={<Post />} />
      <Route exact path='/profile' element={<Profile />} />
      <Route exact path='/user/:id' element={<User />} />
      <Route exact path='/followpost' element={<FollowingPost />} />
      <Route exact path='/reset' element={<Reset />} />
      <Route exact path='/reset/:token' element={<NewPassword />} />
      <Route exact path='/chat' element={<Chat />} />
      <Route exact path='/message/:id' element={<ChatBox/>} /> 
      {
        // window.innerWidth <= '687px' ? <Route exact path='/message/:id' element={<ChatBox/>} /> : ""
      }
      
      
    </Routes>
  )
}

function App() {
  const [state, dispatch] = useReducer(user, initialValue);
  // const [data] = useReducer(followingData, initialValue);
  return (
    
    <userContext.Provider value={{ state, dispatch }}>
      <Router>
        <Navbar />
        <Routing />
        <Footer />
      </Router>
    </userContext.Provider>
  );
}

export default App;
