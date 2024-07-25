import React, { useState } from 'react';
import { Form, Input, DatePicker, Button, Space, Table, Modal, message, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

const Dossier = () => {
  const [form] = Form.useForm();
  const [dossiers, setDossiers] = useState([]);
  const [editingDossier, setEditingDossier] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  const handleAddEditDossier = (values) => {
    if (editingDossier) {
      const updatedDossiers = dossiers.map((dossier) =>
        dossier.key === editingDossier.key ? { ...values, key: editingDossier.key } : dossier
      );
      setDossiers(updatedDossiers);
      message.success('Dossier mis à jour avec succès');
    } else {
      const newDossier = {
        ...values,
        key: Date.now(),
      };
      setDossiers([...dossiers, newDossier]);
      message.success('Dossier ajouté avec succès');
    }
    form.resetFields();
    setEditingDossier(null);
    setIsModalVisible(false);
  };

  const handleEdit = (record) => {
    setEditingDossier(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (key) => {
    setDossiers(dossiers.filter((dossier) => dossier.key !== key));
    message.success('Dossier supprimé avec succès');
  };

  const handleSend = (record) => {
    // Ajoutez ici la logique pour envoyer le dossier
    message.success(`Dossier ${record.dossier_number} envoyé avec succès`);
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const columns = [
    {
      title: 'Numéro de dossier',
      dataIndex: 'dossier_number',
      key: 'dossier_number',
    },
    {
      title: 'Nom de dossier',
      dataIndex: 'dossier_name',
      key: 'dossier_name',
    },
    {
      title: 'Date de dépôt',
      dataIndex: 'dossier_date',
      key: 'dossier_date',
      render: (text) => text.format('DD/MM/YYYY'),
    },
    {
      title: 'Type de service',
      dataIndex: 'service_type',
      key: 'service_type',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => handleView(record)} />
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.key)} />
          <Button icon={<PlusOutlined />} onClick={() => handleSend(record)}>
            Envoyer
          </Button>
        </Space>
      ),
    },
  ];

  const handleView = (record) => {
    Modal.info({
      title: `Dossier: ${record.dossier_number}`,
      content: (
        <div>
          <p>Nom: {record.dossier_name}</p>
          <p>Date de dépôt: {record.dossier_date.format('DD/MM/YYYY')}</p>
          <p>Type de service: {record.service_type}</p>
        </div>
      ),
      onOk() {},
    });
  };

  const handleCancel = () => {
    form.resetFields();
    setEditingDossier(null);
    setIsModalVisible(false);
  };

  const filteredDossiers = dossiers.filter((dossier) =>
    dossier.dossier_number.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
        >
          Ajouter un dossier
        </Button>
        <Input
          placeholder="Rechercher un dossier"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={handleSearch}
        />
      </Space>
      <Table columns={columns} dataSource={filteredDossiers} />
      <Modal
        title={editingDossier ? 'Modifier le dossier' : 'Ajouter un dossier'}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          name="dossier_form"
          onFinish={handleAddEditDossier}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            label="Numéro de dossier"
            name="dossier_number"
            rules={[{ required: true, message: 'Veuillez entrer le numéro de dossier!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Nom de dossier"
            name="dossier_name"
            rules={[{ required: true, message: 'Veuillez entrer le nom de dossier!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Date de dépôt"
            name="dossier_date"
            rules={[{ required: true, message: 'Veuillez entrer la date de dépôt!' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label="Type de service"
            name="service_type"
            rules={[{ required: true, message: 'Veuillez sélectionner le type de service!' }]}
          >
            <Select style={{ width: '100%' }}>
              <Option value="service1">Service 1</Option>
              <Option value="service2">Service 2</Option>
              <Option value="service3">Service 3</Option>
              <Option value="service4">Service 4</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingDossier ? 'Mettre à jour' : 'Ajouter'}
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

export default Dossier;
