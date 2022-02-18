import React,{useEffect, useState} from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Layout, Button} from 'antd'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons'
import './../App.css'
import { logoutUser, userSelector, fetchLoggedUser } from '../features/UserSlice'
import { useDispatch, useSelector } from 'react-redux'



const MainLayout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {isError, isSuccess, errorMessage} = useSelector(userSelector)
  const { Header, Sider, Content } = Layout
  
  const [collapsed,setCollapsed] = useState(false)
  
  const toggle = () => {
    setCollapsed(!collapsed)
  }

  useEffect(()=>{
    dispatch(fetchLoggedUser())
  },[])

  useEffect(() => {
    if (isError){
      dispatch(logoutUser())
      navigate('/login')
    }
  },[isError])

  const handleLogout = ()=>{
    dispatch(logoutUser())
    navigate('/login')
  }

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo" />
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }}>
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: toggle,
            }
          )}
          <Button onClick={handleLogout}>Log Out</Button>
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
export default MainLayout
