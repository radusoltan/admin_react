import { Button, Switch, Spin } from 'antd'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { categorySelector, getArticles } from '../../../features/CategorySlice'

export const CategoryArticles = () => {

  const dispatch = useDispatch()
  const {paginatedArticles,isFetching} = useSelector(categorySelector)
  const {category} = useParams()
  useEffect(()=>{
    dispatch(getArticles(category))
  },[])
  if(isFetching){
    return <Spin />
  }
  return <>
    <Button>add new</Button>
  </>
}
