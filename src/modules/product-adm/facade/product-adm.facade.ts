import type { UseCaseInterface } from "../../@shared/usecase/use-case.interface";
import type {
  AddProductInputDto,
  AddProductOutputDto,
} from "../usecase/add-product/add-product.dto";
import type { AddProductFacadeInputDto } from "./dtos/add-product.facade.dto";
import type {
  CheckStockFacadeInputDto,
  CheckStockFacadeOutputDto,
} from "./dtos/check-stock.facade.dto";
import type { ProductAdmFacadeInterface } from "./product-adm.facade.interface";

export type ProductAdmFacadeProps = {
  addProductUseCase: UseCaseInterface<AddProductInputDto, AddProductOutputDto>;
  checkStockUseCase: UseCaseInterface<
    CheckStockFacadeInputDto,
    CheckStockFacadeOutputDto
  >;
};

export class ProductAdmFacade implements ProductAdmFacadeInterface {
  private readonly _addProductUseCase: UseCaseInterface<AddProductInputDto, AddProductOutputDto>;
  private readonly _checkStockUseCase: UseCaseInterface<CheckStockFacadeInputDto, CheckStockFacadeOutputDto>;

  constructor(props: ProductAdmFacadeProps) {
    this._addProductUseCase = props.addProductUseCase;
    this._checkStockUseCase = props.checkStockUseCase;
  }

  async addProduct(input: AddProductFacadeInputDto): Promise<void> {
    await this._addProductUseCase.execute(input);
  }

  async checkStock(input: CheckStockFacadeInputDto,): Promise<CheckStockFacadeOutputDto> {
    return this._checkStockUseCase.execute(input);
  }
}

