import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "transactions" })
export class TransactionModel {
  @PrimaryColumn("uuid")
  declare id: string;

  @Column({ type: "varchar", name: "order_id" })
  declare orderId: string;

  @Column("decimal")
  declare amount: number;

  @Column("varchar")
  declare status: string;

  @Column({ type: "datetime", name: "created_at" })
  declare createdAt: Date;

  @Column({ type: "datetime", name: "updated_at" })
  declare updatedAt: Date;
}
