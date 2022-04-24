import React from 'react'
import { useNavigate } from "react-router-dom"
import { MainLayout } from './MainLayout'
import { Auth } from '../services/auth'

export const Private = () => {

  const navigate = useNavigate()
  
  Auth.checkAuth(r=>{},e=>{
    navigate('/login')    
  })

  return <MainLayout />
}
