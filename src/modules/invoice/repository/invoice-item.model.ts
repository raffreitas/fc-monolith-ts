import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { InvoiceModel } from "./invoice.model";

@Entity({ name: "invoice_items" })
export class InvoiceItemModel {
  @PrimaryColumn('uuid')
  declare id: string;

  @Column('varchar')
  declare name: string;

  @Column('decimal')
  declare price: number;

  @ManyToOne(() => InvoiceModel, (invoice) => invoice.items)
  @JoinColumn({ name: "invoice_id" })
  declare invoice: InvoiceModel;
}
