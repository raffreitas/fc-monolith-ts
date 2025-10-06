import { Address } from "../../../@shared/domain/value-object/address";
import { Id } from "../../../@shared/domain/value-object/id.value-object";
import { Invoice } from "../../domain/invoice.entity";
import { InvoiceItem } from "../../domain/invoice-item.entity";
import { FindInvoiceUseCase } from "./find-invoice.usecase";

const InvoiceRepository = () => {
  return {
    find: vi.fn(),
    add: vi.fn(),
  };
};

describe("find invoice usecase test", () => {
  it("should find a invoice", async () => {
    // Arrange
    const invoiceRepository = InvoiceRepository();
    const usecase = new FindInvoiceUseCase(invoiceRepository);

    const input = {
      id: "1",
    };

    const invoice = new Invoice({
      id: new Id("1"),
      name: "Invoice 1",
      document: "Document 1",
      address: new Address(
        "Street 1",
        "99",
        "Complement 1",
        "City 1",
        "State 1",
        "ZipCode 1",
      ),
      items: [
        new InvoiceItem({
          id: new Id("1"),
          name: "Item 1",
          price: 100,
        }),
        new InvoiceItem({
          id: new Id("2"),
          name: "Item 2",
          price: 200,
        }),
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    invoiceRepository.find.mockResolvedValue(invoice);

    // Act
    const output = await usecase.execute(input);

    // Assert
    expect(output).toBeDefined();
    expect(output.id).toBe(invoice.id.value);
    expect(output.name).toBe(invoice.name);
    expect(output.document).toBe(invoice.document);
    expect(output.address.street).toBe(invoice.address.street);
    expect(output.address.number).toBe(invoice.address.number);
    expect(output.address.complement).toBe(invoice.address.complement);
    expect(output.address.city).toBe(invoice.address.city);
    expect(output.address.state).toBe(invoice.address.state);
    expect(output.address.zipCode).toBe(invoice.address.zipCode);
    expect(output.items.length).toBe(2);
    expect(output.items[0].id).toBe(invoice.items[0].id.value);
    expect(output.items[0].name).toBe(invoice.items[0].name);
    expect(output.items[0].price).toBe(invoice.items[0].price);
    expect(output.items[1].id).toBe(invoice.items[1].id.value);
    expect(output.items[1].name).toBe(invoice.items[1].name);
    expect(output.items[1].price).toBe(invoice.items[1].price);
    expect(output.total).toBe(300);
    expect(output.createdAt).toBe(invoice.createdAt);
  });
});
