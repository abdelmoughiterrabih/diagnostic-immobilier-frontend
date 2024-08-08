import React, { useState, useEffect } from 'react';
import { Statistic, Row, Col, Card, Calendar } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import './index.css';

const DashBoard = () => {
  const [heureActuelle, setHeureActuelle] = useState(new Date());

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
    <div className="dashboard-container">
      <Row gutter={16} className="stats-row">
        <Col span={6}>
          <Card className="stats-card" style={{ backgroundColor: '#d3f261' }}>
            <Statistic
              title="Total Factures"
              value={120} // Remplacer par des données dynamiques
              valueStyle={{ color: '#52c41a', fontSize: '24px' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="stats-card" style={{ backgroundColor: '#ffd699' }}>
            <Statistic
              title="Total Clients"
              value={85} // Remplacer par des données dynamiques
              valueStyle={{ color: '#fa8c16', fontSize: '24px' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="stats-card" style={{ backgroundColor: '#e6f7ff' }}>
            <Statistic
              title="Total Rapports"
              value={45} // Remplacer par des données dynamiques
              valueStyle={{ color: '#1890ff', fontSize: '24px' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="stats-card" style={{ backgroundColor: '#ffebeb' }}>
            <Statistic
              title="Total Dossiers"
              value={30} // Remplacer par des données dynamiques
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
