import GoogleLoginButton from "../../components/LocalForm/GoogleLoginButton";
import LocalForm from "../../components/LocalForm/LocalForm";

const SignIn = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-700">Sign In</h2>
      <LocalForm isSignup={false} />
      <div className="flex items-center justify-center">
        <span className="text-sm text-gray-600">or</span>
      </div>
      <GoogleLoginButton />
    </div>
  </div>
);

export default SignIn;
