import type { DataSource } from "typeorm";
import { InvoiceFacade } from "../facade/invoice.facade";
import { InvoiceRepository } from "../repository/invoice.repository";
import { FindInvoiceUseCase } from "../usecase/find-invoice/find-invoice.usecase";
import { GenerateInvoiceUseCase } from "../usecase/generate-invoice/geranate-invoice.usecase";

export class InvoiceFacadeFactory {
  static create(dataSource: DataSource) {
    const repository = new InvoiceRepository(dataSource);
    const findUsecase = new FindInvoiceUseCase(repository);
    const generateUsecase = new GenerateInvoiceUseCase(repository);
    const facade = new InvoiceFacade({
      generateUsecase,
      findUsecase,
    });

    return facade;
  }
}
