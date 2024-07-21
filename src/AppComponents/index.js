import React, { useEffect, useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import AppRoutes from '../Routes';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

const { Header, Sider, Content } = Layout;


const AppComponent = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKeys,setSelectedKeys]= useState("/");
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navigate = useNavigate();
  useEffect(()=>{
    const pathName = location.pathname;
    setSelectedKeys(pathName);

  },[location.pathname]);

  return (
    <Layout style={{minHeight:'70rem'}}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          onClick={(item)=>{
            navigate(item.key);
          }}
          selectedKeys={[selectedKeys]}
          items={[
            {
              key: '/test1',
              icon: <UserOutlined />,
              label: 'test 1',
            },
            {
              key: '/test2',
              icon: <VideoCameraOutlined />,
              label: 'test 2',
            },
            {
              key: '3',
              icon: <UploadOutlined />,
              label: 'nav 3',
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <AppRoutes/>

        </Content>
      </Layout>
    </Layout>
  );
};
export default AppComponent;