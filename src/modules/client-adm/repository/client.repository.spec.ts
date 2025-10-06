import { DataSource } from "typeorm";
import { Address } from "../../@shared/domain/value-object/address";
import { Id } from "../../@shared/domain/value-object/id.value-object";
import { Client } from "../domain/client.entity";
import { ClientModel } from "./client.model";
import { ClientRepository } from "./client.repository";

describe("Client Repository test", () => {
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
    const client = new Client({
      id: new Id("1"),
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
    });

    const repository = new ClientRepository(typeorm);
    await repository.add(client);

    const clientDb = await typeorm.getRepository(ClientModel).findOneByOrFail({ id: "1" });

    expect(clientDb).toBeDefined();
    expect(clientDb.id).toEqual(client.id.value);
    expect(clientDb.name).toEqual(client.name);
    expect(clientDb.email).toEqual(client.email);
    expect(clientDb.document).toEqual(client.document);
    expect(clientDb.street).toEqual(client.address.street);
    expect(clientDb.number).toEqual(client.address.number);
    expect(clientDb.complement).toEqual(client.address.complement);
    expect(clientDb.city).toEqual(client.address.city);
    expect(clientDb.state).toEqual(client.address.state);
    expect(clientDb.zipcode).toEqual(client.address.zipCode);
  });

  it("should find a client", async () => {
    const typeormRepository = typeorm.getRepository(ClientModel);
    const client = typeormRepository.create({
      id: "1",
      name: "John Doe",
      email: "john@doe.com",
      document: "1234-5678",
      street: "Street 1",
      number: "99",
      complement: "Complement 1",
      city: "City 1",
      state: "State 1",
      zipcode: "ZipCode 1",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await typeormRepository.save(client);

    const repository = new ClientRepository(typeorm);
    const result = await repository.find(client.id);

    expect(result.id.value).toEqual(client.id);
    expect(result.name).toEqual(client.name);
    expect(result.email).toEqual(client.email);
    expect(result.address.street).toEqual(client.street);
    expect(result.address.number).toEqual(client.number);
    expect(result.address.complement).toEqual(client.complement);
    expect(result.address.city).toEqual(client.city);
    expect(result.address.state).toEqual(client.state);
    expect(result.address.zipCode).toEqual(client.zipcode);
  });
});
