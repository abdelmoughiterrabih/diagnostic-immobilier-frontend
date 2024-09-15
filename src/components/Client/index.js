import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Space, Table, Modal, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import axiosInstance from '../../axiosConfig';
const Client = () => {
  const [form] = Form.useForm();
  const [clients, setClients] = useState([]);
  const [editingClient, setEditingClient] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axiosInstance.get('/api/clients/getall');
      const clientsWithKeys = response.data.map((client) => ({
        ...client,
        key: client.id,
      }));
      setClients(clientsWithKeys);
    } catch (error) {
      message.error('Erreur lors de la récupération des clients');
    }
  };

  const handleAddEditClient = async (values) => {
    if (editingClient) {
      try {
        await axiosInstance.put(`/api/clients/${editingClient.id}`, values);
        const updatedClients = clients.map((client) =>
          client.id === editingClient.id ? { ...values, key: editingClient.key } : client
        );
        setClients(updatedClients);
        message.success('Client mis à jour avec succès');
      } catch (error) {
        message.error('Erreur lors de la mise à jour du client');
      }
    } else {
      try {
        const response = await axiosInstance.post('/api/clients/create', values);
        const newClient = {
          ...response.data,
          key: response.data.id,
        };
        setClients([...clients, newClient]);
        message.success('Client ajouté avec succès');
      } catch (error) {
        message.error('Erreur lors de l\'ajout du client');
      }
    }
    form.resetFields();
    setEditingClient(null);
    setIsModalVisible(false);
  };

  const handleEdit = (record) => {
    setEditingClient(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (key) => {
    Modal.confirm({
      title: 'Êtes-vous sûr de vouloir supprimer ce client?',
      okText: 'Oui',
      okType: 'danger',
      cancelText: 'Non',
      onOk: async () => {
        try {
          await axiosInstance.delete(`/api/clients/${key}`);
          setClients(clients.filter((client) => client.key !== key));
          message.success('Client supprimé avec succès');
        } catch (error) {
          message.error('Erreur lors de la suppression du client');
        }
      },
    });
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const columns = [
    {
      title: 'CIN',
      dataIndex: 'cin',
      key: 'cin',
    },
    {
      title: 'Nom',
      dataIndex: 'nom',
      key: 'nom',
    },
    {
      title: 'Prénom',
      dataIndex: 'prenom',
      key: 'prenom',
    },
    {
      title: 'Adresse Email',
      dataIndex: 'address_email',
      key: 'address_email',
    },
    {
      title: 'Numéro de Téléphone',
      dataIndex: 'numero_tel',
      key: 'numero_tel',
    },
    {
      title: 'Ville',
      dataIndex: 'ville',
      key: 'ville',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
            style={{ backgroundColor: '#1890ff', color: '#fff' }} // Bleu
          />
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ backgroundColor: '#52c41a', color: '#fff' }} // Vert
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.key)}
            style={{ backgroundColor: '#ff4d4f', color: '#fff' }} // Rouge
          />
        </Space>
      ),
    },
  ];

  const handleView = (record) => {
    Modal.info({
      title: `Client: ${record.cin}`,
      content: (
        <div>
          <p>Nom: {record.nom}</p>
          <p>Prénom: {record.prenom}</p>
          <p>Adresse Email: {record.address_email}</p>
          <p>Numéro de Téléphone: {record.numero_tel}</p>
          <p>Ville: {record.ville}</p>
        </div>
      ),
      onOk() {},
    });
  };

  const handleCancel = () => {
    form.resetFields();
    setEditingClient(null);
    setIsModalVisible(false);
  };

  const filteredClients = clients.filter((client) =>
    client.cin.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div style={{ padding: 24, minHeight: '50rem' }}>
      <Space style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
        >
          Ajouter un client
        </Button>
        <Input
          placeholder="Rechercher un client"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={handleSearch}
        />
      </Space>
      <Table columns={columns} dataSource={filteredClients} />
      <Modal
        title={editingClient ? 'Modifier le client' : 'Ajouter un client'}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          name="client_form"
          onFinish={handleAddEditClient}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            label="CIN"
            name="cin"
            rules={[{ required: true, message: 'Veuillez entrer le CIN!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Nom"
            name="nom"
            rules={[{ required: true, message: 'Veuillez entrer le nom!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Prénom"
            name="prenom"
            rules={[{ required: true, message: 'Veuillez entrer le prénom!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Adresse Email"
            name="address_email"
            rules={[{ required: true, message: 'Veuillez entrer l\'adresse email!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Numéro de Téléphone"
            name="numero_tel"
            rules={[{ required: true, message: 'Veuillez entrer le numéro de téléphone!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Ville"
            name="ville"
            rules={[{ required: true, message: 'Veuillez entrer la ville!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingClient ? 'Mettre à jour' : 'Ajouter'}
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

export default Client;
