import React from "react";
import { Form, Input, Button, Select, message } from "antd";
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import axios from "axios";
import 'antd/dist/reset.css';
import './index.css';
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const Signup= () => {
    const navigate = useNavigate();
  const onFinish = (values) => {
    // Envoi des données à l'API
    axios.post("http://localhost:8088/auth/signup", values)
      .then(response => {
        message.success('Signup successful!');
        navigate('/login');
      })
      .catch(error => {
        message.error('Signup failed! Please check your inputs.');
      });
  };

  return (
    <div className="signup-container">
      <h2 className="signup-title">Create an Account</h2>
      <Form
        name="signup"
        className="signup-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name="fullName"
          rules={[{ required: true, message: "Please enter your full name!" }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Full Name" />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[
            { type: "email", message: "The input is not a valid email!" },
            { required: true, message: "Please enter your email!" },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please enter your password!" }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>

        <Form.Item
          name="mobile"
          rules={[{ required: true, message: "Please enter your mobile number!" }]}
        >
          <Input prefix={<PhoneOutlined />} placeholder="Mobile Number" />
        </Form.Item>

        <Form.Item
          name="role"
          rules={[{ required: true, message: "Please select your role!" }]}
        >
          <Select placeholder="Select your role">
            <Option value="user">User</Option>
            <Option value="admin">Admin</Option>
          </Select>
        </Form.Item>
<a href="/login">se connecter</a>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="signup-form-button">
            Sign Up
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Signup;
