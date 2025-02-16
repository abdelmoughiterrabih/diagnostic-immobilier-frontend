import React, { useEffect, useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  DashboardOutlined,
  FileTextOutlined, // Utilisé pour "Gestion des dossiers"
  SolutionOutlined,
  TeamOutlined,
  DollarOutlined, // Exemple pour "Gestion des factures"
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import AppRoutes from '../Routes';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'; // Chemin relatif à l'image
import logobg from'../assets/logobg.png';
const { Header, Sider, Content } = Layout;

const AppComponent = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState("/");
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  useEffect(() => {
    const pathName = location.pathname;
    setSelectedKeys(pathName);
  }, [location.pathname]);

  const handleLogout = () => {
   
      localStorage.removeItem('token');
     localStorage.removeItem('role');
    
    navigate('/login'); // Redirigez vers la page de connexion ou autre
  };


  return (
    <Layout style={{ }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        style={{ backgroundColor: '#6439FF' }} // Changer la couleur du Sider
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
              icon: <DashboardOutlined />,
              label: 'DashBoard',
            },
            {
              key: '/Dossier',
              icon: <FileTextOutlined />,
              label: ' Dossiers',
              hidden: !(role.includes("gestionnaire")  || role.includes("admin"))
            },
            {
              key: '/Rapport',
              icon: <SolutionOutlined />,
              label: ' Rapports',
              hidden: !(role.includes("expert") || role.includes("admin"))
            },
            {
              key: '/facture',
              icon: <DollarOutlined />, // Changer ici pour l'icône des factures
              label: ' Factures',
              hidden: !(role.includes("coordinateur")  || role.includes("admin"))
            },
           
            {
              key: '/client',
              icon: <UserOutlined />,
              label: ' clients',
              hidden: !(role.includes("gestionnaire")  || role.includes("admin"))
            },
            {
              key: '/utilisateur',
              icon: <TeamOutlined />,
              label: ' utilisateurs',
              hidden: !role.includes("admin")
            },
          ]}
          style={{ backgroundColor: '#6439FF' }} // Changer la couleur de fond du Menu
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: '#4F75FF', // Changer la couleur de fond du Header
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
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
              marginLeft: 'auto', // Place le bouton de menu repliable à droite
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={logobg} alt="Logo" style={{ height: 64, marginLeft: 16 }} />
          </div>
          
          <div style={{ flex: 1, textAlign: 'center', color: '#fff', fontSize: '20px', fontFamily:'monospace'}}>
            Diagnostic Des Immobiliers
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
