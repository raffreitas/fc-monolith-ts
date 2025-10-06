import { DataSource } from "typeorm";
import { PaymentFacadeFactory } from "../factory/payment.facade.factory";
import { TransactionModel } from "../repository/transaction.model";

describe("PaymentFacade test", () => {
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

  it("should create a transaction", async () => {
    const facade = PaymentFacadeFactory.create(typeorm);

    const input = {
      orderId: "order-1",
      amount: 100,
    };

    const output = await facade.process(input);

    expect(output.transactionId).toBeDefined();
    expect(output.orderId).toBe(input.orderId);
    expect(output.amount).toBe(input.amount);
    expect(output.status).toBe("approved");
  });
});
