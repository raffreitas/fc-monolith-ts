import { Id } from "../../../@shared/domain/value-object/id.value-object";
import type { UseCaseInterface } from "../../../@shared/usecase/use-case.interface";
import type ClientAdmFacadeInterface from "../../../client-adm/facade/client-adm.facade.interface";
import type { InvoiceFacadeInterface } from "../../../invoice/facade/invoice.facade.interface";
import type PaymentFacadeInterface from "../../../payment/facade/payment.facade.interface";
import type { ProductAdmFacadeInterface } from "../../../product-adm/facade/product-adm.facade.interface";
import type { StoreCatalogFacadeInterface } from "../../../store-catalog/facade/store-catalog.facade.interface";
import { Client } from "../../domain/client.entity";
import { Order } from "../../domain/order.entity";
import { Product } from "../../domain/product.entity";
import type { CheckoutGateway } from "../../gateway/checkout.gateway";
import type {
  PlaceOrderInputDto,
  PlaceOrderOutputDto,
} from "./place-order.dto";

export class PlaceOrderUseCase
  implements UseCaseInterface<PlaceOrderInputDto, PlaceOrderOutputDto>
{
  private _clientFacade: ClientAdmFacadeInterface;
  private _productFacade: ProductAdmFacadeInterface;
  private _catalogFacade: StoreCatalogFacadeInterface;
  private _checkoutRepository: CheckoutGateway;
  private _invoiceFacade: InvoiceFacadeInterface;
  private _paymentFacade: PaymentFacadeInterface;

  constructor(
    clientFacade: ClientAdmFacadeInterface,
    productFacade: ProductAdmFacadeInterface,
    catalogFacade: StoreCatalogFacadeInterface,
    checkoutRepository: CheckoutGateway,
    invoiceFacade: InvoiceFacadeInterface,
    paymentFacade: PaymentFacadeInterface,
  ) {
    this._clientFacade = clientFacade;
    this._productFacade = productFacade;
    this._catalogFacade = catalogFacade;
    this._checkoutRepository = checkoutRepository;
    this._invoiceFacade = invoiceFacade;
    this._paymentFacade = paymentFacade;
  }

  async execute(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> {
    const client = await this._clientFacade.find({ id: input.clientId });
    if (!client) {
      throw new Error("Client not found");
    }

    await this.validateProducts(input);

    const products = await Promise.all(
      input.products.map((p) => this.getProduct(p.productId)),
    );

    const myClient = new Client({
      id: new Id(client.id),
      name: client.name,
      email: client.email,
      address: client.address.street,
    });

    const order = new Order({
      client: myClient,
      products: products,
    });

    const payment = await this._paymentFacade.process({
      orderId: order.id.value,
      amount: order.total,
    });

    const invoice =
      payment.status === "approved"
        ? await this._invoiceFacade.generate({
            name: client.name,
            document: client.document,
            street: client.address.street,
            number: client.address.number,
            complement: client.address.complement,
            city: client.address.city,
            state: client.address.state,
            zipCode: client.address.zipCode,
            items: products.map((p) => ({
              id: p.id.value,
              name: p.name,
              price: p.salesPrice,
            })),
          })
        : null;

    if (payment.status === "approved") {
      order.approved();
    }

    this._checkoutRepository.addOrder(order);

    return {
      id: order.id.value,
      invoiceId: invoice ? invoice.id : null,
      status: order.status,
      total: order.total,
      products: products.map((p) => ({
        productId: p.id.value,
      })),
    };
  }

  private async validateProducts(input: PlaceOrderInputDto): Promise<void> {
    if (input.products.length === 0) {
      throw new Error("No products selected");
    }

    for (const p of input.products) {
      const product = await this._productFacade.checkStock({
        productId: p.productId,
      });
      if (product.stock <= 0) {
        throw new Error(`Product ${p.productId} is not available in stock`);
      }
    }
  }

  private async getProduct(productId: string): Promise<Product> {
    var product = await this._catalogFacade.find({ id: productId });
    if (!product) {
      throw new Error("Product not found");
    }

    const productProps = {
      id: new Id(product.id),
      name: product.name,
      description: product.description,
      salesPrice: product.salesPrice,
    };
    return new Product(productProps);
  }
}
