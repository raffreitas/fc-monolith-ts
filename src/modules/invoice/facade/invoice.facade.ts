import type { UseCaseInterface } from "../../@shared/usecase/use-case.interface";
import type {
  FindInvoiceFacadeInputDTO,
  FindInvoiceFacadeOutputDTO,
  GenerateInvoiceUseCaseInputDto,
  GenerateInvoiceUseCaseOutputDto,
  InvoiceFacadeInterface,
} from "./invoice.facade.interface";

interface UseCaseProps {
  generateUsecase: UseCaseInterface<GenerateInvoiceUseCaseInputDto, GenerateInvoiceUseCaseOutputDto>;
  findUsecase: UseCaseInterface<FindInvoiceFacadeInputDTO, FindInvoiceFacadeOutputDTO>;
}

export class InvoiceFacade implements InvoiceFacadeInterface {
  private _generateUsecase: UseCaseInterface<GenerateInvoiceUseCaseInputDto, GenerateInvoiceUseCaseOutputDto>;
  private _findUsecase: UseCaseInterface<FindInvoiceFacadeInputDTO, FindInvoiceFacadeOutputDTO>;

  constructor(usecaseProps: UseCaseProps) {
    this._generateUsecase = usecaseProps.generateUsecase;
    this._findUsecase = usecaseProps.findUsecase;
  }

  async generate(input: GenerateInvoiceUseCaseInputDto): Promise<GenerateInvoiceUseCaseOutputDto> {
    return await this._generateUsecase.execute(input);
  }

  async find(input: FindInvoiceFacadeInputDTO): Promise<FindInvoiceFacadeOutputDTO> {
    return await this._findUsecase.execute(input);
  }
}
