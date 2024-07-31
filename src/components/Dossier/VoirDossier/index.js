import React, { useEffect, useState } from 'react';
import { Table, Button, Card } from 'antd';
import axios from 'axios';

const VoirDossier = () => {
  const [dossiers, setDossiers] = useState([]);

  useEffect(() => {
    // Remplacez l'URL par l'URL de votre API
    axios.get('http://localhost:8088/api/dossiers/getall')
      .then(response => {
        setDossiers(response.data);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des dossiers:', error);
      });
  }, []);

  const columns = [
    {
      title: 'Numéro de Dossier',
      dataIndex: 'numero_dossier',
      key: 'numero_dossier',
    },
    {
      title: 'Nom de Dossier',
      dataIndex: 'nom',
      key: 'nom',
    },
    {
      title: 'Date de Dépôt',
      dataIndex: 'date_depo',
      key: 'date_depo',
      render: (text) => new Date(text).toLocaleDateString(), // Formater la date
    },
    {
      title: 'Type de Service',
      dataIndex: 'type_service',
      key: 'type_service',
    },
    {
      title: 'Client',
      dataIndex: ['client', 'nom'], // Accéder au nom du client
      key: 'client_nom',
      render: (text, record) => `${record.client.nom} ${record.client.prenom}`, // Afficher nom et prénom du client
    },
  ];

  const handleBack = () => {
    // Logique pour le bouton de retour, par exemple, naviguer vers une autre page
    console.log('Bouton de retour cliqué');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Card style={{ flex: 1, margin: '20px', padding: '20px' }}>
        <Table dataSource={dossiers} columns={columns} rowKey="id" pagination={false} style={{ height: '100%' }} />
      </Card>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <Button type="primary" onClick={handleBack}>Retour</Button>
      </div>
    </div>
  );
};

export default VoirDossier;
