import type { AddProductFacadeInputDto } from "./dtos/add-product.facade.dto";
import type { CheckStockFacadeInputDto, CheckStockFacadeOutputDto } from "./dtos/check-stock.facade.dto";

export interface ProductAdmFacadeInterface {
  addProduct(input: AddProductFacadeInputDto): Promise<void>;
  checkStock(input: CheckStockFacadeInputDto): Promise<CheckStockFacadeOutputDto>;
}
