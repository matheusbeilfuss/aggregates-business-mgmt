import { Category } from "@/modules/category/types";

export interface Price {
  id: number;
  m3Volume: number;
  price: number;
}

export interface PriceCategory extends Price {
  category: Category;
}
