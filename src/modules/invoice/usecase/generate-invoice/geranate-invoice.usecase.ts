import { Address } from "../../../@shared/domain/value-object/address";
import { Id } from "../../../@shared/domain/value-object/id.value-object";
import type { UseCaseInterface } from "../../../@shared/usecase/use-case.interface";
import { Invoice } from "../../domain/invoice.entity";
import { InvoiceItem } from "../../domain/invoice-item.entity";
import type { InvoiceGateway } from "../../gateway/invoice.gateway";
import type {
  GenerateInvoiceUseCaseInputDto,
  GenerateInvoiceUseCaseOutputDto,
} from "./generate-invoice.dto";

export class GenerateInvoiceUseCase implements UseCaseInterface<GenerateInvoiceUseCaseInputDto, GenerateInvoiceUseCaseOutputDto> {
  constructor(private readonly invoiceRepository: InvoiceGateway) { }

  async execute(input: GenerateInvoiceUseCaseInputDto,): Promise<GenerateInvoiceUseCaseOutputDto> {
    var invoice = new Invoice({
      name: input.name,
      document: input.document,
      address: new Address(
        input.street,
        input.number,
        input.complement,
        input.city,
        input.state,
        input.zipCode,
      ),
      items: input.items.map((item) => new InvoiceItem({
        id: new Id(item.id),
        name: item.name,
        price: item.price,
      }),
      ),
    });

    await this.invoiceRepository.add(invoice);

    return {
      id: invoice.id.value,
      name: invoice.name,
      document: invoice.document,
      street: invoice.address.street,
      number: invoice.address.number,
      complement: invoice.address.complement,
      city: invoice.address.city,
      state: invoice.address.state,
      zipCode: invoice.address.zipCode,
      items: invoice.items.map((item) => ({
        id: item.id.value,
        name: item.name,
        price: item.price,
      })),
      total: invoice.total,
    };
  }
}
