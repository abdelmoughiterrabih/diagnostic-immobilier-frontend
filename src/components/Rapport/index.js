import React, { useState, useEffect } from 'react';
import { Form, Input, DatePicker, Button, Space, Table, Modal, message, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import axiosInstance from '../../axiosConfig';
import moment from 'moment';
import { Link } from 'react-router-dom';

const { Option } = Select;
const { TextArea } = Input;

const Rapport = () => {
  const [form] = Form.useForm();
  const [rapports, setRapports] = useState([]);
  const [dossiers, setDossiers] = useState([]);
  const [editingRapport, setEditingRapport] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchRapports();
    fetchDossiers();
  }, []);

  const fetchRapports = () => {
    axiosInstance.get('/api/rapports/getall')
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
  };

  const fetchDossiers = () => {
    axiosInstance.get('/api/dossiers/getall')
      .then(response => {
        setDossiers(response.data);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des dossiers:', error);
        message.error('Erreur lors de la récupération des dossiers');
      });
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleAddRapport = (values) => {
    const newRapport = {
      ...values,
      rapport_date: values.rapport_date.toISOString(),
      dossier: values.dossier, // Dossier ID is included in the request
    };

    axiosInstance.post('/api/rapports/create', newRapport)
      .then(response => {
        message.success('Rapport ajouté avec succès!');
        handleCancel();
        fetchRapports();
      })
      .catch(error => {
        console.error('Erreur lors de l\'ajout du rapport:', error);
        message.error('Erreur lors de l\'ajout du rapport');
      });
  };

  const handleEditRapport = (rapport) => {
    // Find the full dossier object by its ID
    const dossierObject = dossiers.find(dossier => dossier.id === rapport.dossier.id);
  
    // Ensure the dossier object is included in the form values for update
    setEditingRapport(rapport);
    form.setFieldsValue({
      ...rapport,
      rapport_date: moment(rapport.rapport_date),
      dossier: dossierObject // Set the complete dossier object
    });
    setIsModalVisible(true);
  };
  
  const handleUpdateRapport = (values) => {
    const updatedRapport = {
      ...values,
      rapport_date: values.rapport_date.toISOString(),
      dossier: dossiers.find(dossier => dossier.id === values.dossier) // Ensure full dossier object is included
    };
  
    axiosInstance.put(`/api/rapports/${editingRapport.id}`, updatedRapport)
      .then(response => {
        message.success('Rapport mis à jour avec succès!');
        handleCancel();
        fetchRapports();
      })
      .catch(error => {
        console.error('Erreur lors de la mise à jour du rapport:', error);
        message.error('Erreur lors de la mise à jour du rapport');
      });
  };
  

  const handleEditButtonClick = (rapport) => {
    setEditingRapport(rapport);
    form.setFieldsValue({
      ...rapport,
      rapport_date: moment(rapport.rapport_date),
      dossier: rapport.dossier.id,
    });
    setIsModalVisible(true);
  };

  const handleDeleteRapport = (id) => {
    Modal.confirm({
      title: 'Êtes-vous sûr de vouloir supprimer ce rapport?',
      okText: 'Oui',
      okType: 'danger',
      cancelText: 'Non',
      onOk: () => {
        axiosInstance.delete(`/api/rapports/${id}`)
          .then(response => {
            message.success('Rapport supprimé avec succès!');
            fetchRapports();
          })
          .catch(error => {
            console.error('Erreur lors de la suppression du rapport:', error);
            message.error('Erreur lors de la suppression du rapport');
          });
      }
    });
  };

  const handleViewRapport = (rapport) => {
    setEditingRapport(rapport);
    setIsViewModalVisible(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setEditingRapport(null);
    setIsModalVisible(false);
    setIsViewModalVisible(false);
  };

  const filteredRapports = rapports.filter((rapport) =>
    moment(rapport.rapport_date).format('DD/MM/YYYY').toLowerCase().includes(searchText.toLowerCase())
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
          <Button icon={<EyeOutlined />} onClick={() => handleViewRapport(record)} />
          <Button icon={<EditOutlined />} onClick={() => handleEditButtonClick(record)} />
          <Button icon={<DeleteOutlined />} onClick={() => handleDeleteRapport(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ marginBottom: '24px' }}>
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
          <Link to="/Dossier/ListeDossier">
            <Button style={{ backgroundColor: '#28a745', color: 'white' }}>
              Liste des dossiers
            </Button>
          </Link>
        </Space>
        <Table columns={columnsRapports} dataSource={filteredRapports} />

        {/* Add/Edit Modal */}
        <Modal
          title={editingRapport ? 'Modifier le rapport' : 'Ajouter un rapport'}
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null}
        >
          <Form
            form={form}
            name="rapport_form"
            onFinish={editingRapport ? handleUpdateRapport : handleAddRapport}
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
              <TextArea rows={4} />
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
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item
              label="Dossier"
              name="dossier"
              rules={[{ required: true, message: 'Veuillez sélectionner un dossier!' }]}
            >
              <Select disabled={!!editingRapport}>
                {dossiers.map((dossier) => (
                 
                 <Option key={dossier.id} value={dossier.id}>
                 {dossier.numero_dossier}
               </Option>
             ))}
           </Select>
         </Form.Item>
         <Form.Item>
           <Button type="primary" htmlType="submit" style={{ marginRight: '10px' }}>
             {editingRapport ? 'Mettre à jour' : 'Ajouter'}
           </Button>
           <Button onClick={handleCancel}>
             Annuler
           </Button>
         </Form.Item>
       </Form>
     </Modal>

     {/* View Modal */}
     <Modal
       title="Détails du rapport"
       visible={isViewModalVisible}
       onCancel={handleCancel}
       footer={null}
     >
       {editingRapport && (
         <div>
           <p><strong>Date de rapport:</strong> {moment(editingRapport.rapport_date).format('DD/MM/YYYY')}</p>
           <p><strong>Résultats diagnostic:</strong> {editingRapport.resultat_diagnostic}</p>
           <p><strong>Estimation prix:</strong> {editingRapport.estimation_prix}</p>
           <p><strong>Adresse de bien:</strong> {editingRapport.addresse_bien}</p>
           <p><strong>Type de bien:</strong> {editingRapport.type_bien}</p>
           <p><strong>Description de bien:</strong> {editingRapport.description_bien}</p>
           <p><strong>Dossier:</strong> {editingRapport.dossier.numero_dossier}</p>
         </div>
       )}
     </Modal>
   </div>
 </div>
);
};

export default Rapport;
