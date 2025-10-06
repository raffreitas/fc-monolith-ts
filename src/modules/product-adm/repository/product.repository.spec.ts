import { randomUUID } from "node:crypto";
import { DataSource } from "typeorm";
import { Product } from "../domain/product.entity";
import { ProductModel } from "./product.model";
import { ProductRepository } from "./product.repository";

describe("product repository test", () => {
  let typeorm: DataSource;

  beforeEach(async () => {
    typeorm = new DataSource({
      type: "better-sqlite3",
      database: ":memory:",
      logging: false,
      synchronize: true,
      entities: [ProductModel],
    });

    await typeorm.initialize();
  });

  afterEach(async () => {
    if (typeorm?.isInitialized) {
      await typeorm.destroy();
    }
  });

  it("should create a product", async () => {
    // Arrange
    const typeormRepository = typeorm.getRepository(ProductModel);
    const productRepository = new ProductRepository(typeorm);

    const product = new Product({
      name: "Product 1",
      description: "Product 1 description",
      purchasePrice: 100,
      stock: 10,
    });

    // Act
    await productRepository.add(product);

    // Assert
    const productDb = await typeormRepository.findOneByOrFail({
      id: product.id.value,
    });
    expect(productDb).toBeDefined();
    expect(productDb.id).toBe(product.id.value);
    expect(productDb.name).toBe("Product 1");
    expect(productDb.description).toBe("Product 1 description");
    expect(productDb.purchasePrice).toBe(100);
    expect(productDb.stock).toBe(10);
    expect(productDb.createdAt).toBeInstanceOf(Date);
    expect(productDb.updatedAt).toBeInstanceOf(Date);
  });

  it("should find a product", async () => {
    // Arrange
    const expectedId = randomUUID();
    const typeormRepository = typeorm.getRepository(ProductModel);
    const productRepository = new ProductRepository(typeorm);

    await typeormRepository.insert({
      id: expectedId,
      name: "Product 1",
      description: "Product 1 description",
      purchasePrice: 100,
      stock: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Act
    const productFound = await productRepository.find(expectedId);

    // Assert
    expect(productFound).toBeDefined();
    expect(productFound.id.value).toBe(expectedId);
    expect(productFound.name).toBe("Product 1");
    expect(productFound.description).toBe("Product 1 description");
    expect(productFound.purchasePrice).toBe(100);
    expect(productFound.stock).toBe(10);
    expect(productFound.createdAt).toBeInstanceOf(Date);
    expect(productFound.updatedAt).toBeInstanceOf(Date);
  });
});

