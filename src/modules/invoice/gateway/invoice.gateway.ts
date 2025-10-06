import type { Invoice } from "../domain/invoice.entity";

export interface InvoiceGateway {
  find(id: string): Promise<Invoice>;
  add(client: Invoice): Promise<void>;
}
