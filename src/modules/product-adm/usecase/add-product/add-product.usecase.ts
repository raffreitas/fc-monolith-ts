import type { UseCaseInterface } from "../../../@shared/usecase/use-case.interface";
import { Product } from "../../domain/product.entity";
import type { ProductGateway } from "../../gateway/product.gateway";
import type {
  AddProductInputDto,
  AddProductOutputDto,
} from "./add-product.dto";

export class AddProductUseCase
  implements UseCaseInterface<AddProductInputDto, AddProductOutputDto> {

  constructor(private readonly productGateway: ProductGateway) { }

  async execute(input: AddProductInputDto): Promise<AddProductOutputDto> {
    const product = new Product({
      name: input.name,
      description: input.description,
      purchasePrice: input.purchasePrice,
      stock: input.stock,
    });

    await this.productGateway.add(product);

    return {
      id: product.id.value,
      name: product.name,
      description: product.description,
      purchasePrice: product.purchasePrice,
      stock: product.stock,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
