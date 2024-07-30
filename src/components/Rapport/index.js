import React, { useState } from 'react';
import { Form, Input, DatePicker, Button, Space, Table, Modal, message, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

const Rapport = () => {
  const [form] = Form.useForm();
  const [rapports, setRapports] = useState([]);
  const [dossiers, setDossiers] = useState([
    { key: 1, name: 'Dossier 1' },
    { key: 2, name: 'Dossier 2' },
    { key: 3, name: 'Dossier 3' },
    { key: 4, name: 'Dossier 4' },
    { key: 5, name: 'Dossier 5' },
    { key: 6, name: 'Dossier 6' },
    { key: 7, name: 'Dossier 7' },
    { key: 8, name: 'Dossier 8' },
    { key: 9, name: 'Dossier 9' },
    { key: 10, name: 'Dossier 10' },
    // Ajoutez autant de dossiers que nécessaire
  ]);
  const [editingRapport, setEditingRapport] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  const handleAddEditRapport = (values) => {
    if (editingRapport) {
      const updatedRapports = rapports.map((rapport) =>
        rapport.key === editingRapport.key ? { ...values, key: editingRapport.key } : rapport
      );
      setRapports(updatedRapports);
      message.success('Rapport mis à jour avec succès');
    } else {
      const newRapport = {
        ...values,
        key: Date.now(),
      };
      setRapports([...rapports, newRapport]);
      message.success('Rapport ajouté avec succès');
    }
    form.resetFields();
    setEditingRapport(null);
    setIsModalVisible(false);
  };

  const handleEdit = (record) => {
    setEditingRapport(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (key) => {
    setRapports(rapports.filter((rapport) => rapport.key !== key));
    message.success('Rapport supprimé avec succès');
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const columns = [
    {
      title: 'Date de rapport',
      dataIndex: 'rapport_date',
      key: 'rapport_date',
      render: (text) => text.format('DD/MM/YYYY'),
    },
    {
      title: 'Résultats diagnostic',
      dataIndex: 'diagnostic_result',
      key: 'diagnostic_result',
    },
    {
      title: 'Estimation prix',
      dataIndex: 'price_estimation',
      key: 'price_estimation',
    },
    {
      title: 'Adresse de bien',
      dataIndex: 'property_address',
      key: 'property_address',
    },
    {
      title: 'Type de bien',
      dataIndex: 'property_type',
      key: 'property_type',
    },
    {
      title: 'Description de bien',
      dataIndex: 'property_description',
      key: 'property_description',
    },
    {
      title: 'Dossier',
      dataIndex: 'dossier',
      key: 'dossier',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => handleView(record)} />
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.key)} />
        </Space>
      ),
    },
  ];

  const handleView = (record) => {
    Modal.info({
      title: `Rapport: ${record.rapport_date.format('DD/MM/YYYY')}`,
      content: (
        <div>
          <p>Résultats diagnostic: {record.diagnostic_result}</p>
          <p>Estimation prix: {record.price_estimation}</p>
          <p>Adresse de bien: {record.property_address}</p>
          <p>Type de bien: {record.property_type}</p>
          <p>Description de bien: {record.property_description}</p>
          <p>Dossier: {record.dossier}</p>
        </div>
      ),
      onOk() {},
    });
  };

  const handleCancel = () => {
    form.resetFields();
    setEditingRapport(null);
    setIsModalVisible(false);
  };

  const filteredRapports = rapports.filter((rapport) =>
    rapport.rapport_date.format('DD/MM/YYYY').toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
        >
          Ajouter un rapport
        </Button>
        <Input
          placeholder="Rechercher un rapport"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={handleSearch}
        />
      </Space>
      <Table columns={columns} dataSource={filteredRapports} />
      <Modal
        title={editingRapport ? 'Modifier le rapport' : 'Ajouter un rapport'}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          name="rapport_form"
          onFinish={handleAddEditRapport}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            label="Date de rapport"
            name="rapport_date"
            rules={[{ required: true, message: 'Veuillez entrer la date de rapport!' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label="Résultats diagnostic"
            name="diagnostic_result"
            rules={[{ required: true, message: 'Veuillez entrer les résultats du diagnostic!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Estimation prix"
            name="price_estimation"
            rules={[{ required: true, message: 'Veuillez entrer l\'estimation du prix!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Adresse de bien"
            name="property_address"
            rules={[{ required: true, message: 'Veuillez entrer l\'adresse de bien!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Type de bien"
            name="property_type"
            rules={[{ required: true, message: 'Veuillez entrer le type de bien!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Description de bien"
            name="property_description"
            rules={[{ required: true, message: 'Veuillez entrer la description de bien!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Dossier"
            name="dossier"
            rules={[{ required: true, message: 'Veuillez sélectionner un dossier!' }]}
          >
            <Select placeholder="Sélectionner un dossier">
              {dossiers.map(dossier => (
                <Option key={dossier.key} value={dossier.name}>{dossier.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingRapport ? 'Mettre à jour' : 'Ajouter'}
              </Button>
              <Button type="default" onClick={handleCancel}>
                Annuler
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Rapport;
