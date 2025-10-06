import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { InvoiceItemModel } from "./invoice-item.model";

@Entity({ name: "invoices" })
export class InvoiceModel {

  @PrimaryColumn('uuid')
  declare id: string;

  @Column('varchar')
  declare name: string;

  @Column('varchar')
  declare document: string;

  @Column("varchar")
  declare street: string

  @Column("varchar")
  declare number: string

  @Column({ nullable: true, type: "varchar" })
  declare complement: string

  @Column("varchar")
  declare city: string

  @Column("varchar")
  declare state: string

  @Column("varchar")
  declare zipcode: string

  @Column("varchar")
  declare createdAt: Date

  @Column("varchar")
  declare updatedAt: Date

  @OneToMany(() => InvoiceItemModel, item => item.invoice, { cascade: true })
  declare items: InvoiceItemModel[];
}
