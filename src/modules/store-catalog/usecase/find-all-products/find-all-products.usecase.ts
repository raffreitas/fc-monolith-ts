import type { UseCaseInterface } from "../../../@shared/usecase/use-case.interface";
import type ProductGateway from "../../gateway/product.gateway";
import type { FindAllProductsDto } from "./find-all-products.dto";

export class FindAllProductsUseCase implements UseCaseInterface<void, FindAllProductsDto> {
  constructor(private productRepository: ProductGateway) { }

  async execute(): Promise<FindAllProductsDto> {
    const products = await this.productRepository.findAll();

    return {
      products: products.map((product) => ({
        id: product.id.value,
        name: product.name,
        description: product.description,
        salesPrice: product.salesPrice,
      })),
    };
  }
}
