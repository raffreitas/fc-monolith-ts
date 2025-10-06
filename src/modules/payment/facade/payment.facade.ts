import type { UseCaseInterface } from "../../@shared/usecase/use-case.interface";
import type {
  ProcessPaymentInputDto,
  ProcessPaymentOutputDto,
} from "../usecase/process-payment/process-payment.dto";
import type PaymentFacadeInterface from "./payment.facade.interface";
import type {
  PaymentFacadeInputDto,
  PaymentFacadeOutputDto,
} from "./payment.facade.interface";

export default class PaymentFacade implements PaymentFacadeInterface {
  constructor(private readonly processPaymentUseCase: UseCaseInterface<ProcessPaymentInputDto, ProcessPaymentOutputDto>) { }

  async process(input: PaymentFacadeInputDto): Promise<PaymentFacadeOutputDto> {
    return await this.processPaymentUseCase.execute(input);
  }
}
