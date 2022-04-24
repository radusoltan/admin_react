import React, { useState } from 'react'
import { Layout, Menu, Select, Button } from 'antd'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons'
import {
  Link, NavLink,Outlet,useNavigate
} from "react-router-dom"
import { useTranslation } from 'react-i18next'
import i18n from '../i18n'
import { Auth } from '../services/auth'
import toast, { Toaster } from 'react-hot-toast'

export const MainLayout = () => {

  const { Header, Sider, Content } = Layout
  const {SubMenu} = Menu
  const {Option} = Select
  const [collapsed,setCollapsed] = useState(false)
  const {t} = useTranslation()
  const navigate = useNavigate()
  
  const toggle = () => {
    setCollapsed(!collapsed)
  }

  const handleLogout = ()=>{
    Auth.logout(response => {
      if (response.success){
        localStorage.clear()
        toast.success(response.message)
        setTimeout(()=>{
          navigate('/login')
        },2000)
      }
    },err=>{
      localStorage.clear()
      navigate('/login')
      console.log('handle logout error',err)
    })
  }

  const changeLang = language => {
    i18n.changeLanguage(language)
  }

  return <Layout>
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed} 
      breakpoint="lg"
    >
      <Menu mode="inline" theme="dark">
        <Menu.Item key="dashboard">
          <Link to="/">{t('menu.dashboard')}</Link>
        </Menu.Item>
        <SubMenu key="content" title={t("menu.content.head")}>
            <Menu.Item key="content/categories">
              <NavLink to="/content/categories">
                {t("menu.content.categories")}
              </NavLink>
            </Menu.Item>
          </SubMenu>
          <SubMenu key="management" title="Management">
            <Menu.Item key="management/users">
              <Link to="management/users">{t("menu.management.users")}</Link>
            </Menu.Item>
          </SubMenu>
      </Menu>

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
          <Select defaultValue={i18n.language} onChange={changeLang}>
            <Option value="ro">RO</Option>
            <Option value="ru">RU</Option>
            <Option value="en">EN</Option>
          </Select>
        </Header>
        <Content>
          <Outlet />
        </Content>
    </Layout>
    <Toaster />
  </Layout>
}
