import React, { useState } from 'react';
import { Form, Input, DatePicker, InputNumber, Button, Space, Table, Modal, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const Facture = () => {
  const [form] = Form.useForm();
  const [invoices, setInvoices] = useState([]);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  const handleAddEditInvoice = (values) => {
    if (editingInvoice) {
      const updatedInvoices = invoices.map((invoice) =>
        invoice.key === editingInvoice.key ? { ...values, key: editingInvoice.key } : invoice
      );
      setInvoices(updatedInvoices);
      message.success('Facture mise à jour avec succès');
    } else {
      const newInvoice = {
        ...values,
        key: Date.now(),
      };
      setInvoices([...invoices, newInvoice]);
      message.success('Facture ajoutée avec succès');
    }
    form.resetFields();
    setEditingInvoice(null);
    setIsModalVisible(false);
  };

  const handleEdit = (record) => {
    setEditingInvoice(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (key) => {
    setInvoices(invoices.filter((invoice) => invoice.key !== key));
    message.success('Facture supprimée avec succès');
  };

  const handleSend = (record) => {
    // Ajoutez ici la logique pour envoyer la facture
    message.success(`Facture ${record.invoice_number} envoyée avec succès`);
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const columns = [
    {
      title: 'Numéro de facture',
      dataIndex: 'invoice_number',
      key: 'invoice_number',
    },
    {
      title: 'Date de facture',
      dataIndex: 'invoice_date',
      key: 'invoice_date',
      render: (text) => text.format('DD/MM/YYYY'),
    },
    {
      title: 'Montant de facture',
      dataIndex: 'invoice_amount',
      key: 'invoice_amount',
      render: (amount) => `${amount} €`,
    },
    {
      title: 'Description',
      dataIndex: 'invoice_description',
      key: 'invoice_description',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => handleView(record)} />
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.key)} />
          <Button icon={<PlusOutlined />} onClick={() => handleSend(record)}>
            Envoyer
          </Button>
        </Space>
      ),
    },
  ];

  const handleView = (record) => {
    Modal.info({
      title: `Facture: ${record.invoice_number}`,
      content: (
        <div>
          <p>Date: {record.invoice_date.format('DD/MM/YYYY')}</p>
          <p>Montant: {record.invoice_amount} €</p>
          <p>Description: {record.invoice_description}</p>
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
    invoice.invoice_number.toLowerCase().includes(searchText.toLowerCase())
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
      <Table columns={columns} dataSource={filteredInvoices} />
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
