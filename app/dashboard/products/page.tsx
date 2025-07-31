'use client'

import React, { useState, useEffect } from 'react';
import { Flex, Button, Table, message, Modal, Input } from 'antd';
import { useProducts } from '@/app/lib/hooks/useProducts';
import { getProductColumns } from '@/app/lib/configs/productTableConfig';
import { Product } from '@/app/lib/types/products';
import ProductModal from '@/app/dashboard/products/modal';
const { Search } = Input;

const ProductPage = () => {
    const { products, loading, error, pagination, deleteProduct, createProduct, updateProduct, fetchProducts } = useProducts();
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [searchText, setSearchText] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Update debounced search after 300ms
    useEffect(() => {
        const handler = setTimeout(() => {
        setDebouncedSearch(searchText);
        }, 300);

        return () => clearTimeout(handler); // Clear timeout on input change
    }, [searchText]);

    // Fetch products when debounced search changes
    useEffect(() => {
        fetchProducts(1, pagination.limit, debouncedSearch); // always from page 1
    }, [debouncedSearch]);

    // Handle view product
    const handleView = (product: Product) => {
        setSelectedProduct(product);
        setIsViewModalVisible(true);
    };

    // Handle edit product
    const handleEdit = (product: Product) => {
        setSelectedProduct(product);
        setModalMode('edit');
        setIsModalOpen(true);
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
                try {
                    const success = await deleteProduct(product.product_id);
                    if (success) {
                        message.success('Produk berhasil dihapus');
                    } else {
                        throw new Error('Gagal menghapus produk');
                    }
                } catch (error) {
                    message.error(
                        error && typeof error === 'object' && 'message' in error
                            ? (error as { message: string }).message
                            : 'Gagal menghapus produk'
                    );
                }
            },
        });
    };

    // Handle submit modal
    const handleSubmit = async (values: any) => {
        try {
            let success = false;
            
            if (modalMode === 'create') {
                success = await createProduct(values);
                if (success) {
                    message.success('Produk berhasil ditambahkan');
                }
            } else {
                // Perbaikan di sini - pisahkan id dan productData
                if (!selectedProduct?.product_id) {
                    message.error('ID produk tidak valid');
                    return false;
                }
                
                success = await updateProduct(
                    selectedProduct.product_id, // parameter pertama: id
                    values // parameter kedua: productData
                );
                if (success) {
                    message.success('Produk berhasil diperbarui');
                }
            }
            
            if (success) {
                await fetchProducts();
                return true;
            } else {
                message.error(`Gagal ${modalMode === 'create' ? 'menambahkan' : 'memperbarui'} produk`);
                return false;
            }
        } catch (error) {
            console.error('Error:', error);
            message.error('Terjadi kesalahan');
            return false;
        }
    };

    // handle pagination update
    const handleTableChange = (paginationInfo: any) => {
        const { current, pageSize } = paginationInfo;
        fetchProducts(current, pageSize, searchText);
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

    // Search handler
    const handleSearch = async (value: string) => {
        try {
            setSearchLoading(true);
            setSearchText(value);
            await fetchProducts(1, pagination.limit, value); // Search dimulai dari page 1
        } finally {
            setSearchLoading(false);
        }
    };

    return (
        <div style={{ padding: '24px' }}>
            <Flex vertical gap="middle">
                {/* Header Actions */}
                <Flex justify="space-evenly" gap="middle" align="center">
                    <h3 style={{ margin: 0 }}>Manajemen Produk</h3>
                    <Search 
                        placeholder="Cari produk..."
                        onSearch={handleSearch}
                        loading={searchLoading}
                        enterButton
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        allowClear
                    />
                    <Button 
                        type="primary" 
                        size="large"
                        onClick={() => {
                            setSelectedProduct(null);
                            setModalMode('create');
                            setIsModalOpen(true);
                        }}
                    >
                        Tambah Produk
                    </Button>
                </Flex>

                {/* Products Table */}
                <Table<Product>
                    columns={columns}
                    dataSource={products}
                    rowKey="product_id"
                    loading={loading}
                    pagination={{
                        current: pagination.page,
                        pageSize: pagination.limit,
                        total: pagination.total,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} dari ${total} produk`,
                        pageSizeOptions: ['10', '20', '50', '100'],
                    }}
                    onChange={handleTableChange}
                    scroll={{ x: 1200 }}
                    size="middle"
                />

                {/* Product Modal */}
                <ProductModal
                    open={isModalOpen}
                    mode={modalMode}
                    initialValues={selectedProduct}
                    onCancel={() => setIsModalOpen(false)}
                    onSubmit={handleSubmit}
                    loading={loading}
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
                            {/* ... (keep your existing view modal content) ... */}
                        </div>
                    )}
                </Modal>
            </Flex>
        </div>
    );
};

export default ProductPage;