import { DataSource } from "typeorm";
import { InvoiceFacadeFactory } from "../factory/invoice.facade.factory";
import { InvoiceModel } from "../repository/invoice.model";
import { InvoiceItemModel } from "../repository/invoice-item.model";

describe("invoice facade tests", () => {
  let typeorm: DataSource;

  beforeEach(async () => {
    typeorm = new DataSource({
      type: "better-sqlite3",
      database: ":memory:",
      logging: false,
      synchronize: true,
      entities: [InvoiceModel, InvoiceItemModel],
    });

    await typeorm.initialize();
  });

  afterEach(async () => {
    if (typeorm?.isInitialized) {
      await typeorm.destroy();
    }
  });

  it("should create an invoice", async () => {
    var facade = InvoiceFacadeFactory.create(typeorm);
    const input = {
      name: "Invoice 1",
      document: "12345678900",
      street: "Street 1",
      number: "123",
      complement: "Complement 1",
      city: "City 1",
      state: "State 1",
      zipCode: "12345678",
      items: [
        {
          id: "1",
          name: "Item 1",
          price: 100,
        },
        {
          id: "2",
          name: "Item 2",
          price: 200,
        },
      ],
    };

    const output = await facade.generate(input);

    expect(output).toBeDefined();
    expect(output.id).toBeDefined();
    expect(output.name).toBe(input.name);
    expect(output.document).toBe(input.document);
    expect(output.street).toBe(input.street);
    expect(output.number).toBe(input.number);
    expect(output.complement).toBe(input.complement);
    expect(output.city).toBe(input.city);
    expect(output.state).toBe(input.state);
    expect(output.zipCode).toBe(input.zipCode);
    expect(output.items.length).toBe(2);
    expect(output.items[0].id).toBe(input.items[0].id);
    expect(output.items[0].name).toBe(input.items[0].name);
    expect(output.items[0].price).toBe(input.items[0].price);
    expect(output.items[1].id).toBe(input.items[1].id);
    expect(output.items[1].name).toBe(input.items[1].name);
    expect(output.items[1].price).toBe(input.items[1].price);
    expect(output.total).toBe(300);
  });

  it("should find an invoice", async () => {
    var facade = InvoiceFacadeFactory.create(typeorm);

    const createInput = {
      name: "Invoice 1",
      document: "12345678900",
      street: "Street 1",
      number: "123",
      complement: "Complement 1",
      city: "City 1",
      state: "State 1",
      zipCode: "12345678",
      items: [
        {
          id: "1",
          name: "Item 1",
          price: 100,
        },
        {
          id: "2",
          name: "Item 2",
          price: 200,
        },
      ],
    };

    const createdInvoice = await facade.generate(createInput);

    const findInput = {
      id: createdInvoice.id,
    };

    const output = await facade.find(findInput);

    expect(output).toBeDefined();
    expect(output.id).toBe(createdInvoice.id);
    expect(output.name).toBe("Invoice 1");
    expect(output.document).toBe("12345678900");
    expect(output.address.street).toBe("Street 1");
    expect(output.address.number).toBe("123");
    expect(output.address.complement).toBe("Complement 1");
    expect(output.address.city).toBe("City 1");
    expect(output.address.state).toBe("State 1");
    expect(output.address.zipCode).toBe("12345678");
    expect(output.items.length).toBe(2);
    expect(output.items[0].id).toBe("1");
    expect(output.items[0].name).toBe("Item 1");
    expect(output.items[0].price).toBe(100);
    expect(output.items[1].id).toBe("2");
    expect(output.items[1].name).toBe("Item 2");
    expect(output.items[1].price).toBe(200);
    expect(output.total).toBe(300);
    expect(output.createdAt).toBeDefined();
  });
});
