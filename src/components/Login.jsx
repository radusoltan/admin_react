import React,{useEffect} from 'react'
import { Form, Input, Button, Checkbox, Spin } from "antd";
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser,userSelector, clearState } from '../features/UserSlice'
import { useNavigate } from 'react-router-dom'
import toast, { Toaster } from "react-hot-toast"

export const Login = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {isError, isFetching, isSuccess, errorMessage} = useSelector(userSelector)
  const onFinish = (values) => {    
    dispatch(loginUser(values))
  }

  useEffect(()=>dispatch(clearState()),[])

  useEffect(()=>{

    if (isError){
      
      dispatch(clearState())
      toast.error(errorMessage);
    }

    if (isSuccess){
      // dispatch(clearState())
      navigate('/')
    }
    
  },[isError, isSuccess, isFetching])

  if (isFetching) {
    return <Spin />;
  }

  return (
    <>
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Please input your Username!" }]}
        >
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
  );
}
