import type { DataSource, Repository } from "typeorm";
import { Transaction } from "../domain/transaction.entity";
import type { PaymentGateway } from "../gateway/payment.gateway";
import { TransactionModel } from "./transaction.model";

export class TransactionRepository implements PaymentGateway {
  private repository: Repository<TransactionModel>;

  constructor(private readonly typeorm: DataSource) {
    this.repository = this.typeorm.getRepository(TransactionModel);
  }

  async save(input: Transaction): Promise<Transaction> {
    await this.repository.save({
      id: input.id.value,
      orderId: input.orderId,
      amount: input.amount,
      status: input.status,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt,
    });

    return new Transaction({
      id: input.id,
      orderId: input.orderId,
      amount: input.amount,
      status: input.status,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt,
    });
  }
}
