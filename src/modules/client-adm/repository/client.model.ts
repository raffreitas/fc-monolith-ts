import { Column, Entity, PrimaryColumn } from "typeorm"

@Entity({ name: 'client' })
export class ClientModel {
  @PrimaryColumn("uuid")
  declare id: string

  @Column("varchar")
  declare name: string

  @Column("varchar")
  declare email: string

  @Column("varchar")
  declare document: string

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
}
