import { createContext, useContext, useEffect, useState } from "react";
import Cookies from 'js-cookie'
import axios from "axios";


const UserContext = createContext()

export const useUser = () => useContext(UserContext)

export const UserProvider = ({children}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userId, setUserId] = useState(null)
  const [accessSecret, setAccessSecret] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(false)


  useEffect(()=> {
    const checkAuth = () => {
      const user = Cookies.get("user")
      const Token = Cookies.get("token")
      const access_secret = Cookies.get("access_secret")

      if(user && access_secret && Token) {
        setIsLoggedIn(true)
        setUserId(user)
        setToken(Token)
        setAccessSecret(access_secret)
      } else {
        setIsLoggedIn(false)
      }

      setLoading(false)
    }

    checkAuth()
  }, [userId, accessSecret, token])

  if(loading)
    return <div className="min-h-screen min-w-full flex justify-center items-center bg-sky-900"><h2 className="text-3xl text-sky-500 font-medium text-center">Loading</h2></div>

  const login = async(credentials) => {
    try {
      const {data} = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/login`,
        credentials,
        { withCredentials: true })
      const user = Cookies.get('user')
      const Token = Cookies.get('token')
      const access_secret = Cookies.get('access_secret')

      setToken(Token)
      setAccessSecret(access_secret)
      setUserId(user)
      setIsLoggedIn(true)
    } catch (error) {
      console.error(
        "Login failed:",
        error.response?.data?.message || error.message
      );
      // setError ini ada di hal LocalForm
      setError({
        general: error.response?.data?.message || "Authentication failed.",
      });
      throw error;
    }
  }

  function clearStorageAndCookies() {
    localStorage.clear(); // Clear local storage
    sessionStorage.clear();
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); // Clear cookies
    });
  }

  async function logout() {
    const confirmed = window.confirm("Are you sure to log out?")
    if(!confirmed) return

    clearStorageAndCookies()
    window.location.href = "http://localhost:5173/signin"
  }

  const googleLogin = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/google`
  }

  const signup = async(credentials) => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/register`, credentials, {withCredentials: true})
      setIsLoggedIn(true)
    } catch (error) {
      console.error(
        "Signup failed:",
        error.response?.data?.message || error.message
      );
      throw error;
    }
  }

  return (
    <UserContext.Provider
      value={{
        isLoggedIn,
        userId,
        accessSecret,
        login,
        logout,
        googleLogin,
        signup,
        token,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

