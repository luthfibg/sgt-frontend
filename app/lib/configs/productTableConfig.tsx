import React from 'react';
import { Button, Space } from 'antd';
import type { TableProps } from 'antd';
import { Product } from '../types/products';

interface ProductTableConfigProps {
    onView: (product: Product) => void;
    onEdit: (product: Product) => void;
    onDelete: (product: Product) => void;
}

export const getProductColumns = ({ 
    onView, 
    onEdit, 
    onDelete 
}: ProductTableConfigProps): TableProps<Product>['columns'] => [
    {
        title: 'ID',
        dataIndex: 'product_id',
        key: 'product_id',
        width: 100,
        ellipsis: true,
    },
    {
        title: 'Nama Produk',
        dataIndex: 'product_title',
        key: 'product_title',
        sorter: (a, b) => a.product_title.localeCompare(b.product_title),
    },
    {
        title: 'Harga',
        dataIndex: 'product_price',
        key: 'product_price',
        render: (price: number) => `Rp ${price.toLocaleString('id-ID')}`,
        sorter: (a, b) => a.product_price - b.product_price,
        width: 150,
    },
    {
        title: 'Kategori',
        dataIndex: 'product_category',
        key: 'product_category',
        filters: [
            { text: 'Electronics', value: 'Electronics' },
            { text: 'Clothing', value: 'Clothing' },
            { text: 'Books', value: 'Books' },
        ],
        onFilter: (value, record) => record.product_category === value,
        width: 120,
    },
    {
        title: 'Gambar',
        dataIndex: 'product_image',
        key: 'product_image',
        render: (image: string) => image ? (
            <img 
                src={image} 
                alt="Product" 
                style={{ 
                    width: 50, 
                    height: 50, 
                    objectFit: 'cover',
                    borderRadius: 4 
                }} 
            />
        ) : (
            <div style={{ 
                width: 50, 
                height: 50, 
                backgroundColor: '#f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 4,
                fontSize: 12,
                color: '#999'
            }}>
                No Image
            </div>
        ),
        width: 80,
    },
    {
        title: 'Deskripsi',
        dataIndex: 'product_description',
        key: 'product_description',
        ellipsis: true,
        render: (text: string) => text || '-',
    },
    {
        title: 'Dibuat',
        dataIndex: 'created_timestamp',
        key: 'created_timestamp',
        render: (timestamp: string) => new Date(timestamp).toLocaleDateString('id-ID'),
        sorter: (a, b) => new Date(a.created_timestamp).getTime() - new Date(b.created_timestamp).getTime(),
        width: 100,
    },
    {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
            <Space size="small">
                <Button size="small" type="primary" onClick={() => onEdit(record)}>
                    Edit
                </Button>
                <Button size="small" danger onClick={() => onDelete(record)}>
                    Delete
                </Button>
            </Space>
        ),
        width: 150,
        fixed: 'right',
    },
];