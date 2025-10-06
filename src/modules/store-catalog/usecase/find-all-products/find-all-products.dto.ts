export type ProductsDto = {
  id: string;
  name: string;
  description: string;
  salesPrice: number;
}

export interface FindAllProductsDto {
  products: ProductsDto[];
}
