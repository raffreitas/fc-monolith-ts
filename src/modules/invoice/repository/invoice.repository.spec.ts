import { DataSource } from "typeorm";
import { Address } from "../../@shared/domain/value-object/address";
import { Id } from "../../@shared/domain/value-object/id.value-object";
import { Invoice } from "../domain/invoice.entity";
import { InvoiceItem } from "../domain/invoice-item.entity";
import { InvoiceModel } from "./invoice.model";
import { InvoiceRepository } from "./invoice.repository";
import { InvoiceItemModel } from "./invoice-item.model";

describe("invoice repository test", () => {
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

  it("should create a new invoice", async () => {
    // Arrange
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

    const repository = new InvoiceRepository(typeorm);

    // Act
    await repository.add(invoice);

    // Assert
    const invoiceDb = await typeorm.getRepository(InvoiceModel).findOneOrFail({ where: { id: "1" }, relations: ["items"] });

    expect(invoiceDb).toBeDefined();
    expect(invoiceDb.id).toEqual(invoice.id.value);
    expect(invoiceDb.name).toEqual(invoice.name);
    expect(invoiceDb.document).toEqual(invoice.document);
    expect(invoiceDb.street).toEqual(invoice.address.street);
    expect(invoiceDb.number).toEqual(invoice.address.number);
    expect(invoiceDb.complement).toEqual(invoice.address.complement);
    expect(invoiceDb.city).toEqual(invoice.address.city);
    expect(invoiceDb.state).toEqual(invoice.address.state);
    expect(invoiceDb.zipcode).toEqual(invoice.address.zipCode);
    expect(invoiceDb.items.length).toBe(2);
    expect(invoiceDb.items[0].id).toEqual(invoice.items[0].id.value);
    expect(invoiceDb.items[0].name).toEqual(invoice.items[0].name);
    expect(invoiceDb.items[0].price).toEqual(invoice.items[0].price);
    expect(invoiceDb.items[1].id).toEqual(invoice.items[1].id.value);
    expect(invoiceDb.items[1].name).toEqual(invoice.items[1].name);
    expect(invoiceDb.items[1].price).toEqual(invoice.items[1].price);
  });

  it("should find a invoice", async () => {
    // Arrange
    const typeormRepository = typeorm.getRepository(InvoiceModel);
    const invoice = typeormRepository.create({
      id: "1",
      name: "Invoice 1",
      document: "Document 1",
      street: "Street 1",
      number: "99",
      complement: "Complement 1",
      city: "City 1",
      state: "State 1",
      zipcode: "ZipCode 1",
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
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await typeormRepository.save(invoice);

    const repository = new InvoiceRepository(typeorm);

    // Act
    const result = await repository.find("1");

    // Assert
    expect(result.id.value).toEqual(invoice.id);
    expect(result.name).toEqual(invoice.name);
    expect(result.document).toEqual(invoice.document);
    expect(result.address.street).toEqual(invoice.street);
    expect(result.address.number).toEqual(invoice.number);
    expect(result.address.complement).toEqual(invoice.complement);
    expect(result.address.city).toEqual(invoice.city);
    expect(result.address.state).toEqual(invoice.state);
    expect(result.address.zipCode).toEqual(invoice.zipcode);
    expect(result.items.length).toBe(2);
    expect(result.items[0].id.value).toEqual(invoice.items[0].id);
    expect(result.items[0].name).toEqual(invoice.items[0].name);
    expect(result.items[0].price).toEqual(invoice.items[0].price);
    expect(result.items[1].id.value).toEqual(invoice.items[1].id);
    expect(result.items[1].name).toEqual(invoice.items[1].name);
    expect(result.items[1].price).toEqual(invoice.items[1].price);
  });
});
