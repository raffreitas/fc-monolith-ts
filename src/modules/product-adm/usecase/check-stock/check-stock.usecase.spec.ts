import { Product } from "../../domain/product.entity";
import { CheckStockUseCase } from "./check-stock.usecase";

const product = new Product({
  name: "Product 1",
  description: "Product 1 description",
  purchasePrice: 100,
  stock: 10,
  createdAt: new Date(),
  updatedAt: new Date(),
})

const MockRepository = () => {
  return {
    add: vi.fn(),
    find: vi.fn().mockReturnValue(product),
  }
}

describe("check stock usecase tests", () => {
  it("should check stock of a product", async () => {
    // Arrange
    const productRepository = MockRepository();
    const usecase = new CheckStockUseCase(productRepository);
    const input = { productId: product.id.value, };

    // Act
    const output = await usecase.execute(input);

    // Assert
    expect(output).toEqual({
      productId: input.productId,
      stock: 10,
    });
    expect(productRepository.find).toHaveBeenCalled();
  })
})
