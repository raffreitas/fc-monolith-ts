import { randomUUID } from "node:crypto";
import { DataSource } from "typeorm";
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

  it("should find all products", async () => {
    // Arrange
    const typeormRepository = typeorm.getRepository(ProductModel);
    const productRepository = new ProductRepository(typeorm);

    await typeormRepository.insert([
      {
        id: randomUUID(),
        name: "Product 1",
        description: "Product 1 description",
        salesPrice: 100,
      },
      {
        id: randomUUID(),
        name: "Product 2",
        description: "Product 2 description",
        salesPrice: 200,
      },
    ]);

    // Act
    const products = await productRepository.findAll();

    // Assert
    expect(products).toBeDefined();
    expect(products.length).toBe(2);
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
      salesPrice: 100,
    });

    // Act
    const productFound = await productRepository.find(expectedId);

    // Assert
    expect(productFound).toBeDefined();
    expect(productFound.id.value).toBe(expectedId);
    expect(productFound.name).toBe("Product 1");
    expect(productFound.description).toBe("Product 1 description");
    expect(productFound.salesPrice).toBe(100);
  });
});

