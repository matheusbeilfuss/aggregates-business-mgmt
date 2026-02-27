import { Category } from "@/modules/category/types";

export interface Product {
  id: number;
  name: string;
  category?: Category;
}

// Payloads para API

export interface CreateProductPayload {
  name: string;
  categoryId?: number;
  categoryName?: string;
}

export interface UpdateProductPayload {
  name: string;
  categoryId: number;
}
