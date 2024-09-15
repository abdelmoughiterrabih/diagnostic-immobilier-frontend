import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Col, Row, Typography, Button } from 'antd';
import { UserOutlined, CalendarOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const labelStyle = {
  color: '#1890ff', // Couleur bleue d'Ant Design
  fontWeight: 'bold',
};

const titleStyle = {
  fontWeight: 'bold',
  textDecoration: 'underline',
};

const VoirDossier = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { dossier } = location.state || {};

  const handleBack = () => {
    navigate('/dossier');
  };

  if (!dossier) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Title level={3}>Aucun dossier trouvé</Title>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', margin: '0 auto',minHeight:'35rem' }}>
      <Card
        title={<Title level={2} style={titleStyle}>Dossier {dossier.numero_dossier}</Title>}
        bordered={false}
        style={{ width: '100%' }}
        headStyle={{ backgroundColor: '#f0f2f5', borderBottom: '1px solid #e8e8e8' }}
      >
        <Row gutter={16}>
          <Col span={8}>
            <Card>
              <Title level={4} style={titleStyle}>Informations Générales</Title>
              <Text style={labelStyle}>Nom du dossier :</Text> <Text>{dossier.nom}</Text>
              <br />
              <Text style={labelStyle}>Date de dépôt de dossier:</Text> <Text><CalendarOutlined /> {new Date(dossier.date_depo).toLocaleDateString()}</Text>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Title level={4} style={titleStyle}> Service</Title>
              <Text style={labelStyle}>Type de service:</Text> <Text>{dossier.type_service}</Text>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Title level={4} style={titleStyle}>Client</Title>
              <Text style={labelStyle}>Nom:</Text> <Text>{dossier.client.nom} {dossier.client.prenom}</Text>
              <br />
              <Text style={labelStyle}>CIN:</Text> <Text>{dossier.client.cin}</Text>
            </Card>
          </Col>
        </Row>
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <Button type="primary" onClick={handleBack}>
            Retour à la liste des dossiers
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default VoirDossier;
