import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Space, Table, Modal, message, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import axiosInstance from '../../axiosConfig';
import { useNavigate } from "react-router-dom";
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
const { Option } = Select;

const Utilisateur = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Fetch user data from the API
  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('/api/utilisateurs/getall');
      const fetchedUsers = response.data.map(user => ({
        key: user.id,
        name: user.fullName,
        email: user.email,
        role: user.role,
      }));
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('There was an error fetching the users!', error);
      message.error('Erreur lors de la récupération des utilisateurs');
    }
  };

  // Fetch user data when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);
   
  const onFinish = (values) => {
    // Envoi des données à l'API
    axiosInstance.post("/auth/signup", values)
      .then(response => {
        message.success('Utilisateur ajouté avec succès !');
  
        // Recharger la liste des utilisateurs
        fetchUsers();
  
        // Réinitialiser le formulaire et fermer la modale
        form.resetFields();
        setIsModalVisible(false);
      })
      .catch(error => {
        message.error('Erreur lors de l\'ajout de l\'utilisateur. Veuillez vérifier vos informations.');
      });
  };
  
  const handleAddEditUser = async (values) => {
    try {
      if (editingUser) {
        // Send a PUT request to update the user
        await axiosInstance.put(`/api/utilisateurs/${editingUser.key}`, {
          fullName: values.fullName,
          email: values.email,
          password: values.password,
          mobile: values.mobile,
          role: values.role,
        });
  
        // Update user locally
        const updatedUsers = users.map((user) =>
          user.key === editingUser.key ? { ...values, key: editingUser.key } : user
        );
        setUsers(updatedUsers);
        message.success('Utilisateur mis à jour avec succès');
      } else {
        // Handle the creation of a new user if needed
        onFinish(values);
      }
  
      // Reset form and close modal
      form.resetFields();
      setEditingUser(null);
      setIsModalVisible(false);
    } catch (error) {
      console.error('There was an error updating the user!', error);
      message.error('Erreur lors de la mise à jour de l\'utilisateur');
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
          await axiosInstance.delete(`/api/utilisateurs/${key}`);

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
        name="signup"
        className="signup-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name="fullName"
          rules={[{ required: true, message: "Please enter your full name!" }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Full Name" />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[
            { type: "email", message: "The input is not a valid email!" },
            { required: true, message: "Please enter your email!" },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please enter your password!" }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>

        <Form.Item
          name="mobile"
          rules={[{ required: true, message: "Please enter your mobile number!" }]}
        >
          <Input prefix={<PhoneOutlined />} placeholder="Mobile Number" />
        </Form.Item>

        <Form.Item
          name="role"
          rules={[{ required: true, message: "Please select your role!" }]}
        >
          <Select placeholder="Select your role">
            <Option value="user">User</Option>
            <Option value="admin">Admin</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="signup-form-button">
            creer
          </Button>
        </Form.Item>
      </Form>
      </Modal>
    </div>
  );
};

export default Utilisateur;
