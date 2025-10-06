import { Address } from "../../../@shared/domain/value-object/address";
import { Id } from "../../../@shared/domain/value-object/id.value-object";
import type { UseCaseInterface } from "../../../@shared/usecase/use-case.interface";
import { Client } from "../../domain/client.entity";
import type { ClientGateway } from "../../gateway/client.gateway";
import type { AddClientInputDto, AddClientOutputDto } from "./add-client.dto";

export class AddClientUseCase implements UseCaseInterface<AddClientInputDto, AddClientOutputDto> {

  constructor(private readonly clientRepository: ClientGateway) { }

  async execute(input: AddClientInputDto): Promise<AddClientOutputDto> {
    const props = {
      id: new Id(input.id) || new Id(),
      name: input.name,
      email: input.email,
      document: input.document,
      address: new Address(
        input.address.street,
        input.address.number,
        input.address.complement,
        input.address.city,
        input.address.state,
        input.address.zipCode,
      ),
    };

    const client = new Client(props);
    await this.clientRepository.add(client);

    return {
      id: client.id.value,
      name: client.name,
      email: client.email,
      document: client.document,
      address: new Address(
        client.address.street,
        client.address.number,
        client.address.complement,
        client.address.city,
        client.address.state,
        client.address.zipCode,
      ),
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    };
  }
}
