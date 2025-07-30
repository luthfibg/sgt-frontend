'use client'

import React, { useState } from 'react';
import { Flex, Button, Table, message, Modal, Form, Input, InputNumber, Select, Upload } from 'antd';
import { useProducts } from '@/app/lib/hooks/useProducts';
import { getProductColumns } from '@/app/lib/configs/productTableConfig';
import { Product } from '@/app/lib/types/products';
import { PlusOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const ProductPage = () => {
    const { products, loading, error, deleteProduct } = useProducts();
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [open, setOpen] = useState(false);

    // Handle view product
    const handleView = (product: Product) => {
        setSelectedProduct(product);
        setIsViewModalVisible(true);
    };

    // Handle edit product
    const handleEdit = (product: Product) => {
        // TODO: Implement edit modal or navigate to edit page
        message.info(`Edit product: ${product.product_title}`);
        console.log('Edit product:', product);
    };

    // Handle delete product
    const handleDelete = (product: Product) => {
        Modal.confirm({
            title: 'Hapus Produk',
            content: `Apakah Anda yakin ingin menghapus produk "${product.product_title}"?`,
            okText: 'Ya, Hapus',
            okType: 'danger',
            cancelText: 'Batal',
            onOk: async () => {
                const success = await deleteProduct(product.product_id);
                if (success) {
                    message.success('Produk berhasil dihapus');
                } else {
                    message.error('Gagal menghapus produk');
                }
            },
        });
    };

    // Handle create product
    const handleCreate = () => {
        // TODO: Implement create modal or navigate to create page
        message.info('Fitur tambah produk akan segera tersedia');
    };

    // Show error message if exists
    if (error) {
        message.error(error);
    }

    // Table columns configuration
    const columns = getProductColumns({
        onView: handleView,
        onEdit: handleEdit,
        onDelete: handleDelete,
    });

    return (
        <div style={{ padding: '24px' }}>
            <Flex vertical gap="middle">
                {/* Header Actions */}
                <Flex justify="space-between" align="center">
                    <h1 style={{ margin: 0 }}>Manajemen Produk</h1>
                    <Button 
                        type="primary" 
                        size="large"
                        onClick={() => setOpen(true)}
                    >
                        Tambah Produk
                    </Button>
                    <Modal
                        title="Tambah Produk"
                        centered
                        open={open}
                        onOk={() => setOpen(false)}
                        onCancel={() => setOpen(false)}
                        okText="Simpan"
                        cancelText="Batal"
                        width={{
                        xs: '90%',
                        sm: '80%',
                        md: '70%',
                        lg: '60%',
                        xl: '50%',
                        xxl: '40%',
                        }}
                    >
                        <Form
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 14 }}
                            layout="horizontal"
                            style={{ maxWidth: 600 }}
                        >
                            <Form.Item label="Nama Produk">
                                <Input />
                            </Form.Item>
                            <Form.Item label="Harga">
                                <InputNumber />
                            </Form.Item>
                            <Form.Item label="Deskripsi">
                                <TextArea rows={4} />
                            </Form.Item>
                            <Form.Item label="Upload" valuePropName="fileList" getValueFromEvent={normFile}>
                                <Upload action="/upload.do" listType="picture-card">
                                    <button
                                    style={{ color: 'inherit', cursor: 'inherit', border: 0, background: 'none' }}
                                    type="button"
                                    >
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                    </button>
                                </Upload>
                            </Form.Item>
                            <Form.Item label="Kategori">
                                <Select>
                                    <Select.Option value="category 1">Kategori 1</Select.Option>
                                    <Select.Option value="category 2">Kategori 2</Select.Option>
                                    <Select.Option value="category 3">Kategori 3</Select.Option>
                                    <Select.Option value="category 4">Kategori 4</Select.Option>
                                    <Select.Option value="category 5">Kategori 5</Select.Option>
                                    <Select.Option value="category 6">Kategori 6</Select.Option>
                                    <Select.Option value="category 7">Kategori 7</Select.Option>
                                </Select>
                            </Form.Item>
                        </Form>
                    </Modal>
                </Flex>

                {/* Products Table */}
                <Table<Product>
                    columns={columns}
                    dataSource={products}
                    rowKey="product_id"
                    loading={loading}
                    pagination={{
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) => 
                            `${range[0]}-${range[1]} dari ${total} produk`,
                        pageSize: 10,
                        pageSizeOptions: ['10', '20', '50', '100'],
                    }}
                    scroll={{ x: 1200 }}
                    size="middle"
                />

                {/* View Product Modal */}
                <Modal
                    title={`Detail Produk: ${selectedProduct?.product_title}`}
                    open={isViewModalVisible}
                    onCancel={() => {
                        setIsViewModalVisible(false);
                        setSelectedProduct(null);
                    }}
                    footer={[
                        <Button key="close" onClick={() => setIsViewModalVisible(false)}>
                            Tutup
                        </Button>
                    ]}
                    width={600}
                >
                    {selectedProduct && (
                        <div style={{ padding: '16px 0' }}>
                            <div style={{ marginBottom: '16px' }}>
                                <strong>ID:</strong> {selectedProduct.product_id}
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <strong>Nama:</strong> {selectedProduct.product_title}
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <strong>Harga:</strong> Rp {selectedProduct.product_price.toLocaleString('id-ID')}
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <strong>Kategori:</strong> {selectedProduct.product_category || '-'}
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <strong>Deskripsi:</strong> {selectedProduct.product_description || '-'}
                            </div>
                            {selectedProduct.product_image && (
                                <div style={{ marginBottom: '16px' }}>
                                    <strong>Gambar:</strong>
                                    <div style={{ marginTop: '8px' }}>
                                        <img 
                                            src={selectedProduct.product_image} 
                                            alt={selectedProduct.product_title}
                                            style={{ 
                                                maxWidth: '100%', 
                                                height: 'auto',
                                                borderRadius: '8px'
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                            <div style={{ marginBottom: '16px' }}>
                                <strong>Dibuat:</strong> {new Date(selectedProduct.created_timestamp).toLocaleString('id-ID')}
                            </div>
                            <div>
                                <strong>Diupdate:</strong> {new Date(selectedProduct.updated_timestamp).toLocaleString('id-ID')}
                            </div>
                        </div>
                    )}
                </Modal>
            </Flex>
        </div>
    );
};

export default ProductPage;