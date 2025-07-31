'use client'

import React from 'react';
import { Modal, Form, Input, InputNumber, Select, Upload, message, UploadFile } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Product } from '@/app/lib/types/products';

const { TextArea } = Input;

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList || [];
};

interface ProductModalProps {
  open: boolean;
  mode: 'create' | 'edit';
  initialValues?: Product | null;
  onCancel: () => void;
  onSubmit: (values: any) => Promise<boolean>;
  loading?: boolean;
}

const ProductModal: React.FC<ProductModalProps> = ({
  open,
  mode,
  initialValues,
  onCancel,
  onSubmit,
  loading = false,
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (open) {
      if (initialValues) {
        form.setFieldsValue({
          ...initialValues,
          product_image: initialValues.product_image 
            ? [{ 
                uid: '-1',
                name: initialValues.product_image.split('/').pop() || 'image',
                status: 'done',
                url: initialValues.product_image
              }]
            : []
        });
      } else {
        form.resetFields();
      }
    }
  }, [initialValues, open, form]);

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Upload failed');
    }
    
    return await response.json();
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      
      let imageUrl = '';
      if (values.product_image && values.product_image.length > 0) {
        const file = values.product_image[0];
        // Jika file baru diupload
        if (file.originFileObj) {
          // Implementasi upload file ke server di sini
          // const uploadedFile = await uploadFile(file.originFileObj);
          // imageUrl = uploadedFile.url;
          message.warning('Upload file belum diimplementasi');
          return;
        } 
        // Jika file sudah ada URL
        else if (file.url) {
          imageUrl = file.url;
        }
      }

      const productData = {
        ...values,
        product_image: imageUrl,
      };

      if (initialValues && mode === 'edit') {
        productData.product_id = initialValues.product_id;
      }

      const success = await onSubmit(productData);
      if (success) {
        onCancel();
      }
    } catch (error) {
      console.log('Validation failed:', error);
      message.error('Harap lengkapi semua field yang wajib diisi.');
    }
  };

  return (
    <Modal
      title={mode === 'create' ? 'Tambah Produk' : 'Edit Produk'}
      centered
      open={open}
      onOk={handleOk}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      confirmLoading={loading}
      okText={mode === 'create' ? 'Simpan' : 'Perbarui'}
      cancelText="Batal"
      width="60%"
    >
      <Form
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
      >
        <Form.Item 
          label="Nama Produk" 
          name="product_title" 
          rules={[{ required: true, message: 'Nama produk wajib diisi' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item 
          label="Harga" 
          name="product_price" 
          rules={[{ required: true, message: 'Harga produk wajib diisi' }]}
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="Deskripsi" name="product_description">
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item 
          label="Gambar" 
          name="product_image" 
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload 
            listType="picture-card"
            maxCount={1}
            beforeUpload={() => false} // Prevent auto upload
          >
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </Upload>
        </Form.Item>
        <Form.Item label="Kategori" name="product_category">
          <Select>
            {[1, 2, 3, 4, 5, 6, 7].map(num => (
              <Select.Option key={num} value={`category ${num}`}>
                Kategori {num}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProductModal;