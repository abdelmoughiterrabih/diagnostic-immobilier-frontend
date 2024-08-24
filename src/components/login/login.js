import React, { useState } from 'react';
import { Form, Input, Button, Layout, Avatar, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './login.css';
import img from '../../assets/photologin.jpg';

const { Content } = Layout;

const Login= () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (values) => {
    // Envoyer les données à l'API de connexion
    axios.post('http://localhost:8088/auth/signin', {
      email: values.username,
      password: values.password
    })
      .then(response => {
        // Si la connexion est réussie, redirige vers le tableau de bord
        const { jwt, role } = response.data;
        localStorage.setItem('token', jwt);
        localStorage.setItem('role', role);
        message.success('Login successful!');
        navigate('/dashboard');  // Assurez-vous que la route '/dashboard' est définie dans votre application
      })
      .catch(error => {
        // Si la connexion échoue, affiche une alerte d'erreur
        message.error('Login failed! Please check your credentials.');
      });
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
<a href='/signup'>cree votre compte </a>
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

export default Login;
