import React from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import { Dasboard } from './components/Dasboard'
import { Login } from './components/Login'
import MainLayout from './components/MainLayout'

const App = () => {

  
  

  return <Routes>
    <Route path='/' element={<MainLayout/>}>
      <Route index element={<Dasboard/>} />
    </Route>
    <Route path='/login' element={<Login/>} />
  </Routes>
}
export default App
