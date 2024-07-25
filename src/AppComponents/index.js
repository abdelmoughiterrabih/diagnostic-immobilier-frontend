import React, { useEffect, useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import AppRoutes from '../Routes';
import { useLocation, useNavigate } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const AppComponent = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState("/");
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navigate = useNavigate();

  useEffect(() => {
    const pathName = location.pathname;
    setSelectedKeys(pathName);
  }, [location.pathname]);

  const handleLogout = () => {
    // Ajoutez la logique de déconnexion ici, par exemple :
    navigate('/login'); // Redirigez vers la page de connexion ou autre
  };

  return (
    <Layout style={{ minHeight: '70rem' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        style={{ backgroundColor: '#00A5CF' }} // Changer la couleur du Sider
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark" // Vous pouvez changer cela en "light" si vous préférez un thème clair
          mode="inline"
          defaultSelectedKeys={['1']}
          onClick={(item) => {
            navigate(item.key);
          }}
          selectedKeys={[selectedKeys]}
          items={[
            {
              key: '/dashboard',
              icon: <UserOutlined />,
              label: 'DashBoard',
            },
            {
              key: '/Dossier',
              icon: <UploadOutlined />,
              label: 'Gestion des dossiers',
            },
            {
              key: '/Rapport',
              icon: <UploadOutlined />,
              label: 'Gestion des Rapports',
            },
            {
              key: '/facture',
              icon: <UploadOutlined />,
              label: 'Gestion des Factures',
            },
            {
              key: '/utilisateur',
              icon: <UploadOutlined />,
              label: 'Gestion des utilisateurs',
            },
          ]}
          style={{ backgroundColor: '#00A5CF' }} // Changer la couleur de fond du Menu
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: '#00A5CF', // Changer la couleur de fond du Header
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
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
              color: '#fff', // Assurez-vous que la couleur de l'icône contraste bien
            }}
          />
          <div style={{ flex: 1, textAlign: 'center', color: '#fff', fontSize: '20px' }}>
            Diagnostic des Immobiliers
          </div>
          <Button
            type="primary" // Utilisez le type "primary" pour un bouton avec une couleur de fond définie
            onClick={handleLogout}
            style={{
              marginRight: 16, // Ajouter un peu d'espace à droite
              backgroundColor: '#00A5CF', // Couleur de fond du bouton
              borderColor: '#00A5CF', // Couleur de la bordure du bouton
              color: '#fff', // Couleur du texte du bouton
            }}
          >
            Déconnexion
          </Button>
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
          <AppRoutes />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppComponent;
