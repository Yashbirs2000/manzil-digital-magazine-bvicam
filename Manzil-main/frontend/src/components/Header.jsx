import { useState, useEffect } from "react";
import { User, UserCircle } from "lucide-react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Login from "./Login";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    setIsLoggedIn(!!storedUser);
  }, [location]);

  const handleMyProfile = () => navigate("/Userdash");

  return (
    <header className="w-full overflow-x-hidden bg-white shadow-lg">
      {/* Logo Section */}
      <div className="flex items-center justify-between w-full max-w-full px-6 py-4">
        <div className="flex items-center">
          <a href="/home" className="md:hidden">
            <img src="manzillogo.png" alt="Manzil Logo" className="w-30 h-28" />
          </a>
          <a href="/home" className="hidden md:block">
            <img src="BVICAMLogo.png" alt="BVICAM Logo" className="h-32 w-30" />
          </a>
        </div>

        <div className="flex justify-center flex-1">
          <a href="/home">
            <img src="manzillogo.png" alt="Manzil Logo" className="w-30 h-28" />
          </a>
        </div>


        

        <div className="flex-col items-center hidden ml-6 space-x-4 md:flex">
          <div className="flex space-x-4">
            <a href="https://www.facebook.com/people/Bvicam-New-Delhi/100075344976453/" target="_blank" rel="noopener noreferrer">
              <FaFacebook className="w-8 h-8 text-blue-600 transition-all duration-300 hover:text-blue-700" />
            </a>
            <a href="https://x.com/i/flow/login?redirect_after_login=%2FBharatiNews_" target="_blank" rel="noopener noreferrer">
              <FaTwitter className="w-8 h-8 text-black transition-all duration-300 hover:text-gray-700" />
            </a>
            <a href="https://www.instagram.com/ibvicam/?igshid=YmMyMTA2M2Y%3D" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="w-8 h-8 text-pink-500 transition-all duration-300 hover:text-pink-600" />
            </a>
            <a href="https://www.linkedin.com/in/bvicam-new-delhi/" target="_blank" rel="noopener noreferrer">
              <FaLinkedin className="w-8 h-8 text-blue-700 transition-all duration-300 hover:text-blue-800" />
            </a>
          </div>
          <motion.p
            className="mt-2 text-sm text-center text-purple-600"
            animate={{ y: [0, -5, 0] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            Follow us on social media
          </motion.p>
        </div>
      </div>







      {/* Navbar Section */}
      <div className="relative max-w-full py-2 bg-gradient-to-r from-blue-200 to-blue-300">
        <div className="w-full px-12 md:px-12 grid grid-cols-[1fr_auto] items-center">
          <ul className="hidden md:flex space-x-12 text-[22px] font-medium text-black whitespace-nowrap">
            {["Home", "About", "Magazines", "Articles",  "Events", "Archive", "Contact"].map((item) => {
              const path = `/${item.toLowerCase()}`;
              const isActive = location.pathname === path;
              return (
                <a
                  key={item}
                  href={path}
                  className={`px-6 py-3 rounded-full transition-all duration-300 ${
                    isActive
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "text-black hover:bg-blue-500 hover:text-white"
                  }`}
                >
                  {item}
                </a>
              );
            })}
            {!isLoggedIn && (
              <motion.a
                href="/subscribe"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.5 }}
                whileHover={{ scale: 1.1 }}
                className="relative px-4 py-2 m-1 overflow-hidden font-medium text-indigo-600 transition duration-300 border-2 border-indigo-600 rounded-md ease group"
              >
                <span className="absolute w-64 h-0 transition-all duration-300 rotate-45 -translate-x-20 bg-blue-600 top-1/2 ease group-hover:h-64 group-hover:-translate-y-32"></span>
                <span className="relative text-black transition duration-300 ease group-hover:text-white">
                  Subscription
                </span>
              </motion.a>
            )}
          </ul>

          <div className="hidden mr-8 md:block">
            {!isLoggedIn ? (
              <User
                className="text-blue-900 transition-all duration-300 cursor-pointer w-11 h-11 hover:text-blue-500 "
                onClick={() => setShowLogin(true)}
              />
            ) : (
              <button
                onClick={handleMyProfile}
                className="flex items-center gap-2 px-6 py-3 text-white transition-all duration-300 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600"
              >
                <UserCircle className="w-5 h-5" />
                My Profile
              </button>
            )}
          </div>
        </div>












        {/* Mobile Hamburger */}
        <div className="flex justify-end px-4 mt-2 md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="z-50">
            <div className="flex flex-col items-center justify-center w-8 h-8 space-y-1">
              <div
                className={`w-6 h-1 bg-white transition-all duration-300 ${
                  menuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <div
                className={`w-6 h-1 bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
              />
              <div
                className={`w-6 h-1 bg-white transition-all duration-300 ${
                  menuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="bg-white w-[300px] max-w-full h-screen overflow-y-auto p-6 absolute right-0 top-0 transition-transform duration-300 ease-in-out"
            onClick={(e) => e.stopPropagation()}
          >
            <ul className="space-y-4 font-medium text-gray-800">
              {["Home", "About", "Magazines", "Articles", "Current", "Archive", "Events", "Contact"].map((item) => {
                const path = `/${item.toLowerCase()}`;
                return (
                  <li key={item}>
                    <a
                      href={path}
                      className="block px-4 py-2 transition-all duration-300 rounded hover:bg-blue-600 hover:text-white"
                      onClick={() => setMenuOpen(false)}
                    >
                      {item}
                    </a>
                  </li>
                );
              })}
              {!isLoggedIn && (
                <li>
                  <button
                    onClick={() => {
                      setShowLogin(true);
                      setMenuOpen(false);
                    }}
                    className="flex items-center w-full gap-2 px-4 py-2 text-left text-blue-600 transition-all duration-300 hover:text-blue-700 hover:bg-blue-100 "
                  >
                    <User className="w-7 h-7 mr-[5px]" />
                    Login
                  </button>
                </li>
              )}
              {isLoggedIn && (
                <li>
                  <button
                    onClick={() => {
                      handleMyProfile();
                      setMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-white transition-all duration-300 bg-blue-600 rounded hover:bg-blue-700"
                  >
                    <UserCircle className="w-5 h-5" />
                    My Profile
                  </button>
                </li>
              )}
              {!isLoggedIn && (
                <li>
                  <motion.a
                    href="/subscribe"
                    whileHover={{ scale: 1.05 }}
                    className="relative m-1 block overflow-hidden rounded-md border-2 border-indigo-600 px-3.5 py-2 font-medium text-indigo-600 transition duration-300 ease group"
                  >
                    <span className="absolute w-64 h-0 transition-all duration-300 rotate-45 -translate-x-20 bg-indigo-600 top-1/2 ease group-hover:h-64 group-hover:-translate-y-32"></span>
                    <span className="relative text-indigo-600 transition duration-300 ease group-hover:text-white">
                      Subscription
                    </span>
                  </motion.a>
                </li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLogin && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center "
          onClick={() => setShowLogin(false)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="relative w-[750px] max-w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <Login />
          </motion.div>
        </div>
      )}
    </header>
  );
};

export default Header;
