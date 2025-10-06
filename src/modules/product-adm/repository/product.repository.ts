import type { DataSource, Repository } from "typeorm";
import { Id } from "../../@shared/domain/value-object/id.value-object";
import { Product } from "../domain/product.entity";
import type { ProductGateway } from "../gateway/product.gateway";
import { ProductModel } from "./product.model";

export class ProductRepository implements ProductGateway {
  private repository: Repository<ProductModel>;

  constructor(private readonly typeorm: DataSource) {
    this.repository = this.typeorm.getRepository(ProductModel);
  }

  async add(product: Product): Promise<void> {
    const productModel = this.repository.create({
      id: product.id.value,
      name: product.name,
      description: product.description,
      purchasePrice: product.purchasePrice,
      stock: product.stock,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    });
    await this.repository.save(productModel);
  }

  async find(id: string): Promise<Product> {
    const product = await this.repository.findOneBy({ id });
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }
    return new Product({
      id: new Id(product.id),
      name: product.name,
      description: product.description,
      purchasePrice: product.purchasePrice,
      stock: product.stock,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    });
  }
}
