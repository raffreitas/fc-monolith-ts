import { randomUUID } from "node:crypto";
import { DataSource } from "typeorm";
import { ProductAdmFacadeFactory } from "../factory/facade.factory";
import { ProductModel } from "../repository/product.model";

describe("product adm facade tests", () => {
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

  it("should add a product", async () => {
    // Arrange
    const productFacade = ProductAdmFacadeFactory.create(typeorm);
    const input = {
      name: "Product 1",
      description: "Product 1 description",
      purchasePrice: 100,
      stock: 10,
    };

    // Act
    await productFacade.addProduct(input);

    // Assert
    const productDb = await typeorm
      .getRepository(ProductModel)
      .findOneByOrFail({
        name: "Product 1",
      });
    expect(productDb).toBeDefined();
    expect(productDb.id).toBeDefined();
    expect(productDb.name).toBe("Product 1");
    expect(productDb.description).toBe("Product 1 description");
    expect(productDb.purchasePrice).toBe(100);
    expect(productDb.stock).toBe(10);
    expect(productDb.createdAt).toBeInstanceOf(Date);
    expect(productDb.updatedAt).toBeInstanceOf(Date);
  });

  it("should check stock of a product", async () => {
    // Arrange
    const productFacade = ProductAdmFacadeFactory.create(typeorm);
    const product = await typeorm.getRepository(ProductModel).save({
      id: randomUUID(),
      name: "Product 1",
      description: "Product 1 description",
      purchasePrice: 100,
      stock: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Act
    const output = await productFacade.checkStock({
      productId: product.id,
    });

    // Assert
    expect(output).toBeDefined();
    expect(output.productId).toBe(product.id);
    expect(output.stock).toBe(10);
  });
});
