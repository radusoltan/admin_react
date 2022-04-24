import { Form, Input,Checkbox, Button } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import React from 'react'
import { Auth } from '../services/auth'
import toast, { Toaster } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export const Login = () => {

  const navigate = useNavigate()

  const handleLogin = values => {

    Auth.login(values, (response) => {
      if(response) {
        
        toast.success(response.message)
        setTimeout(()=>{
          navigate('/')
        },2000)

      } else {
        toast.error(response.message)
      }
    }, (err) => {
      
      toast.error(err.message)
      
    })
  }

  return <>
    <Form
      name="login"
      className='login-form'
      initialValues={{
        remember: true
      }}
      onFinish={handleLogin}
    >
      <Form.Item name="email" rules={[{ required: true, message: "Please input your Username!" }]}>
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="Username"
        />
      </Form.Item>
      <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <a className="login-form-forgot" href="">
            Forgot password
          </a>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Log in
          </Button>
        </Form.Item>

    </Form>
    <Toaster />
  </>
}
