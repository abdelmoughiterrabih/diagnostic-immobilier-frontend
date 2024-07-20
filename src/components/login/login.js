import React, { useState } from 'react';
import { Form, Input, Button, Layout, Avatar, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './login.css';
import img from '../../assets/photologin.jpg';

const { Content } = Layout;

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (values) => {
    // Here you can add login logic
    console.log('Username:', values.username);
    console.log('Password:', values.password);
  };

  return (
    <Layout>
      <Content>
        <div className="login-container">
          <div className="login-card-wrapper">
            <div className="login-card">
              <div className="login-avatar-container">
                <Avatar
                  size={64}
                  icon={<UserOutlined />}
                  className="login-avatar"
                />
              </div>
              <Form onFinish={handleSubmit} layout="vertical">
                <Form.Item
                  label="Username"
                  name="username"
                  rules={[{ required: true, message: 'Please input your username!' }]}
                >
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"
                  rules={[{ required: true, message: 'Please input your password!' }]}
                >
                  <Input.Password
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    size="large"
                  />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" block size="large">
                    Login
                  </Button>
                </Form.Item>
              </Form>
            </div>
            <div className="login-image-container">
              <img
                src={img}
                alt="Login"
                className="login-image"
              />
            </div>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default LoginForm;