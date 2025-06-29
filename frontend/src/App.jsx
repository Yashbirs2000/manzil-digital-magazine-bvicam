import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import About from "./components/About";
import Contact from "./components/Contact";
import Login from "./components/Login";
import Subscribe from "./components/Subscribe";
import Articles from "./components/Articles";
import Magazines from "./components/Magazines";


import PaymentPage from "./components/PaymentPage";
import Home from "./components/Home";
import MyCollections from "./components/MyCollections";
import Userdash from "./components/Userdash";
import Events from "./components/Events";
import Current from "./components/Current";
import Archive from "./components/Archive";
import "./App.css"; 





function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen w-full sm:w-[80%] mx-auto bg-white">



        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/About" element={<About />} />
            <Route path="/Contact" element={<Contact />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Subscribe" element={<Subscribe />} />
            <Route path="/Articles" element={<Articles />} />
            
            <Route path="/Magazines" element={<Magazines />} />

            <Route path="/PaymentPage" element={<PaymentPage />} />
            <Route path="/MyCollections" element={<MyCollections />} />
            <Route path="/Userdash" element={<Userdash />} />
            <Route path="/Events" element={<Events />} />
            <Route path="/Current" element={<Current />} />
           <Route path="/Archive" element={<Archive />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
