import type { UseCaseInterface } from "../../@shared/usecase/use-case.interface";
import type { AddClientInputDto, AddClientOutputDto } from "../usecase/add-client/add-client.dto";
import type { FindClientUseCaseOutputDto } from "../usecase/find-client/find-client.dto";
import type ClientAdmFacadeInterface from "./client-adm.facade.interface";
import type {
  AddClientFacadeInputDto,
  FindClientFacadeInputDto,
  FindClientFacadeOutputDto,
} from "./client-adm.facade.interface";

export interface UseCaseProps {
  findUsecase: UseCaseInterface<
    FindClientFacadeInputDto,
    FindClientUseCaseOutputDto
  >;
  addUsecase: UseCaseInterface<AddClientInputDto, AddClientOutputDto>;
}

export default class ClientAdmFacade implements ClientAdmFacadeInterface {
  private _findUsecase: UseCaseInterface<FindClientFacadeInputDto, FindClientUseCaseOutputDto>;
  private _addUsecase: UseCaseInterface<AddClientInputDto, AddClientOutputDto>;

  constructor(usecaseProps: UseCaseProps) {
    this._findUsecase = usecaseProps.findUsecase;
    this._addUsecase = usecaseProps.addUsecase;
  }

  async add(input: AddClientFacadeInputDto): Promise<void> {
    await this._addUsecase.execute(input);
  }
  async find(input: FindClientFacadeInputDto): Promise<FindClientFacadeOutputDto> {
    return await this._findUsecase.execute(input);
  }
}
