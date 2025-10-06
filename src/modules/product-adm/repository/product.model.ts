import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "products" })
export class ProductModel {
  @PrimaryColumn("uuid")
  declare id: string;

  @Column("varchar")
  declare name: string;

  @Column("varchar")
  declare description: string;

  @Column("decimal", { name: "price" })
  declare purchasePrice: number;

  @Column("int")
  declare stock: number;

  @Column("datetime")
  declare createdAt: Date;

  @Column("datetime")
  declare updatedAt: Date;
}
