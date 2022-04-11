import React,{useEffect, useState} from 'react'
import { Outlet, useNavigate,Link, NavLink } from 'react-router-dom'
import { Layout, Button, Menu, Select} from 'antd'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons'
import './../App.css'
import { logoutUser, userSelector, fetchLoggedUser } from '../features/UserSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
// import i18next from 'i18next'
import i18n from './../i18n'

const MainLayout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {isError, isSuccess, errorMessage} = useSelector(userSelector)
  const { Header, Sider, Content } = Layout
  const {SubMenu} = Menu
  const {Option} = Select
  const [collapsed,setCollapsed] = useState(false)
  const {t} = useTranslation()
  
  const toggle = () => {
    setCollapsed(!collapsed)
  }

  useEffect(()=>dispatch(fetchLoggedUser()),[])

  useEffect(() => {
    if (isError){
      // dispatch(logoutUser())
      navigate('/login')
    }
  },[isError])

  const handleLogout = ()=>{
    dispatch(logoutUser())
    navigate('/login')
  }
  const changeLang = language => {
    i18n.changeLanguage(language)
  }
  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed} breakpoint="lg">
        <div className="logo" />

        <Menu mode="inline" theme="dark">
          <Menu.Item key="dashboard">
            <Link to="/">{t("menu.dashboard")}</Link>
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
