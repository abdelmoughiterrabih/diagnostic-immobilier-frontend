import React, { useState, useEffect } from 'react';
import { Input, Button, Space, Table } from 'antd';
import { EyeOutlined, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ListeDossiers = () => {
  const [dossiers, setDossiers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Récupérer les dossiers
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

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleView = (record) => {
    navigate('/dossier/voir', { state: { dossier: record } });
  };

  const dossiersFiltres = dossiers.filter((dossier) =>
    dossier.numero_dossier.toString().toLowerCase().includes(searchText.toLowerCase())
  );

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
        </Space>
      ),
    },
  ];

  const styles = {
    container: {
      padding: '24px',
      backgroundColor: '#f0f2f5',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    },
    tableWrapper: {
      backgroundColor: '#fff', // Fond blanc pour le conteneur de la table
      padding: '24px',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      width: '80%', // Ajuster la largeur selon vos besoins
    },
    searchBar: {
      display: 'flex',
      justifyContent: 'flex-start',
      marginBottom: '16px',
    },
    input: {
      width: '300px',
    },
    tableContainer: {
      backgroundColor: 'white',
      padding: '16px',
      borderRadius: '8px',
    },
    tableTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#28a745', // Couleur verte
      textAlign: 'center',
      marginBottom: '16px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.tableWrapper}>
        <div style={styles.tableTitle}>Liste des Dossiers</div>
        <div style={styles.searchBar}>
          <Input
            placeholder="Rechercher un dossier"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={handleSearch}
            style={styles.input}
          />
        </div>
        <div style={styles.tableContainer}>
          <Table columns={columns} dataSource={dossiersFiltres} />
        </div>
      </div>
    </div>
  );
};

export default ListeDossiers;
