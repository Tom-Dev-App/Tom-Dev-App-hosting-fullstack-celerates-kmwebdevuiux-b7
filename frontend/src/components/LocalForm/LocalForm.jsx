import { useState } from "react";
import { useUser } from "../../context/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import {Link, useNavigate} from 'react-router-dom'


const LocalForm = ({isSignup}) =>
   {
  const {login, signup} = useUser()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullname, setFullname] = useState("")
  const [error, setError] = useState({})
  const [status, setStatus] = useState(null)
  const navigate = useNavigate()


  const handleSubmit = async(e) => {
    e.preventDefault()
    setError({})


    try {
      if(isSignup) {
        const response = await signup({email, password, fullname})
        setStatus({
          status: "success",
          message: "Account created"
        })
  
        await new Promise((resolve) => setTimeout(resolve, 2000))
        navigate('/signin')
      }
      else {
        await login({ email, password });
          setStatus({ status: "success", message: "Redirecting..." });
          await new Promise((resolve) => setTimeout(resolve, 300));
          navigate("/");
      }
    } catch (error) {
      const errorResponse = error.response?.errors || error.response?.data?.errors 

      if(Array.isArray(errorResponse) && errorResponse.length > 0 ) {
        const errorMessages = {}

        errorResponse.forEach(error => {
          const field = error.path || general

          if(!errorMessages[field]) {
            errorMessages[field] = error.message
          }
        setError(errorMessages);

        })
      } else {
        setError({
          general:
          error.response?.data?.message ||
          error.response?.message ||
            "Authentication failed.",
        });
      }
    
  }}

  return (
    <form
    onSubmit={handleSubmit}
    className="bg-white p-6 rounded-lg shadow-md space-y-4"
  >
    <h2 className="text-xl font-semibold">
      {isSignup ? "Sign Up" : "Sign In"}
    </h2>

    {status && status.status === "success" && (
      <p className="text-green-500 text-sm">
        {status.message} Redirecting...
      </p>
    )}

    {isSignup && (
      <div className="flex items-center bg-gray-100 p-2 rounded">
        <FontAwesomeIcon icon={faUser} className="mr-2 text-gray-500" />
        <input
          type="text"
          placeholder="Full Name"
          name="fullname"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          className="bg-transparent outline-none w-full"
        />
      </div>
    )}
    {isSignup && error.fullname && (
      <p className="text-red-500 text-sm">{error.fullname}</p>
    )}

    <div className="flex items-center bg-gray-100 p-2 rounded">
      <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-gray-500" />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="bg-transparent outline-none w-full"
      />
    </div>
    {error.email && <p className="text-red-500 text-sm">{error.email}</p>}

    <div className="flex items-center bg-gray-100 p-2 rounded">
      <FontAwesomeIcon icon={faLock} className="mr-2 text-gray-500" />
      <input
        type="password"
        placeholder="Password"
        value={password}
        name="password"
        onChange={(e) => setPassword(e.target.value)}
        className="bg-transparent outline-none w-full"
      />
    </div>
    {error.password && (
      <p className="text-red-500 text-sm">{error.password}</p>
    )}

    {error.general && <p className="text-red-500 text-sm">{error.general}</p>}

    <button
      type="submit"
      className="w-full bg-blue-600 text-white py-2 rounded-md shadow-md hover:bg-blue-700 transition duration-300"
    >
      {isSignup ? "Sign Up" : "Sign In"}
    </button>

    {isSignup ? (
      <div className="flex justify-center items-center">
        Already have an account?
        <Link to={"/signin"} className="ml-2 text-blue-500">
          Sign In
        </Link>
      </div>
    ) : (
      <div className="flex justify-center items-center">
        Don't have an account?
        <Link to={"/signup"} className="ml-2 text-blue-500">
          Sign Up
        </Link>
      </div>
    )}
  </form>
  )

 
}


export default LocalForm