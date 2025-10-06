import type { UseCaseInterface } from "../../../@shared/usecase/use-case.interface";
import { Transaction } from "../../domain/transaction.entity";
import type { PaymentGateway } from "../../gateway/payment.gateway";
import type {
  ProcessPaymentInputDto,
  ProcessPaymentOutputDto,
} from "./process-payment.dto";

export class ProcessPaymentUseCase implements UseCaseInterface<ProcessPaymentInputDto, ProcessPaymentOutputDto> {
  constructor(private readonly transactionRepository: PaymentGateway) { }

  async execute(input: ProcessPaymentInputDto): Promise<ProcessPaymentOutputDto> {
    const transaction = new Transaction({
      amount: input.amount,
      orderId: input.orderId,
    });

    transaction.process();

    const persistTransaction = await this.transactionRepository.save(transaction);

    return {
      transactionId: persistTransaction.id.value,
      orderId: persistTransaction.orderId,
      amount: persistTransaction.amount,
      status: persistTransaction.status,
      createdAt: persistTransaction.createdAt,
      updatedAt: persistTransaction.updatedAt,
    };
  }
}
