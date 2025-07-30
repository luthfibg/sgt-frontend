export interface Product {
    product_id: string;
    product_title: string;
    product_price: number;
    product_description?: string;
    product_image?: string;
    product_category?: string;
    created_timestamp: string;
    updated_timestamp: string;
}

export interface ProductListParams {
    page: number;
    limit: number;
    offset: number;
    search?: string;
}

export interface CreateProductData {
    product_title: string;
    product_price: number;
    product_description?: string;
    product_image?: string;
    product_category?: string;
}

export interface UpdateProductData extends Partial<CreateProductData> {
    updated_timestamp: string;
}