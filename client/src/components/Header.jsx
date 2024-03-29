import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { TiWeatherSunny } from "react-icons/ti";
import { FaMoon } from "react-icons/fa";


const Header = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const {currentUser} = useSelector((state) => state.user)
  // console.log(currentUser)
  //search functionality

  const handleSubmit = (e)=>{
    e.preventDefault()
    const urlParams = new URLSearchParams(window.location.search)
    urlParams.set('searchTerm', searchTerm)
    const searchQuery = urlParams.toString()
    navigate(`/search?${searchQuery}`)
  }

  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search)
    const searchTermFromUrl = urlParams.get('searchTerm')
    if (searchTermFromUrl){
      setSearchTerm(searchTermFromUrl)
    }
  },[location.search])

  const handleTheme=()=>{
    setDarkMode(prevState => !prevState)
  }
  console.log(darkMode)
  return (
    <header className='bg-slate-200 shadow-md'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link to='/'>
          <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
            <span className='text-slate-500'>E</span>
            <span className='text-slate-700'>Estate</span>
          </h1>
        </Link>
        <form onSubmit={handleSubmit} className='bg-slate-100 p-3 rounded-lg flex items-center'>
          <input
            type='text'
            placeholder='Search...'
            value={searchTerm}
            onChange={(e)=> setSearchTerm(e.target.value)}
            className='bg-transparent focus:outline-none w-24 sm:w-64'
          />
          <button>
          <FaSearch className='text-slate-600' />
          </button>
        </form>
        <ul className='flex items-center gap-4'>
          <Link to='/'>
            <li className='hidden sm:inline text-slate-700 hover:underline cursor-pointer'>
              Home
            </li>
          </Link>
          
            <li className='cursor-pointer text-xl' onClick={handleTheme}>
              {darkMode ? <TiWeatherSunny /> : <FaMoon />}
            </li>
          
          <Link to='/profile'>
            {currentUser ? (
              <>
              <img className='rounded-full h-7 w-7 object-cover' src={currentUser.avatar} alt='profile'/>
              {/* <h3>{currentUser.username}</h3> */}
              </>

            ) : 
          (  <li className='text-slate-700 hover:underline cursor-pointer'>
              Sign in
            </li>)
            }
          </Link>
        </ul>
      </div>
    </header>
  );
};

export default Header;
