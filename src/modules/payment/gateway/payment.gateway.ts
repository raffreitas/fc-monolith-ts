import type { Transaction } from "../domain/transaction.entity";

export interface PaymentGateway {
  save(input: Transaction): Promise<Transaction>;
}
