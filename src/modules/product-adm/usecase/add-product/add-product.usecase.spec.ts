import type { AddProductInputDto } from "./add-product.dto";
import { AddProductUseCase } from "./add-product.usecase";

const MockRepository = () => {
  return {
    add: vi.fn(),
    find: vi.fn(),
  };
};

describe("add product usecase unit test", () => {
  it("should add a product", async () => {
    // Arrange
    const productRepository = MockRepository();
    const usecase = new AddProductUseCase(productRepository);
    const input: AddProductInputDto = {
      name: "Product 1",
      description: "Product 1 description",
      purchasePrice: 100,
      stock: 10,
    };
    // Act
    const output = await usecase.execute(input);

    // Assert
    expect(output).toEqual({
      id: expect.any(String),
      name: input.name,
      description: input.description,
      purchasePrice: input.purchasePrice,
      stock: input.stock,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
    expect(productRepository.add).toHaveBeenCalled();
  });
});
