import React, { useEffect, useState } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Lead from './pages/lead';
import Login from './pages/login';
import Overview from './pages/overview';
import SessionTimeOut from './pages/sessionTimeOut';

function App() {

  const updateUsers = (updatedUser) => {
    const users = JSON.parse(localStorage.getItem('users'));
    const updatedUsers = users.map( user => updatedUser?.id == user?.id ? updatedUser : user);

    localStorage.setItem('users', JSON.stringify(updatedUsers))
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/session-expired" element={<SessionTimeOut/>} />
          <Route path="/lead" element={<Lead updateUsers={updateUsers}/>} />
          <Route path="/overview" element={<Overview />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
