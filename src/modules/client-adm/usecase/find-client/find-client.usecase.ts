import { Address } from "../../../@shared/domain/value-object/address";
import type { UseCaseInterface } from "../../../@shared/usecase/use-case.interface";
import type { ClientGateway } from "../../gateway/client.gateway";
import type {
  FindClientUseCaseInputDto,
  FindClientUseCaseOutputDto,
} from "./find-client.dto";

export default class FindClientUseCase implements UseCaseInterface<FindClientUseCaseInputDto, FindClientUseCaseOutputDto> {

  constructor(private readonly clientRepository: ClientGateway) { }

  async execute(input: FindClientUseCaseInputDto,): Promise<FindClientUseCaseOutputDto> {
    const result = await this.clientRepository.find(input.id);

    return {
      id: result.id.value,
      name: result.name,
      email: result.email,
      document: result.document,
      address: new Address(
        result.address.street,
        result.address.number,
        result.address.complement,
        result.address.city,
        result.address.state,
        result.address.zipCode,
      ),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }
}
