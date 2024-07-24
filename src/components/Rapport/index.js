import React, { useState } from 'react';
import { Form, Input, DatePicker, InputNumber, Select, Button, Space, Row, Col, Card } from 'antd';

const { TextArea } = Input;
const { Option } = Select;

const Rapport = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Received values of form:', values);
  };

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Row justify="center" style={{ width: '100%', padding: '30px' }}>
        <Col xs={24} sm={20} md={16} lg={12} xl={10}>
          <Card
            title={<span style={{ color: '#00A5CF' }}>Rapport de Diagnostic</span>}
            bordered={false}
            style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px', backgroundColor: '#fff' }}
          >
            <Form form={form} name="property_form" onFinish={onFinish} autoComplete="off" layout="vertical">
              <Form.Item
                label="Date du rapport"
                name="report_date"
                rules={[{ required: true, message: 'Veuillez entrer la date du rapport!' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                label="Résultats du diagnostic"
                name="diagnostic_results"
                rules={[{ required: true, message: 'Veuillez entrer les résultats du diagnostic!' }]}
              >
                <Input style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                label="Estimation du prix"
                name="price_estimate"
                rules={[{ required: true, message: 'Veuillez entrer l\'estimation du prix!' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                label="Adresse du bien"
                name="property_address"
                rules={[{ required: true, message: 'Veuillez entrer l\'adresse du bien!' }]}
              >
                <Input style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                label="Type de bien"
                name="property_type"
                rules={[{ required: true, message: 'Veuillez sélectionner le type de bien!' }]}
              >
                <Select style={{ width: '100%' }}>
                  <Option value="maison">Maison</Option>
                  <Option value="appartement">Appartement</Option>
                  <Option value="terrain">Terrain</Option>
                  <Option value="autre">Autre</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Description du bien"
                name="property_description"
                rules={[{ required: true, message: 'Veuillez entrer la description du bien!' }]}
              >
                <TextArea rows={4} style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    style={{ backgroundColor: '#00A5CF', borderColor: '#00A5CF', color: '#fff' }}
                  >
                    Envoyer
                  </Button>
                  <Button type="default" onClick={() => form.resetFields()}>
                    Réinitialiser
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Rapport;
