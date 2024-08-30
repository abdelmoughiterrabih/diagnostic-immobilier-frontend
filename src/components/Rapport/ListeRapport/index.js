import React, { useState, useEffect } from 'react';
import { Table, Card, Descriptions, Button, Modal, message } from 'antd';
import axiosInstance from '../../../axiosConfig';
import moment from 'moment';
import { useNavigate } from 'react-router-dom'; // Importer useNavigate

const ListeRapport = () => {
  const [rapports, setRapports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRapport, setSelectedRapport] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const navigate = useNavigate(); // Initialiser useNavigate

  useEffect(() => {
    const fetchRapports = async () => {
      try {
        const response = await axiosInstance.get('/api/rapports/getall');
        console.log('Données reçues:', response.data);

        if (response.status === 200) {
          setRapports(response.data);
          message.success('Données des rapports récupérées avec succès');
        } else {
          message.error('Erreur lors de la récupération des rapports');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des rapports:', error);
        message.error('Erreur lors de la récupération des rapports');
      } finally {
        setLoading(false);
      }
    };

    fetchRapports();
  }, []);

  const columns = [
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
  ];

  const showModal = (rapport) => {
    setSelectedRapport(rapport);
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
    setSelectedRapport(null);
  };

  const handleBackToFacture = () => {
    navigate('/facture'); // Redirection vers la page des factures
  };

  return (
    <Card title="Liste des Rapports" style={{ margin: '24px' }}>
      <Table
        dataSource={rapports}
        columns={columns}
        rowKey={(record) => record.id} // Assurez-vous que chaque rapport a un champ `id`
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Détails du Rapport"
        visible={modalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        {selectedRapport && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Titre">{selectedRapport.title}</Descriptions.Item>
            <Descriptions.Item label="Description">{selectedRapport.description}</Descriptions.Item>
            <Descriptions.Item label="Date de création">
              {new Date(selectedRapport.creationDate).toLocaleDateString()}
            </Descriptions.Item>
            <Descriptions.Item label="Statut">{selectedRapport.status}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      <Button
        type="primary"
        onClick={handleBackToFacture}
        style={{ backgroundColor: 'green', borderColor: 'green', marginTop: '16px' }}
      >
        Retour à Facture
      </Button>
    </Card>
  );
};

export default ListeRapport;
