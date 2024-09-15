import React, { useState, useEffect } from 'react';
import { Statistic, Row, Col, Card, Calendar } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import './index.css';
import axiosInstance from '../../axiosConfig';
const DashBoard = () => {
  const [heureActuelle, setHeureActuelle] = useState(new Date());
  const [FacturesCount, setFacturesetCount] = useState(0);
  const [ClientsCount, setClientsCount] = useState(0);
  const [RapportCount, setRapportCount] = useState(0);
  const [DossierCount, setDossierCount] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
    try {

   
    const [FactureResponse, ClientResponse, RapportResponse , DossierResponse] = await Promise.all([
      axiosInstance.get('/api/factures/getall'),
      axiosInstance.get('api/clients/getall'),
      axiosInstance.get('api/rapports/getall'),
      axiosInstance.get('api/dossiers/getall'),

    ]);
    setFacturesetCount(FactureResponse.data.length);
    setClientsCount(ClientResponse.data.length);
    setRapportCount(RapportResponse.data.length);
    setDossierCount(DossierResponse.data.length);
  }catch (error) {

    console.error('Error fetching data:', error);
  }

};
fetchData();
}, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeureActuelle(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const onPanelChange = (value, mode) => {
    console.log(value.format('YYYY-MM-DD'), mode);
  };

  return (
    <div className="dashboard-container" style={{minHeight: '75rem'}}>
      <Row gutter={16} className="stats-row">
        <Col span={6}>
          <Card className="stats-card" style={{ backgroundColor: '#d3f261' }}>
            <Statistic
              title="Total Factures"
              value={FacturesCount} // Remplacer par des données dynamiques
              valueStyle={{ color: '#52c41a', fontSize: '24px' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="stats-card" style={{ backgroundColor: '#ffd699' }}>
            <Statistic
              title="Total Clients"
              value={ClientsCount} // Remplacer par des données dynamiques
              valueStyle={{ color: '#fa8c16', fontSize: '24px' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="stats-card" style={{ backgroundColor: '#e6f7ff' }}>
            <Statistic
              title="Total Rapports"
              value={RapportCount} // Remplacer par des données dynamiques
              valueStyle={{ color: '#1890ff', fontSize: '24px' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="stats-card" style={{ backgroundColor: '#ffebeb' }}>
            <Statistic
              title="Total Dossiers"
              value={DossierCount} // Remplacer par des données dynamiques
              valueStyle={{ color: '#eb2f96', fontSize: '24px' }}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={16} className="time-row">
        <Col span={24}>
          <Card className="time-card">
            <Statistic
              title="L'heure actuelle"
              value={moment(heureActuelle).format('HH:mm:ss')}
              prefix={<ClockCircleOutlined className="time-icon" />}
              valueStyle={{ color: '#1890ff', fontSize: '36px', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
      </Row>
      <Row className="calendar-row">
        <Col span={24}>
          <Card className="calendar-card"> 
            <Calendar
              className="calendar"
              onPanelChange={onPanelChange}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashBoard;
