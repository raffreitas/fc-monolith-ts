import type { DataSource, Repository } from "typeorm";
import { Address } from "../../@shared/domain/value-object/address";
import { Id } from "../../@shared/domain/value-object/id.value-object";
import { Invoice } from "../domain/invoice.entity";
import { InvoiceItem } from "../domain/invoice-item.entity";
import type { InvoiceGateway } from "../gateway/invoice.gateway";
import { InvoiceModel } from "./invoice.model";

export class InvoiceRepository implements InvoiceGateway {
  private repository: Repository<InvoiceModel>;

  constructor(private readonly typeorm: DataSource) {
    this.repository = this.typeorm.getRepository(InvoiceModel);
  }

  async find(id: string): Promise<Invoice> {
    const invoice = await this.repository.findOne({
      where: { id },
      relations: ["items"],
    });

    if (!invoice) {
      throw new Error("Invoice not found");
    }

    return new Invoice({
      id: new Id(invoice.id),
      name: invoice.name,
      document: invoice.document,
      address: new Address(
        invoice.street,
        invoice.number,
        invoice.complement,
        invoice.city,
        invoice.state,
        invoice.zipcode,
      ),
      items: invoice.items.map((item) =>
        new InvoiceItem({
          id: new Id(item.id),
          name: item.name,
          price: item.price,
        }),
      ),
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt,
    });
  }
  async add(invoice: Invoice): Promise<void> {
    const invoiceModel = this.repository.create({
      id: invoice.id.value,
      name: invoice.name,
      document: invoice.document,
      street: invoice.address.street,
      number: invoice.address.number,
      complement: invoice.address.complement,
      city: invoice.address.city,
      state: invoice.address.state,
      zipcode: invoice.address.zipCode,
      items: invoice.items.map((item) => ({
        id: item.id.value,
        name: item.name,
        price: item.price,
      })),
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt,
    });

    await this.repository.save(invoiceModel);
  }
}
