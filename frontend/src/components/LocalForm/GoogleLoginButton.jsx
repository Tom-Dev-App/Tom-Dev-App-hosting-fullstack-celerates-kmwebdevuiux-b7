import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

const GoogleLoginButton = () => {
  const googleLogin = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/google`;
  };

  return (
    <button
      onClick={googleLogin}
      className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md shadow-md transition duration-300 w-full"
    >
      <FontAwesomeIcon icon={faGoogle} />
      Sign in with Google
    </button>
  );
};


export default GoogleLoginButton;
