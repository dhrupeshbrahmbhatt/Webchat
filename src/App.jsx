import './index.css'
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { Signup } from "./pages/Signup";
import { Signin } from "./pages/Signin";
import { Home } from './pages/Home';
import { Room } from './Components/Room';
import P2PTest from './components/P2PTest';
import { LOGO } from './Components/LOGO';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* <Route path="/docs" element={<DocsPage />} />
        <Route path="/rewards" element={<RewardsPage />} />
        <Route path="/security" element={<SecurityPage />} /> */}
        <Route path="/room/:name" element={<Room />} />
        <Route path="/dashboard" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/p2p-test" element={<P2PTest />} />
        <Route path='/logo' element={<LOGO />} />
      </Routes>
    </Router>
  );
}

export default App;