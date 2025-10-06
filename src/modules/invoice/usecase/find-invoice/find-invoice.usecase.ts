import type { UseCaseInterface } from "../../../@shared/usecase/use-case.interface";
import type { InvoiceGateway } from "../../gateway/invoice.gateway";
import type {
  FindInvoiceUseCaseInputDTO,
  FindInvoiceUseCaseOutputDTO,
} from "./find-invoice.dto";

export class FindInvoiceUseCase
  implements
  UseCaseInterface<FindInvoiceUseCaseInputDTO, FindInvoiceUseCaseOutputDTO> {
  constructor(private readonly invoiceRepository: InvoiceGateway) { }

  async execute(input: FindInvoiceUseCaseInputDTO,): Promise<FindInvoiceUseCaseOutputDTO> {
    var invoice = await this.invoiceRepository.find(input.id);

    return {
      id: invoice.id.value,
      name: invoice.name,
      document: invoice.document,
      address: {
        street: invoice.address.street,
        number: invoice.address.number,
        complement: invoice.address.complement,
        city: invoice.address.city,
        state: invoice.address.state,
        zipCode: invoice.address.zipCode,
      },
      items: invoice.items.map((item) => ({
        id: item.id.value,
        name: item.name,
        price: item.price,
      })),
      total: invoice.total,
      createdAt: invoice.createdAt,
    };
  }
}
