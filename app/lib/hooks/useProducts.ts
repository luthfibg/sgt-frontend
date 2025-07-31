import { useState, useEffect, useCallback } from 'react';
import { Product, CreateProductData, UpdateProductData } from '../types/products';
import { ProductApi } from '../services/productApi';

export const useProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, total_pages: 1, search: null });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch all products
    const fetchProducts = useCallback(async (page = 1, limit = 10, search: string | null = null) => {
        try {
            setLoading(true);
            setError(null);
            const result = await ProductApi.getAllProducts(page, limit, search);
            setProducts(result.data);
            setPagination(result.pagination);
        } catch (err: any) {
            setError(err.message);
            setProducts([]);
            setPagination({ page: 1, limit: 10, total: 0, total_pages: 1, search: null });
        } finally {
            setLoading(false);
        }
    }, []);

    // Create product
    const createProduct = useCallback(async (productData: CreateProductData) => {
        try {
            setLoading(true);
            setError(null);
            await ProductApi.createProduct(productData);
            await fetchProducts(pagination.page, pagination.limit); // Refresh list
            return true;
        } catch (err: any) {
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    }, [fetchProducts]);

    // Update product
    const updateProduct = useCallback(async (id: string, productData: UpdateProductData) => {
        try {
            setLoading(true);
            setError(null);
            await ProductApi.updateProduct(id, productData);
            await fetchProducts(pagination.page, pagination.limit); // Refresh list
            return true;
        } catch (err: any) {
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    }, [fetchProducts]);
    

    // Delete product
    const deleteProduct = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            await ProductApi.deleteProduct(id);
            await fetchProducts(pagination.page, pagination.limit); // Refresh list
            return true;
        } catch (err: any) {
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    }, [fetchProducts]);

    // Initial fetch
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return {
        products,
        loading,
        error,
        fetchProducts,
        createProduct,
        updateProduct,
        deleteProduct,
        pagination,
    };
};

export const useProduct = (id?: string) => {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProduct = useCallback(async (productId: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await ProductApi.getProductById(productId);
            setProduct(data);
        } catch (err: any) {
            setError(err.message);
            setProduct(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (id) {
            fetchProduct(id);
        }
    }, [id, fetchProduct]);

    return {
        product,
        loading,
        error,
        fetchProduct,
    };
};