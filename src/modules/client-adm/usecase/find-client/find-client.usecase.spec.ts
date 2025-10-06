import { Address } from "../../../@shared/domain/value-object/address"
import { Id } from "../../../@shared/domain/value-object/id.value-object"
import { Client } from "../../domain/client.entity"
import FindClientUseCase from "./find-client.usecase"

const client = new Client({
  id: new Id("1"),
  name: "John Doe",
  email: "john.doe@example.com",
  document: "12345678900",
  address: new Address(
    "Street 1",
    "01",
    "Complement 1",
    "City 1",
    "State 1",
    "ZipCode 1",
  )
})

const MockRepository = () => {
  return {
    add: vi.fn(),
    find: vi.fn().mockReturnValue(Promise.resolve(client))
  }
}

describe("find client usecase test", () => {
  it("should find a client", async () => {
    const repository = MockRepository()
    const usecase = new FindClientUseCase(repository)
    const input = { id: "1" }

    const result = await usecase.execute(input)

    expect(repository.find).toHaveBeenCalled()
    expect(result.id).toEqual(input.id)
    expect(result.name).toEqual(client.name)
    expect(result.email).toEqual(client.email)
    expect(result.address).toEqual(client.address)
    expect(result.createdAt).toEqual(client.createdAt)
    expect(result.updatedAt).toEqual(client.updatedAt)
  })
})
