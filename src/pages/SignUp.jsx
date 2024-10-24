import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import Stethoscope from './../../public/Stethoscope.png'
import { ngrok_url, google_ngrok_url } from '../utils/global'

export function SignUp() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showCPassword, setShowCPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const token=localStorage.getItem("Bearer")
    if(token){
      navigate("/Dashboard")
    }
    const initializeGoogleSignIn = () => {
      if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_KEY,
          callback: handleCallbackResponse
        })
        window.google.accounts.id.renderButton(
          document.getElementById("signInDiv"),
          { theme: "outline", size: "large" }
        )
      } else {
        setTimeout(initializeGoogleSignIn, 100)
      }
    }

    initializeGoogleSignIn()
  }, [])

  const handleCallbackResponse = (response) => {
    const formData = new FormData()
    formData.append("token", response.credential)

    fetch(`${google_ngrok_url}/auth/google_login/`, {
      method: "POST",
      body: formData,  
    })
      .then(res => res.json())
      .then(data => {
        console.log("Backend response: ", data)
        localStorage.setItem("Bearer", data.access)
        navigate("/Dashboard")
      })
      .catch(err => {
        console.error("Error in Google login: ", err)
        setErrorMessage("An error occurred during Google sign-up. Please try again.")
      })
  }

  const validateForm = () => {
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.")
      return false
    }
    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.")
      return false
    }
    return true
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrorMessage('')

    if (!validateForm()) {
      return
    }

    const formData = new FormData()
    formData.append("email", email)
    formData.append("password1", password)
    formData.append("password2", confirmPassword)
    formData.append("full_name", fullName)

    fetch(`${ngrok_url}/auth/register_user/`, {
      method: "POST",
      body: formData,  
    })
      .then(res => res.json())
      .then(data => {
        console.log("Backend response: ", data)
        if (data.status === false) {
          setErrorMessage(data.mssg)
        } else {
          localStorage.setItem("Bearer", data.access_token)
          localStorage.setItem("User", JSON.stringify({ email: email, fullName: fullName }))
          navigate("/Dashboard")
        }
      })
      .catch(err => {
        console.error("Error in SignUp: ", err)
        setErrorMessage("An error occurred during sign-up. Please try again.")
      })
  }

  return (
    <div className="flex min-h-screen bg-blue-50 items-center justify-center p-4">
      <div className="bg-white rounded-[40px] overflow-hidden shadow-2xl max-w-5xl w-full">
        <div className="flex flex-col md:flex-row">
          {/* Left Section */}
          <div className="bg-blue-100 p-12 md:w-1/2 relative flex flex-col justify-between">
            <div className="text-2xl text-gray-800 font-semibold mb-12">
              We at MedWell are<br />always fully focused on<br />helping you.
            </div>
            <div className="flex items-center justify-center flex-grow">
              <div className="relative w-64 h-64">
                <div className="absolute inset-0 bg-blue-200 rounded-full"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src={Stethoscope}
                    alt="Stethoscope"
                    width={200}
                    height={200}
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="p-12 md:w-1/2">
            <h2 className="text-3xl font-bold text-center mb-8">Create Account</h2>
            <div id="signInDiv" className="flex justify-center mb-8">
              <button className="flex items-center justify-center w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign up with Google
              </button>
            </div>
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">OR</span>
              </div>
            </div>
            {errorMessage && (
              <div className="mb-4 text-red-500 text-sm text-center">{errorMessage}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="full-name" className="block text-sm font-medium text-gray-700 mb-1">Full Name:</label>
                <input
                  id="full-name"
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
                <input
                  id="email"
                  type="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="relative">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password:</label>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOffIcon className="h-5 w-5 text-gray-400" /> : <EyeIcon className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
              <div className="relative">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password:</label>
                <input
                  id="confirmPassword"
                  type={showCPassword ? "text" : "password"}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                  onClick={() => setShowCPassword(!showCPassword)}
                >
                  {showCPassword ? <EyeOffIcon className="h-5 w-5 text-gray-400" /> : <EyeIcon className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create Account
              </button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-600">
              Already have an Account? <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}