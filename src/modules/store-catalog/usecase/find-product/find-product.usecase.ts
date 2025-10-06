import type { UseCaseInterface } from "../../../@shared/usecase/use-case.interface";
import type ProductGateway from "../../gateway/product.gateway";
import type {
  FindProductInputDto,
  FindProductOutputDto,
} from "./find-product.dto";

export class FindProductUseCase implements UseCaseInterface<FindProductInputDto, FindProductOutputDto> {
  constructor(private readonly productRepository: ProductGateway) { }

  async execute(input: FindProductInputDto): Promise<FindProductOutputDto> {
    const product = await this.productRepository.find(input.id);

    return {
      id: product.id.value,
      name: product.name,
      description: product.description,
      salesPrice: product.salesPrice,
    };
  }
}

