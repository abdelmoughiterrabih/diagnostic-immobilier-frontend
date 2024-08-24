import React, { useState, useEffect } from 'react';
import { Form, Input, DatePicker, InputNumber, Button, Space, Table, Modal, message, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, SearchOutlined, MailOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import axiosInstance from '../../axiosConfig';

const { TextArea } = Input;
const { Option } = Select;

const Facture = () => {
  const [form] = Form.useForm();
  const [invoices, setInvoices] = useState([]);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [dossiers, setDossiers] = useState([]);

  useEffect(() => {
    // Charger les dossiers et les factures
    axiosInstance.get('/api/dossiers/getall')
      .then(response => {
        setDossiers(response.data);
      })
      .catch(error => {
        message.error('Erreur lors de la récupération des dossiers');
      });

    fetchInvoices();
  }, []);

  const fetchInvoices = () => {
    axiosInstance.get('/api/factures/getall')
      .then(response => {
        setInvoices(response.data);
      })
      .catch(error => {
        message.error('Erreur lors de la récupération des factures');
      });
  };

  const handleAddEditInvoice = (values) => {
    const requestData = {
      numero_facture: values.invoice_number,
      date_facture: values.invoice_date.format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
      montant_facture: values.invoice_amount,
      description: values.invoice_description,
      dossier: values.dossier_id,
    };

    if (editingInvoice) {
      axiosInstance.put(`/api/factures/${editingInvoice.id}`, requestData)
        .then(() => {
          message.success('Facture mise à jour avec succès');
          fetchInvoices();
        })
        .catch(error => {
          message.error(`Erreur lors de la mise à jour de la facture: ${error.response ? error.response.data : error.message}`);
        });
    } else {
      axiosInstance.post('/api/factures/create', requestData)
        .then(() => {
          message.success('Facture ajoutée avec succès');
          fetchInvoices();
        })
        .catch(error => {
          message.error(`Erreur lors de la création de la facture: ${error.response ? error.response.data : error.message}`);
        });
    }

    form.resetFields();
    setEditingInvoice(null);
    setIsModalVisible(false);
  };

  const handleEdit = (record) => {
    setEditingInvoice(record);
    form.setFieldsValue({
      invoice_number: record.numero_facture,
      invoice_date: moment(record.date_facture),
      invoice_amount: record.montant_facture,
      invoice_description: record.description,
      dossier_id: record.dossier,
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Êtes-vous sûr de vouloir supprimer cette facture ?',
      content: 'Cette action est irréversible.',
      okText: 'Supprimer',
      okType: 'danger',
      cancelText: 'Annuler',
      onOk() {
        axiosInstance.delete(`/api/factures/${id}`)
          .then(() => {
            message.success('Facture supprimée avec succès');
            fetchInvoices();
          })
          .catch(error => {
            message.error(`Erreur lors de la suppression de la facture: ${error.response ? error.response.data : error.message}`);
          });
      },
    });
  };

  const handleSend = (id) => {
    axiosInstance.post(`/api/factures/send/${id}`)
      .then(() => {
        message.success('Facture envoyée avec succès');
      })
      .catch(error => {
        message.error(`Erreur lors de l'envoi de la facture: ${error.response ? error.response.data : error.message}`);
      });
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const columns = [
    {
      title: 'Numéro de facture',
      dataIndex: 'numero_facture',
      key: 'numero_facture',
    },
    {
      title: 'Date de facture',
      dataIndex: 'date_facture',
      key: 'date_facture',
      render: (text) => moment(text).format('DD/MM/YYYY'),
    },
    {
      title: 'Montant de facture',
      dataIndex: 'montant_facture',
      key: 'montant_facture',
      render: (amount) => `${amount} €`,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Numéro de dossier',
      dataIndex: 'dossier',
      key: 'dossier',
      render: (dossierId) => {
        const dossier = dossiers.find(d => d.id === dossierId);
        return dossier ? dossier.numero_dossier : 'Inconnu';
      },
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
            onClick={() => handleDelete(record.id)}
            style={{ backgroundColor: '#ff4d4f', color: '#fff' }} // Rouge
          />
          <Button
            icon={<MailOutlined />}
            onClick={() => handleSend(record.id)}
            style={{ backgroundColor: '#faad14', color: '#fff' }} // Jaune
          />
        </Space>
      ),
    },
  ];

  const handleView = (record) => {
    Modal.info({
      title: `Facture: ${record.numero_facture}`,
      content: (
        <div>
          <p>Date: {moment(record.date_facture).format('DD/MM/YYYY')}</p>
          <p>Montant: {record.montant_facture} €</p>
          <p>Description: {record.description}</p>
          <p>Dossier: {dossiers.find(dossier => dossier.id === record.dossier)?.numero_dossier || 'Inconnu'}</p>
        </div>
      ),
      onOk() {},
    });
  };

  const handleCancel = () => {
    form.resetFields();
    setEditingInvoice(null);
    setIsModalVisible(false);
  };

  const filteredInvoices = invoices.filter((invoice) =>
    invoice.numero_facture.toString().includes(searchText)
  );

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
        >
          Ajouter une facture
        </Button>
        <Input
          placeholder="Rechercher une facture"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={handleSearch}
        />
      </Space>
      <Table columns={columns} dataSource={filteredInvoices} rowKey="id" />
      <Modal
        title={editingInvoice ? 'Modifier la facture' : 'Ajouter une facture'}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          name="invoice_form"
          onFinish={handleAddEditInvoice}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            label="Numéro de facture"
            name="invoice_number"
            rules={[{ required: true, message: 'Veuillez entrer le numéro de facture!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Date de facture"
            name="invoice_date"
            rules={[{ required: true, message: 'Veuillez entrer la date de facture!' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label="Montant de facture"
            name="invoice_amount"
            rules={[{ required: true, message: 'Veuillez entrer le montant de facture!' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label="Description"
            name="invoice_description"
            rules={[{ required: true, message: 'Veuillez entrer la description de la facture!' }]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item
            label="Dossier"
            name="dossier_id"
            rules={[{ required: true, message: 'Veuillez sélectionner un dossier!' }]}
          >
            <Select
              showSearch
              style={{ width: '100%', maxHeight: '150px', overflow: 'auto' }}
              placeholder="Sélectionner un dossier"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {dossiers.map(dossier => (
                <Option key={dossier.id} value={dossier.id}>
                  {dossier.numero_dossier}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingInvoice ? 'Mettre à jour' : 'Ajouter'}
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

export default Facture;
