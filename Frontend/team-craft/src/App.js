import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Signup from './pages/Signup/Signup';
import Login from './pages/Login/Login';
import Team from './pages/Team/Team';

import './App.css';

export default function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login/>}/>
          <Route path="/team" element={<Team/>}/>
        </Routes>
      </Router> 
    </div>
  );
}

// function HomeWithHeaderAndFooter() {
//   return (
//     <>
//     <body>
//       <Header />
//       <Home />
//       <Footer />
//     </body>
      
//     </>
//   );
// }

// function SignupWithoutHeaderAndFooter() {
//   return <Signup />;
// }

// function TeamWithHeaderAndFooter() {
//   return (
//     <>
//       <Header />
//       <Team />
//       <Footer />
//     </>
//   );
// }