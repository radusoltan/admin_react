import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Login } from './components/Login'
import { Dashboard } from './components/Dashboard'
import { Private } from './components/Private'
import {Categories} from './components/content/category'
import { ArticleList } from './components/content/category/articleList'
import { ArticleFrom } from './components/content/article/_form'
export const App = () => {
  return <Routes>
    <Route path={'/'} element={<Private />}>
      <Route index element={<Dashboard/>} />
      
      <Route path='content/categories' element={<Categories/>} />
      <Route path='content/category/:category' element={<ArticleList/>} />
      <Route path='content/article/:article' element={<ArticleFrom/>} />
    </Route>
    <Route path={'/login'} element={<Login />} />
  </Routes>
}
