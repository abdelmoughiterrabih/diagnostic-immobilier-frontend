import React, { useState, useEffect } from 'react';
import { Calendar, Statistic, Row, Col, Card } from 'antd';
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
      <Row gutter={16}>
        <Col span={8}>
          <Card className="time-card">
            <Statistic
              title={
                <div className="time-title">L'heure actuelle</div>
              }
              value={moment(heureActuelle).format('HH:mm:ss')}
              prefix={<ClockCircleOutlined className="time-icon" />}
              valueStyle={{
                color: '#1890ff',
                fontSize: '48px',
                fontWeight: 'bold',
              }}
            />
          </Card>
        </Col>
        <Col span={16}>
          <Calendar
            className="calendar"
            onPanelChange={onPanelChange}
          />
        </Col>
      </Row>
    </div>
  );
};

export default DashBoard;