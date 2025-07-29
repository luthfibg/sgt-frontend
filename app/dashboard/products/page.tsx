import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Product {
    product_id: string;
    product_title: string;
    product_price: number;
    product_description?: string;
    product_image?: string;
    product_category?: string;
    created_timestamp: string;
    updated_timestamp: string;
}

interface ProductListParams {
    page: number; // Current page number
    limit: number; // Items per page
    offset: number; // Calculate from page and limit
    search?: string; // Search term
}

const ProductPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [singleProduct, setSingleProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [newProductTitle, setNewProductTitle] = useState('');
    const [newProductPrice, setNewProductPrice] = useState(0);

    const [updateProductId, setUpdateProductId] = useState('');
    const [updateProductTitle, setUpdateProductTitle] = useState('');
    const [updateProductPrice, setUpdateProductPrice] = useState(0);

    // Fetch all products
    const fetchAllProducts = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.get('/api/products');
            setProducts(response.data);
        } catch (err: any) {
            console.error('Error fetching all products:', err);
            setError(err.message || 'Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    // Fetch single product
    const fetchSingleProduct =async (id:string) => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.get(`/api/product?product_id=${id}`);
            setSingleProduct(response.data);
        } catch (err: any) {
            console.error('Error fetching single product:', err);
            setError(err.message || 'Failed to fetch product');
            setSingleProduct(null);
        } finally {
            setLoading(false);
        }
    };

    // Create new product
    const createProduct = async () => {
        if (!newProductTitle || newProductPrice <= 0) {
            alert('Please provide valid product title and price.');
            return;
        }
        try {
            setLoading(true);
            setError(null);

            const response = await axios.post('/api/product', {
                product_title: newProductTitle,
                product_price: newProductPrice,
                product_description: 'A new product description',
                product_image: 'https://example.com/image.jpg',
                product_category: 'Electronics',
                created_timestamp: new Date().toISOString(),
                updated_timestamp: new Date().toISOString(),
            });
            console.log('Product created:', response.data);
            setNewProductTitle('');
            setNewProductPrice(0);
        } catch (err: any) {
            console.error('Error creating product:', err);
            setError(err.message || 'Failed to create product');
        } finally {
            setLoading(false);
        }
    };

    // Update existing product
    const updateProduct = async () => {
        if (!updateProductId || (!updateProductTitle && updateProductPrice === 0)) {
            alert('Product ID and at least one field (title or price) to update are required.');
            return;
        }
        try {
            setLoading(true);
            setError(null);

            const response = await axios.put(`/api/product?product_id=${updateProductId}`, {
                product_title: updateProductTitle || undefined,
                product_price: updateProductPrice > 0 ? updateProductPrice : undefined,
                product_description: 'An updated product description',
                product_image: 'https://example.com/image.jpg',
                product_category: 'Electronics',
                updated_timestamp: new Date().toISOString(),
            });
            console.log('Product updated:', response.data);
            setUpdateProductId('');
            setUpdateProductTitle('');
            setUpdateProductPrice(0);
            await fetchAllProducts(); // Refresh product list
        } catch (err: any) {
            console.error('Error updating product:', err);
            setError(err.message || 'Failed to update product');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllProducts();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <h1>This is the product page</h1>
    );
}