import type { DataSource } from "typeorm";
import PaymentFacade from "../facade/payment.facade";
import type PaymentFacadeInterface from "../facade/payment.facade.interface";
import { TransactionRepository } from "../repository/transaction.repository";
import { ProcessPaymentUseCase } from "../usecase/process-payment/process-payment.usecase";

export class PaymentFacadeFactory {
  static create(dataSource: DataSource): PaymentFacadeInterface {
    const repository = new TransactionRepository(dataSource);
    const usecase = new ProcessPaymentUseCase(repository);
    const facade = new PaymentFacade(usecase);
    return facade;
  }
}
