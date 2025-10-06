import { DataSource } from "typeorm";
import { Id } from "../../@shared/domain/value-object/id.value-object";
import { Transaction } from "../domain/transaction.entity";
import { TransactionModel } from "./transaction.model";
import { TransactionRepository } from "./transaction.repository";

describe("transaction repository tests", () => {
  let typeorm: DataSource;

  beforeEach(async () => {
    typeorm = new DataSource({
      type: "better-sqlite3",
      database: ":memory:",
      logging: false,
      synchronize: true,
      entities: [TransactionModel],
    });

    await typeorm.initialize();
  });

  afterEach(async () => {
    if (typeorm?.isInitialized) {
      await typeorm.destroy();
    }
  });

  it("should save a transaction", async () => {
    const transaction = new Transaction({
      id: new Id("1"),
      amount: 100,
      orderId: "1",
    });
    transaction.approve();

    const repository = new TransactionRepository(typeorm);
    const result = await repository.save(transaction);

    expect(result.id.value).toBe(transaction.id.value);
    expect(result.status).toBe("approved");
    expect(result.amount).toBe(transaction.amount);
    expect(result.orderId).toBe(transaction.orderId);
  });
});
