import { useState, useEffect, useCallback } from 'react';
import { Product, CreateProductData, UpdateProductData } from '../types/products';
import { ProductApi } from '../services/productApi';

export const useProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch all products
    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await ProductApi.getAllProducts();
            setProducts(data);
        } catch (err: any) {
            setError(err.message);
            setProducts([]);
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
            await fetchProducts(); // Refresh list
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
            await fetchProducts(); // Refresh list
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
            await fetchProducts(); // Refresh list
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