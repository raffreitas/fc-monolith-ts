import { Address } from "../../../@shared/domain/value-object/address"
import { AddClientUseCase } from "./add-client.usecase"

const MockRepository = () => {
  return {
    add: vi.fn(),
    find: vi.fn()
  }
}

describe("add client usecase test", () => {
  it("should add a client", async () => {
    const repository = MockRepository()
    const usecase = new AddClientUseCase(repository)

    const input = {
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
      )
    }

    const result = await usecase.execute(input)

    expect(repository.add).toHaveBeenCalled()
    expect(result.id).toBeDefined()
    expect(result.name).toEqual(input.name)
    expect(result.email).toEqual(input.email)
    expect(result.address).toEqual(input.address)
  })
})
