import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Space, Table, Modal, message, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

const Utilisateur = () => {
  const [form] = Form.useForm();
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Fetch user data from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8088/api/utilisateurs/getall');
        const fetchedUsers = response.data.map(user => ({
          key: user.id,
          name: user.nom_utilisateur,
          email: user.address_email,
          role: user.role,
        }));
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('There was an error fetching the users!', error);
        message.error('Erreur lors de la récupération des utilisateurs');
      }
    };
    
    fetchUsers();
  }, []);

  const handleAddEditUser = async (values) => {
    try {
      if (editingUser) {
        // Send a PUT request to update the user
        await axios.put(`http://localhost:8088/api/utilisateurs/${editingUser.key}`, {
          nom_utilisateur: values.name,
          address_email: values.email,
          mot_passe: values.password,
          role: values.role,
        });

        // Update user locally
        const updatedUsers = users.map((user) =>
          user.key === editingUser.key ? { ...values, key: editingUser.key } : user
        );
        setUsers(updatedUsers);
        message.success('Utilisateur mis à jour avec succès');
      } else {
        // Send a POST request to add a new user
        const response = await axios.post('http://localhost:8088/api/utilisateurs/create', {
          nom_utilisateur: values.name,
          address_email: values.email,
          mot_passe: values.password,
          role: values.role,
        });
        
        // Add the new user locally
        const newUser = {
          ...values,
          key: response.data.id, // Assuming the backend returns the ID of the new user
        };
        setUsers([...users, newUser]);
        message.success('Utilisateur ajouté avec succès');
      }
      form.resetFields();
      setEditingUser(null);
      setIsModalVisible(false);
    } catch (error) {
      console.error('There was an error adding/updating the user!', error);
      message.error('Erreur lors de l\'ajout/mise à jour de l\'utilisateur');
    }
  };

  const handleEdit = (record) => {
    setEditingUser(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (key) => {
    Modal.confirm({
      title: 'Êtes-vous sûr de vouloir supprimer cet utilisateur?',
      content: 'Cette action est irréversible.',
      okText: 'Supprimer',
      okType: 'danger',
      cancelText: 'Annuler',
      onOk: async () => {
        try {
          // Send a DELETE request to the API
          await axios.delete(`http://localhost:8088/api/utilisateurs/${key}`);

          // Update the local state to remove the deleted user
          const updatedUsers = users.filter((user) => user.key !== key);
          setUsers(updatedUsers);

          message.success('Utilisateur supprimé avec succès');
        } catch (error) {
          console.error('There was an error deleting the user!', error);
          message.error('Erreur lors de la suppression de l\'utilisateur');
        }
      },
      onCancel() {
        // Optionally handle cancellation here
      },
    });
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const columns = [
    {
      title: 'Nom',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Adresse Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Rôle',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        const roleNames = {
          admin: 'Gestionnaire',
          user: 'Expert',
          guest: 'Coordinatrice',
        };
        return roleNames[role];
      }
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
      title: `Utilisateur: ${record.name}`,
      content: (
        <div>
          <p>Adresse Email: {record.email}</p>
          <p>Rôle: {record.role}</p>
        </div>
      ),
      onOk() {},
    });
  };

  const handleCancel = () => {
    form.resetFields();
    setEditingUser(null);
    setIsModalVisible(false);
  };

  const filteredUsers = users.filter((user) =>
    (user.name && user.name.toLowerCase().includes(searchText.toLowerCase())) ||
    (user.email && user.email.toLowerCase().includes(searchText.toLowerCase())) ||
    (user.role && user.role.toLowerCase().includes(searchText.toLowerCase()))
  );

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
        >
          Ajouter un utilisateur
        </Button>
        <Input
          placeholder="Rechercher un utilisateur"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={handleSearch}
        />
      </Space>
      <Table columns={columns} dataSource={filteredUsers} />
      <Modal
        title={editingUser ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          name="user_form"
          onFinish={handleAddEditUser}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            label="Nom"
            name="name"
            rules={[{ required: true, message: 'Veuillez entrer le nom!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Adresse Email"
            name="email"
            rules={[{ required: true, message: 'Veuillez entrer l\'adresse email!', type: 'email' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Mot de passe"
            name="password"
            rules={[{ required: true, message: 'Veuillez entrer le mot de passe!' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Rôle"
            name="role"
            rules={[{ required: true, message: 'Veuillez sélectionner le rôle!' }]}
          >
            <Select placeholder="Sélectionner un rôle">
              <Option value="admin">Gestionnaire</Option>
              <Option value="user">Expert</Option>
              <Option value="guest">Coordinatrice</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingUser ? 'Mettre à jour' : 'Ajouter'}
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

export default Utilisateur;
