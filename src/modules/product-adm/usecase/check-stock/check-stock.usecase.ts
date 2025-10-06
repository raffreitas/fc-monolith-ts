import type { UseCaseInterface } from "../../../@shared/usecase/use-case.interface";
import type { ProductGateway } from "../../gateway/product.gateway";
import type {
  CheckStockInputDto,
  CheckStockOutputDto,
} from "./check-stock.dto";

export class CheckStockUseCase implements UseCaseInterface<CheckStockInputDto, CheckStockOutputDto> {
  constructor(private readonly productGateway: ProductGateway) { }

  async execute(input: CheckStockInputDto): Promise<CheckStockOutputDto> {
    var product = await this.productGateway.find(input.productId);
    return {
      productId: product.id.value,
      stock: product.stock,
    };
  }
}

