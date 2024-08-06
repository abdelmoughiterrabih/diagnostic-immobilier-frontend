import React, { useState, useEffect } from 'react';
import { Form, Input, DatePicker, Button, Space, Table, Modal, message, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';

const { Option } = Select;

const Rapport = () => {
  const [form] = Form.useForm();
  const [rapports, setRapports] = useState([]);
  const [dossiers, setDossiers] = useState([]);
  const [editingRapport, setEditingRapport] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchTextDossiers, setSearchTextDossiers] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8088/api/dossiers/getall')
      .then(response => {
        const dossiersWithKey = response.data.map(dossier => ({
          ...dossier,
          key: dossier.id,
        }));
        setDossiers(dossiersWithKey);
      })
      .catch(error => console.error('Erreur lors de la récupération des dossiers:', error));
  }, []);

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
    form.setFieldsValue({
      ...record,
      rapport_date: record.rapport_date && moment(record.rapport_date),
      dossier: { value: record.dossier },
    });
    setIsModalVisible(true);
  };

  const handleDelete = (key) => {
    setRapports(rapports.filter((rapport) => rapport.key !== key));
    message.success('Rapport supprimé avec succès');
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleSearchDossiers = (e) => {
    setSearchTextDossiers(e.target.value);
  };

  const columnsRapports = [
    {
      title: 'Date de rapport',
      dataIndex: 'rapport_date',
      key: 'rapport_date',
      render: (text) => moment(text).format('DD/MM/YYYY'),
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
      title: `Rapport: ${moment(record.rapport_date).format('DD/MM/YYYY')}`,
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
    moment(rapport.rapport_date).format('DD/MM/YYYY').toLowerCase().includes(searchText.toLowerCase())
  );

  const filteredDossiers = dossiers.filter((dossier) =>
    dossier.numero_dossier.toString().toLowerCase().includes(searchTextDossiers.toLowerCase())
  );

  const columnsDossiers = [
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
  ];

  const styles = {
    container: {
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
    },
    section: {
      marginBottom: '24px',
    },
    tableWrapper: {
      backgroundColor: '#fff',
      padding: '24px',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
    searchBar: {
      display: 'flex',
      justifyContent: 'flex-start',
      marginBottom: '16px',
    },
    input: {
      width: '300px',
    },
    tableTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#28a745',
      textAlign: 'center',
      marginBottom: '16px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.section}>
        <div style={styles.tableWrapper}>
          <h2 style={styles.tableTitle}>Liste des Dossiers</h2>
          <div style={styles.searchBar}>
            <Input
              placeholder="Rechercher un dossier"
              prefix={<SearchOutlined />}
              value={searchTextDossiers}
              onChange={handleSearchDossiers}
              style={styles.input}
            />
          </div>
          <Table columns={columnsDossiers} dataSource={filteredDossiers} pagination={false} />
        </div>
      </div>
      <div style={styles.section}>
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
        <Table columns={columnsRapports} dataSource={filteredRapports} />
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
              <Select>
                {dossiers.map((dossier) => (
                  <Option key={dossier.id} value={dossier.numero_dossier}>
                    {dossier.numero_dossier}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                {editingRapport ? 'Modifier' : 'Ajouter'}
              </Button>
              <Button onClick={handleCancel} style={{ marginLeft: '8px' }}>
                Annuler
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default Rapport;
