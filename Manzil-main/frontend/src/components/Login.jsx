/* eslint-disable no-unused-vars */
import { useState } from "react";
import { registerUser, loginUser } from "../components/api";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [, setPasswordValid] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,}$/;
    return passwordRegex.test(password);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("❌ Passwords do not match!");
      return;
    }

    if (!isValidPassword(password)) {
      setError("❌ Password must be at least 5 characters, include a number and a special symbol!");
      return;
    }

    if (!name || !email || !password || !contact) {
      setError("❌ All fields are required!");
      return;
    }

    if (!/^\d{10}$/.test(contact)) {
      setError("❌ Contact number must be exactly 10 digits!");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await registerUser({ name, contact, email, password });

      if (response.success) {
        alert("✅ Registration successful! Please log in.");
        setIsSignUp(false);
        setName("");
        setContact("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError("❌ An error occurred during registration!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("❌ Both fields are required!");
      return;
    }

    if (!isValidPassword(password)) {
      setError("❌ Password must be at least 5 characters, include a number and a special symbol!");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await loginUser(email, password);

      if (response.success) {
        localStorage.setItem("userToken", response.token);
        localStorage.setItem("userData", JSON.stringify(response.user));
        setIsLoggedIn(true);
        navigate("/Userdash");
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError("❌ An error occurred during login!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative p-4">
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center ">
          <svg className="w-16 h-16 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
        </div>
      )}

      {!isLoggedIn ? (
        
        
        <div className="w-full max-w-2xl p-10 mx-auto bg-white rounded-md shadow-md ">

          
          <h2 className="mb-6 text-3xl font-semibold text-center text-gray-800">
            {isSignUp ? "Sign Up" : "Signin"}
          </h2>

          {error && <p className="mb-4 text-left text-red-500">{error}</p>}

          <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-4">
            {isSignUp && (
              <>
                <div>
                  <label className="block text-sm font-medium text-left text-gray-700">Full Name</label>
                  <input
                    type="text"
                    className="w-full p-3 mt-1 border border-gray-300 rounded-md"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-left text-gray-700">Contact Number</label>
                  <input
                    type="text"
                    className="w-full p-3 mt-1 border border-gray-300 rounded-md"
                    value={contact}
                    onChange={(e) => {
                      const input = e.target.value;
                      if (/^\d{0,10}$/.test(input)) {
                        setContact(input);
                      }
                    }}
                    required
                    maxLength="10"
                  />
                </div>
              </>
            )}
            <div>
              <label className="block text-sm font-medium text-left text-gray-700">Email</label>
              <input
                type="email"
                className="w-full p-3 mt-1 border border-gray-300 rounded-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-left text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full p-3 mt-1 border border-gray-300 rounded-md"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordValid(isValidPassword(e.target.value));
                  }}
                  required
                />
                <span
                  className="absolute text-gray-500 cursor-pointer right-3 top-4"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </div>
            </div>
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-left text-gray-700">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="w-full p-3 mt-1 border border-gray-300 rounded-md"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <span
                    className="absolute text-gray-500 cursor-pointer right-3 top-4"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </span>
                </div>
              </div>
            )}
            <button
              type="submit"
              className="flex items-center justify-center w-full py-3 text-white transition bg-blue-600 rounded-md hover:bg-blue-700"
            >
              {isLoading && (
                <svg className="w-5 h-5 mr-2 text-white animate-spin" fill="none" viewBox="0 0 24 24" >
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
              )}
              {isSignUp ? "Sign Up" : "Signin"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              {isSignUp ? (
                <>
                  Already have an account?{" "}
                  <span
                    onClick={() => setIsSignUp(false)}
                    className="text-blue-600 cursor-pointer hover:text-blue-700"
                  >
                    Signin
                  </span>
                </>
              ) : (
                <>
                  Don&apos;t have an account?{" "}
                  <span
                    onClick={() => setIsSignUp(true)}
                    className="text-blue-600 cursor-pointer hover:text-blue-700"
                  >
                    Sign Up
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Login;
