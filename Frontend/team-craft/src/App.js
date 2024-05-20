import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Signup from './pages/Signup/Signup';
import Login from './pages/Login/Login';
import Profile from './pages/Profile/Profile';
import Team from './pages/Team/Team';
import Search from './pages/Search/Search';
import CreateTeam from './pages/Create team/Create_team';
import Find from './pages/Find/Find';
import './App.css';

export default function App() {
  return (
    <div className="App">
        <Router>
          <Routes>
            <Route path="/create_team" element={<CreateTeam />} />
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login/>}/>
            <Route path="/team" element={<Team/>}/>
            <Route path="/team/:teamName" element={<Team/>}/>
            <Route path="/profile" element={<Profile/>}/>
            <Route path="/Search" element={<Search/>}/>
            <Route path="/Find" element={<Find/>}/>
          </Routes>
        </Router> 
    </div>
  );
}
