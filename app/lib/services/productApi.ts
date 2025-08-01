import axios from 'axios';
import { Product, CreateProductData, UpdateProductData } from '../types/products';

export class ProductApi {
    private static baseUrl = '/api';
    private static baseUrlAPI = process.env.NEXT_PUBLIC_API_BASE_URL || '/api/web/v1';

    // Fetch all products
    static async getAllProducts(page = 1, limit = 10, search: string | null = null): Promise<{ data: Product[], pagination: any}> {
        try {
            const params: any = { page, limit };
            if (search) params.search = search;

            const response = await axios.get(`${this.baseUrl}/products?page=${page}&limit=${limit}`, {params});
            
            // Handle different response formats
            if (Array.isArray(response.data)) {
                return {
                    data: response.data,
                    pagination: null
                };
            } else if (response.data && Array.isArray(response.data.data) && response.data.pagination) {
                return {
                    data: response.data.data,
                    pagination: response.data.pagination
                };
            } else {
                throw new Error('Invalid data format from API');
            }
        } catch (error: any) {
            console.error('Error fetching all products:', error);
            throw new Error(error.response?.data?.message || error.message || 'Failed to fetch products');
        }
    }

    // Fetch single product
    static async getProductById(id: string): Promise<Product> {
        try {
            const response = await axios.get(`${this.baseUrl}/product?product_id=${id}`);
            return response.data;
        } catch (error: any) {
            console.error('Error fetching single product:', error);
            throw new Error(error.response?.data?.message || error.message || 'Failed to fetch product');
        }
    }

    // Create new product
    static async createProduct(productData: CreateProductData): Promise<Product> {
        try {
            const payload = {
                ...productData,
                created_timestamp: new Date().toISOString(),
                updated_timestamp: new Date().toISOString(),
            };

            const response = await axios.post(`${this.baseUrl}/product`, payload);
            return response.data;
        } catch (error: any) {
            console.error('Error creating product:', error);
            throw new Error(error.response?.data?.message || error.message || 'Failed to create product');
        }
    }

    // Update existing product
    static async updateProduct(id: string, productData: UpdateProductData): Promise<Product> {
        try {
            const payload = {
                ...productData,
                updated_timestamp: new Date().toISOString(),
            };

            const response = await axios.put(`${this.baseUrl}/product?product_id=${id}`, payload);
            return response.data;
        } catch (error: any) {
            console.error('Error updating product:', error);
            throw new Error(error.response?.data?.message || error.message || 'Failed to update product');
        }
    }

    // Delete product
    static async deleteProduct(id: string): Promise<void> {
        try {
            await axios.delete(`${this.baseUrl}/product?product_id=${id}`);
        } catch (error: any) {
            console.error('Error deleting product:', error);
            throw new Error(error.response?.data?.message || error.message || 'Failed to delete product');
        }
    }
}