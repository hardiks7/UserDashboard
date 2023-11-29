import React from 'react'
import Dashbord from './components/Dashbord'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Admin from './components/Admin'
import Country from './components/Country'
import State from './components/State'
import City from './components/City'
import User from './components/User'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "react-toastify/dist/ReactToastify.minimal.css";
import Userform from './components/Userform'


function App() {
  return (

    <BrowserRouter>
    <ToastContainer position='top-center' autoClose={1000}
    closeOnClick
    Darkmode
    />
      <Routes>
        <Route path='/' element={<Admin />} />
        <Route path='/dashboard' element={<Dashbord />} />
        <Route path='/country' element={<Country />} />
        <Route path='/state' element={<State />} />
        <Route path='/city' element={<City />} />
        <Route path='/user' element={<User />} />
        <Route path='/userform' element={<Userform />} />
      </Routes>
    </BrowserRouter>


  )
}

export default App
