import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bars3BottomRightIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { LogOut } from 'lucide-react'


export default function Navbar() {
    
  const [isOpen, setIsOpen] = useState(false)
  const [navBackground, setNavBackground] = useState('bg-transparent')
  const [ isLoggedIn, setIsLoggedIn ] = useState(false)
  const navigate = useNavigate()

  const Links = [
    { name: 'Home', link: '/' },
    { name: 'Dashboard', link: '/Dashboard' },
    { name: 'Pricing', link: '/pricing' },
    { name: 'About', link: '/about' },
  ]
  useEffect(()=>{
    const token = localStorage.getItem('Bearer')
    if (token){
        setIsLoggedIn(true)
    }
  })
  useEffect(() => {
    
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setNavBackground('bg-white shadow-md')
      } else {
        setNavBackground('bg-transparent')
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setNavBackground('bg-white')
    } else {
      document.body.style.overflow = 'unset'
      if (window.scrollY <= 50) {
        setNavBackground('bg-transparent')
      }
    }
  }, [isOpen])

  const handleLogout = () => {
    localStorage.removeItem('User')
    localStorage.removeItem('Bearer')
    setIsLoggedIn(false)
    navigate('/login')
  }

  return (
    <nav className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ${navBackground}`}>
      <div className="container mx-auto px-4 py-4 md:flex md:justify-between md:items-center">
        {/* logo */}
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            <span className='text-gray-700'>Med</span><span className='text-gray-900'>Well</span>
          </Link>
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600"
              aria-label="toggle menu"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3BottomRightIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Links */}
        <div
          className={`${
            isOpen ? 'block' : 'hidden'
          } md:block mt-4 md:mt-0 ${isOpen ? 'bg-white' : 'bg-transparent'}`}
        >
          <ul className="flex flex-col md:flex-row md:items-center md:space-x-8">
            {Links.map((link) => (
              <li key={link.name} className="my-3 md:my-0">
                <Link
                  to={link.link}
                  className="text-gray-700 hover:text-gray-900 transition duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
            {isLoggedIn ? (
              <li className="my-3 md:my-0">
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-700 hover:text-gray-900 transition duration-300"
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  Logout
                </button>
              </li>
            ) : (
              <>
                <li className="my-3 md:my-0">
                  <Link
                    to="/signup"
                    className="text-gray-700 hover:text-gray-900 transition duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Link>
                </li>
                <li className="my-3 md:my-0">
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-gray-900 transition duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    Log In
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}