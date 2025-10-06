import { DataSource } from "typeorm";
import { Address } from "../../@shared/domain/value-object/address";
import { ClientAdmFacadeFactory } from "../factory/client-adm.facade.factory";
import { ClientModel } from "../repository/client.model";
import { ClientRepository } from "../repository/client.repository";
import { AddClientUseCase } from "../usecase/add-client/add-client.usecase";
import ClientAdmFacade from "./client-adm.facade";

describe("client adm facade tests", () => {
  let typeorm: DataSource;

  beforeEach(async () => {
    typeorm = new DataSource({
      type: "better-sqlite3",
      database: ":memory:",
      logging: false,
      synchronize: true,
      entities: [ClientModel],
    });

    await typeorm.initialize();
  });

  afterEach(async () => {
    if (typeorm?.isInitialized) {
      await typeorm.destroy();
    }
  });

  it("should create a client", async () => {
    const repository = new ClientRepository(typeorm);
    const addUsecase = new AddClientUseCase(repository);
    const facade = new ClientAdmFacade({
      addUsecase: addUsecase,
      // biome-ignore lint/suspicious/noExplicitAny: ignore
      findUsecase: undefined as any,
    });

    const input = {
      id: "1",
      name: "John Doe",
      email: "john@doe.com",
      document: "1234-5678",
      address: new Address(
        "Street 1",
        "99",
        "Complement 1",
        "City 1",
        "State 1",
        "ZipCode 1",
      ),
    };

    await facade.add(input);

    const client = await typeorm
      .getRepository(ClientModel)
      .findOneOrFail({ where: { id: "1" } });

    expect(client).toBeDefined();
    expect(client.id).toBe(input.id);
    expect(client.name).toBe(input.name);
    expect(client.email).toBe(input.email);
    expect(client.document).toBe(input.document);
    expect(client.street).toBe(input.address.street);
  });

  it("should find a client", async () => {
    const facade = ClientAdmFacadeFactory.create(typeorm);

    const input = {
      id: "1",
      name: "John Doe",
      email: "john@doe.com",
      document: "1234-5678",
      address: new Address(
        "Street 1",
        "99",
        "Complement 1",
        "City 1",
        "State 1",
        "ZipCode 1",
      ),
    };

    await facade.add(input);

    const client = await facade.find({ id: "1" });

    expect(client).toBeDefined();
    expect(client.id).toBe(input.id);
    expect(client.name).toBe(input.name);
    expect(client.email).toBe(input.email);
    expect(client.document).toBe(input.document);
    expect(client.address.street).toBe(input.address.street);
    expect(client.address.number).toBe(input.address.number);
    expect(client.address.complement).toBe(input.address.complement);
    expect(client.address.city).toBe(input.address.city);
    expect(client.address.state).toBe(input.address.state);
    expect(client.address.zipCode).toBe(input.address.zipCode);
  });
});
