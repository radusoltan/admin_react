import React from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import { Dasboard } from './components/Dasboard'
import { Login } from './components/Login'
import MainLayout from './components/MainLayout'
import { Categories } from './components/content/category'
import { CategoryArticles } from './components/content/category/CategoryArticles'
import { UserIndex } from './components/management/users'
import { ArticleForm } from './components/content/article/ArticleForm'
import {ImageCropper}  from './components/content/images/imageCropper'
const App = () => {

  
  

  return <Routes>
    <Route path='/' element={<MainLayout/>}>
      <Route index element={<Dasboard/>} />
      <Route path='content/categories' element={<Categories />} />
      <Route path='content/category/:category' element={<CategoryArticles/>} />
      <Route path='content/article/:article' element={<ArticleForm />} />
      <Route path='content/image/:image/edit' element={<ImageCropper />} />
      <Route path='management/users' element={<UserIndex />} />
    </Route>
    <Route path='/login' element={<Login/>} />
  </Routes>
}
export default App
