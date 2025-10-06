import type { DataSource, Repository } from "typeorm";
import { Address } from "../../@shared/domain/value-object/address";
import { Id } from "../../@shared/domain/value-object/id.value-object";
import { Client } from "../domain/client.entity";
import type { ClientGateway } from "../gateway/client.gateway";
import { ClientModel } from "./client.model";

export class ClientRepository implements ClientGateway {
  private repository: Repository<ClientModel>;

  constructor(private readonly typeorm: DataSource) {
    this.repository = this.typeorm.getRepository(ClientModel);
  }

  async add(entity: Client): Promise<void> {
    await this.repository.insert({
      id: entity.id.value,
      name: entity.name,
      email: entity.email,
      document: entity.document,
      street: entity.address.street,
      number: entity.address.number,
      complement: entity.address.complement,
      city: entity.address.city,
      state: entity.address.state,
      zipcode: entity.address.zipCode,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  async find(id: string): Promise<Client> {
    const client = await this.repository.findOneBy({ id });

    if (!client) {
      throw new Error("Client not found");
    }

    return new Client({
      id: new Id(client.id),
      name: client.name,
      email: client.email,
      document: client.document,
      address: new Address(
        client.street,
        client.number,
        client.complement,
        client.city,
        client.state,
        client.zipcode,
      ),
      createdAt: client.createdAt,
      updatedAt: client.createdAt,
    });
  }
}
