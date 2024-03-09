import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Signup from './pages/Signup/Signup';
import Login from './pages/Login/Login';

import './App.css';

export default function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<HomeWithHeaderAndFooter />} />
          <Route path="/signup" element={<SignupWithoutHeaderAndFooter />} />
          <Route path="/login" element={<Login/>}/>
        </Routes>
      </Router>
    </div>
  );
}

function HomeWithHeaderAndFooter() {
  return (
    <>
    <body>
      <Header />
      <Home />
      <Footer />
    </body>
      
    </>
  );
}

function SignupWithoutHeaderAndFooter() {
  return <Signup />;
}

// function LoginPage(){
//   return <Login/>;
// }