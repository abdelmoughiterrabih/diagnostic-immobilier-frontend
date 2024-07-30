import React, { useState, useEffect } from 'react';
import { Form, Input, DatePicker, Button, Space, Table, Modal, message, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

const Dossier = () => {
  const [form] = Form.useForm();
  const [dossiers, setDossiers] = useState([]);
  const [clients, setClients] = useState([]);
  const [editingDossier, setEditingDossier] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    // Fetch clients
    axios.get('http://localhost:8088/api/clients/getall')
      .then(response => setClients(response.data))
      .catch(error => console.error('Error fetching clients:', error));
  }, []);

  const handleAddEditDossier = (values) => {
    const dossierData = {
      ...values,
      client: selectedClient,
    };

    if (editingDossier) {
      // Update dossier logic
      const updatedDossiers = dossiers.map((dossier) =>
        dossier.key === editingDossier.key ? { ...dossierData, key: editingDossier.key } : dossier
      );
      setDossiers(updatedDossiers);
      message.success('Dossier mis à jour avec succès');
    } else {
      // Add dossier logic
      axios.post('http://localhost:8088/api/dossiers/create', dossierData)
        .then(response => {
          const newDossier = {
            ...response.data,
            key: response.data.id,
          };
          setDossiers([...dossiers, newDossier]);
          message.success('Dossier ajouté avec succès');
        })
        .catch(error => console.error('Error adding dossier:', error));
    }
    form.resetFields();
    setEditingDossier(null);
    setIsModalVisible(false);
  };

  const handleEdit = (record) => {
    setEditingDossier(record);
    form.setFieldsValue(record);
    setSelectedClient(record.client);
    setIsModalVisible(true);
  };

  const handleDelete = (key) => {
    setDossiers(dossiers.filter((dossier) => dossier.key !== key));
    message.success('Dossier supprimé avec succès');
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleClientSelect = (cin) => {
    const client = clients.find(client => client.cin === cin);
    setSelectedClient(client);
  };

  const columns = [
    {
      title: 'Numéro de dossier',
      dataIndex: 'numero_dossier',
      key: 'numero_dossier',
    },
    {
      title: 'Nom de dossier',
      dataIndex: 'nom',
      key: 'nom',
    },
    {
      title: 'Date de dépôt',
      dataIndex: 'date_depo',
      key: 'date_depo',
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: 'Type de service',
      dataIndex: 'type_service',
      key: 'type_service',
    },
    {
      title: 'Client',
      dataIndex: ['client', 'cin'],
      key: 'client',
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
      title: `Dossier: ${record.numero_dossier}`,
      content: (
        <div>
          <p>Nom: {record.nom}</p>
          <p>Date de dépôt: {new Date(record.date_depo).toLocaleDateString()}</p>
          <p>Type de service: {record.type_service}</p>
          <p>Client: {record.client.nom} {record.client.prenom} (CIN: {record.client.cin})</p>
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
    dossier.numero_dossier.toString().toLowerCase().includes(searchText.toLowerCase())
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
            name="numero_dossier"
            rules={[{ required: true, message: 'Veuillez entrer le numéro de dossier!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Nom de dossier"
            name="nom"
            rules={[{ required: true, message: 'Veuillez entrer le nom de dossier!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Date de dépôt"
            name="date_depo"
            rules={[{ required: true, message: 'Veuillez entrer la date de dépôt!' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label="Type de service"
            name="type_service"
            rules={[{ required: true, message: 'Veuillez entrer le type de service!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Client (par CIN)"
            name="client_cin"
            rules={[{ required: true, message: 'Veuillez sélectionner un client!' }]}
          >
            <Select
              showSearch
              placeholder="Sélectionner un client"
              optionFilterProp="children"
              onSelect={handleClientSelect}
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {clients.map(client => (
                <Option key={client.cin} value={client.cin}>{client.cin}</Option>
              ))}
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
