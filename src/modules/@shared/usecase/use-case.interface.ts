export interface UseCaseInterface<Input = void, Output = void> {
  execute(input: Input): Promise<Output>;
}
