import { Column, Entity, JoinTable, ManyToMany, OneToOne, PrimaryColumn } from "typeorm";
import { ClientModel } from "./client.model";
import { ProductModel } from "./product.model";

@Entity({ name: "orders", })
export class OrderModel {
  @PrimaryColumn("uuid")
  declare id: string;

  @Column("varchar")
  declare status: string;

  @OneToOne(() => ClientModel)
  declare client: ClientModel;

  @ManyToMany(() => ProductModel)
  @JoinTable({ name: "order_products" })
  declare products: ProductModel[];
}
