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
    // Fetch rapports data
    axios.get('http://localhost:8088/api/rapports/getall')
      .then(response => {
        const fetchedRapports = response.data.map(rapport => ({
          ...rapport,
          key: rapport.id
        }));
        setRapports(fetchedRapports);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des rapports:', error);
        message.error('Erreur lors de la récupération des rapports');
      });

    // Fetch dossiers data
    axios.get('http://localhost:8088/api/dossiers/getall')
      .then(response => {
        setDossiers(response.data);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des dossiers:', error);
        message.error('Erreur lors de la récupération des dossiers');
      });
  }, []);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleSearchDossiers = (e) => {
    setSearchTextDossiers(e.target.value);
  };

  const handleAddRapport = (values) => {
    const newRapport = {
      ...values,
      rapport_date: values.rapport_date.toISOString(), // Format date to ISO 8601
      dossier: values.dossier, // Send only the dossier ID
    };

    axios.post('http://localhost:8088/api/rapports/create', newRapport)
      .then(response => {
        setRapports([...rapports, { ...response.data, key: response.data.id }]);
        message.success('Rapport ajouté avec succès!');
        handleCancel();
      })
      .catch(error => {
        console.error('Erreur lors de l\'ajout du rapport:', error);
        message.error('Erreur lors de l\'ajout du rapport');
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

  const columnsRapports = [
    {
      title: 'Date de rapport',
      dataIndex: 'rapport_date',
      key: 'rapport_date',
      render: (text) => moment(text).format('DD/MM/YYYY'),
    },
    {
      title: 'Résultats diagnostic',
      dataIndex: 'resultat_diagnostic',
      key: 'resultat_diagnostic',
    },
    {
      title: 'Estimation prix',
      dataIndex: 'estimation_prix',
      key: 'estimation_prix',
    },
    {
      title: 'Adresse de bien',
      dataIndex: 'addresse_bien',
      key: 'addresse_bien',
    },
    {
      title: 'Type de bien',
      dataIndex: 'type_bien',
      key: 'type_bien',
    },
    {
      title: 'Description de bien',
      dataIndex: 'description_bien',
      key: 'description_bien',
    },
    {
      title: 'Dossier',
      dataIndex: 'dossier',
      key: 'dossier',
      render: (dossier) => dossier.numero_dossier,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Space>
          <Button icon={<EyeOutlined />} />
          <Button icon={<EditOutlined />} />
          <Button icon={<DeleteOutlined />} />
        </Space>
      ),
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
            onFinish={handleAddRapport}
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
              name="resultat_diagnostic"
              rules={[{ required: true, message: 'Veuillez entrer les résultats du diagnostic!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Estimation prix"
              name="estimation_prix"
              rules={[{ required: true, message: 'Veuillez entrer l\'estimation du prix!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Adresse de bien"
              name="addresse_bien"
              rules={[{ required: true, message: 'Veuillez entrer l\'adresse de bien!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Type de bien"
              name="type_bien"
              rules={[{ required: true, message: 'Veuillez entrer le type de bien!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Description de bien"
              name="description_bien"
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
                  <Option key={dossier.id} value={dossier.id}>
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
