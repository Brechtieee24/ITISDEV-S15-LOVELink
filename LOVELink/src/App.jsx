import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Profile from './components/Profile';
import EditProfile from './components/EditProfile';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
      </Routes>
    </Router>
  );
};

export default App;
