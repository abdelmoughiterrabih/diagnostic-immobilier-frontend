import React, { useState } from 'react';
import { Form, Input, Button, Space, Table, Modal, message, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

const Utilisateur = () => {
  const [form] = Form.useForm();
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  const handleAddEditUser = (values) => {
    if (editingUser) {
      const updatedUsers = users.map((user) =>
        user.key === editingUser.key ? { ...values, key: editingUser.key } : user
      );
      setUsers(updatedUsers);
      message.success('Utilisateur mis à jour avec succès');
    } else {
      const newUser = {
        ...values,
        key: Date.now(),
      };
      setUsers([...users, newUser]);
      message.success('Utilisateur ajouté avec succès');
    }
    form.resetFields();
    setEditingUser(null);
    setIsModalVisible(false);
  };

  const handleEdit = (record) => {
    setEditingUser(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (key) => {
    setUsers(users.filter((user) => user.key !== key));
    message.success('Utilisateur supprimé avec succès');
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
    user.name.toLowerCase().includes(searchText.toLowerCase()) ||
    user.email.toLowerCase().includes(searchText.toLowerCase()) ||
    user.role.toLowerCase().includes(searchText.toLowerCase())
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
