import { Id } from "../../../@shared/domain/value-object/id.value-object";
import type { CheckStockFacadeInputDto } from "../../../product-adm/facade/dtos/check-stock.facade.dto";
import { Product } from "../../domain/product.entity";
import type { PlaceOrderInputDto } from "./place-order.dto";
import { PlaceOrderUseCase } from "./place-order.usecase";

const mockDate = new Date(2001, 3, 5);

describe("place order use case unit test", () => {
  describe("validate products method", () => {
    //@ts-expect-error - no params in constructor
    const placeOrderUseCase = new PlaceOrderUseCase();

    it("should throw an error when no products are selected", async () => {
      const input: PlaceOrderInputDto = {
        clientId: "0",
        products: [],
      };

      await expect(
        placeOrderUseCase["validateProducts"](input),
      ).rejects.toThrow(new Error("No products selected"));
    });

    it("should throw an error when products is out of stock", async () => {
      const mockProductFacade = {
        checkStock: vi.fn(({ productId }: CheckStockFacadeInputDto) =>
          Promise.resolve({
            productId,
            stock: productId === "1" ? 0 : 1,
          }),
        ),
      };

      //@ts-expect-error - adding private property
      placeOrderUseCase["_productFacade"] = mockProductFacade;

      let input: PlaceOrderInputDto = {
        clientId: "0",
        products: [{ productId: "1" }],
      };

      await expect(
        placeOrderUseCase["validateProducts"](input),
      ).rejects.toThrow(new Error("Product 1 is not available in stock"));

      input = {
        clientId: "0",
        products: [{ productId: "0" }, { productId: "1" }],
      };

      await expect(
        placeOrderUseCase["validateProducts"](input),
      ).rejects.toThrow(new Error("Product 1 is not available in stock"));
      expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(3);

      input = {
        clientId: "0",
        products: [{ productId: "0" }, { productId: "1" }, { productId: "2" }],
      };

      await expect(
        placeOrderUseCase["validateProducts"](input),
      ).rejects.toThrow(new Error("Product 1 is not available in stock"));
      expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(5);
    });
  });

  describe("get products method", () => {
    beforeAll(() => {
      vi.useFakeTimers();
      vi.setSystemTime(mockDate);
    });

    afterAll(() => {
      vi.useRealTimers();
    });

    //@ts-expect-error - no params in constructor
    const placeOrderUseCase = new PlaceOrderUseCase();

    it("should throw and error when product not found", async () => {
      const mockCatalogFacade = {
        find: vi.fn().mockResolvedValue(null),
      };

      //@ts-expect-error - force set private property
      placeOrderUseCase["_catalogFacade"] = mockCatalogFacade;

      await expect(placeOrderUseCase["getProduct"]("0")).rejects.toThrow(
        new Error("Product not found"),
      );
      expect(mockCatalogFacade.find).toHaveBeenCalledWith({ id: "0" });
    });

    it("should return a product", async () => {
      const mockCatalogFacade = {
        find: vi.fn().mockResolvedValue({
          id: "0",
          name: "Product 0",
          description: "Description 0",
          salesPrice: 100,
        }),
      };

      //@ts-expect-error - force set private property
      placeOrderUseCase["_catalogFacade"] = mockCatalogFacade;

      const product = await placeOrderUseCase["getProduct"]("0");
      expect(mockCatalogFacade.find).toHaveBeenCalledWith({ id: "0" });
      expect(product.id.value).toBe("0");
      expect(product.name).toBe("Product 0");
      expect(product.description).toBe("Description 0");
      expect(product.salesPrice).toBe(100);
    });
  });

  describe("execute method", () => {
    beforeAll(() => {
      vi.useFakeTimers();
      vi.setSystemTime(mockDate);
    });

    afterAll(() => {
      vi.useRealTimers();
    });

    it("should throw an error when client not found", async () => {
      const mockClientFacade = {
        find: vi.fn().mockResolvedValue(null),
      };

      //@ts-expect-error - no params in constructor
      const placeOrderUseCase = new PlaceOrderUseCase();
      //@ts-expect-error - adding private property
      placeOrderUseCase["_clientFacade"] = mockClientFacade;

      const input: PlaceOrderInputDto = {
        clientId: "0",
        products: [],
      };

      await expect(placeOrderUseCase.execute(input)).rejects.toThrow(
        new Error("Client not found"),
      );
    });

    it("should throw an error when products are not valid", async () => {
      const mockClientFacade = {
        find: vi.fn().mockResolvedValue({}),
      };

      //@ts-expect-error - no params in constructor
      const placeOrderUseCase = new PlaceOrderUseCase();

      const mockValidateProducts = vi
        //@ts-expect-error - spying on private method
        .spyOn(placeOrderUseCase, "validateProducts")
        .mockRejectedValue(new Error("No products selected"));

      //@ts-expect-error - adding private property
      placeOrderUseCase["_clientFacade"] = mockClientFacade;

      const input: PlaceOrderInputDto = {
        clientId: "0",
        products: [],
      };

      await expect(placeOrderUseCase.execute(input)).rejects.toThrow(
        "No products selected",
      );
      expect(mockValidateProducts).toHaveBeenCalled();
    });

    describe("place an order", () => {
      const clientProps = {
        id: "1",
        name: "Client 1",
        document: "Document 1",
        email: "client1@example.com",
        address: {
          street: "Street 1",
          number: "123",
          complement: "Complement 1",
          city: "City 1",
          state: "State 1",
          zipCode: "ZipCode 1",
        },
      };

      const mockClientFacade = {
        find: vi.fn().mockResolvedValue(clientProps),
        add: vi.fn(),
      };

      const mockPaymentFacade = {
        process: vi.fn(),
      };

      const mockCheckoutRepository = {
        addOrder: vi.fn(),
        findOrder: vi.fn(),
      };

      const mockInvoiceFacade = {
        generate: vi.fn().mockResolvedValue({ id: "1" }),
        find: vi.fn(),
      };

      const placeOrderUseCase = new PlaceOrderUseCase(
        mockClientFacade,
        null as any,
        null as any,
        mockCheckoutRepository,
        mockInvoiceFacade,
        mockPaymentFacade,
      );

      const products = {
        "1": new Product({
          id: new Id("1"),
          name: "Product 1",
          description: "Description 1",
          salesPrice: 10,
        }),
        "2": new Product({
          id: new Id("2"),
          name: "Product 2",
          description: "Description 2",
          salesPrice: 20,
        }),
      };

      const mockValidateProducts = vi
        // @ts-expect-error - spying on private method
        .spyOn(placeOrderUseCase, "validateProducts")
        // @ts-expect-error - spying on private method
        .mockResolvedValue(null);

      const mockGetProduct = vi
        // @ts-expect-error - spying on private method
        .spyOn(placeOrderUseCase, "getProduct")
        // @ts-expect-error - spying on private method
        .mockImplementation((productId: keyof typeof products) =>
          Promise.resolve(products[productId]),
        );

      beforeEach(() => {
        vi.clearAllMocks();
      });

      it("should not be approved", async () => {
        mockPaymentFacade.process = mockPaymentFacade.process.mockResolvedValue(
          {
            transactionId: "1",
            orderId: "1",
            amount: 30,
            status: "error",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        );

        const input: PlaceOrderInputDto = {
          clientId: "1",
          products: [{ productId: "1" }, { productId: "2" }],
        };

        const output = await placeOrderUseCase.execute(input);

        expect(output.invoiceId).toBeNull();
        expect(output.total).toBe(30);
        expect(output.products).toStrictEqual([
          { productId: "1" },
          { productId: "2" },
        ]);
        expect(mockClientFacade.find).toHaveBeenCalledTimes(1);
        expect(mockClientFacade.find).toHaveBeenCalledWith({ id: "1" });
        expect(mockValidateProducts).toHaveBeenCalledTimes(1);
        expect(mockValidateProducts).toHaveBeenCalledWith(input);
        expect(mockGetProduct).toHaveBeenCalledTimes(2);

        expect(mockCheckoutRepository.addOrder).toHaveBeenCalledTimes(1);
        expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
        expect(mockPaymentFacade.process).toHaveBeenCalledWith({
          orderId: output.id,
          amount: output.total,
        });
        expect(mockInvoiceFacade.generate).not.toHaveBeenCalled();
      });

      it("should be approved", async () => {
        mockPaymentFacade.process = mockPaymentFacade.process.mockResolvedValue(
          {
            transactionId: "1",
            orderId: "1",
            amount: 30,
            status: "approved",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        );

        const input: PlaceOrderInputDto = {
          clientId: "1",
          products: [{ productId: "1" }, { productId: "2" }],
        };

        const output = await placeOrderUseCase.execute(input);

        expect(output.invoiceId).toBe("1");
        expect(output.total).toBe(30);
        expect(output.products).toStrictEqual([
          { productId: "1" },
          { productId: "2" },
        ]);
        expect(mockClientFacade.find).toHaveBeenCalledTimes(1);
        expect(mockClientFacade.find).toHaveBeenCalledWith({ id: "1" });
        expect(mockValidateProducts).toHaveBeenCalledTimes(1);
        expect(mockValidateProducts).toHaveBeenCalledWith(input);
        expect(mockGetProduct).toHaveBeenCalledTimes(2);
        expect(mockCheckoutRepository.addOrder).toHaveBeenCalledTimes(1);
        expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
        expect(mockPaymentFacade.process).toHaveBeenCalledWith({
          orderId: output.id,
          amount: output.total,
        });
        expect(mockInvoiceFacade.generate).toHaveBeenCalledTimes(1);
        expect(mockInvoiceFacade.generate).toHaveBeenCalledWith({
          name: clientProps.name,
          document: clientProps.document,
          street: clientProps.address.street,
          number: clientProps.address.number,
          complement: clientProps.address.complement,
          city: clientProps.address.city,
          state: clientProps.address.state,
          zipCode: clientProps.address.zipCode,
          items: [
            {
              id: products["1"].id.value,
              name: products["1"].name,
              price: products["1"].salesPrice,
            },
            {
              id: products["2"].id.value,
              name: products["2"].name,
              price: products["2"].salesPrice,
            },
          ],
        });
      });
    });
  });
});
