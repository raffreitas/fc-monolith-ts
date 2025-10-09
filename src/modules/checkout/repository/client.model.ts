import { Column, Entity, PrimaryColumn } from "typeorm";


@Entity({ name: "clients", })
export class ClientModel {
  @PrimaryColumn("uuid")
  declare id: string;

  @Column("varchar")
  declare name: string;

  @Column("varchar")
  declare email: string;

  @Column("varchar", { name: "street" })
  declare address: string;
}
