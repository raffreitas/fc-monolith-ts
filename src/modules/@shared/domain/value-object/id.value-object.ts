import { randomUUID } from "node:crypto";
import type { ValueObject } from "./value-object.interface";

export class Id implements ValueObject {
  private readonly _value: string;

  constructor(value?: string) {
    this._value = value ?? randomUUID();
  }

  get value(): string {
    return this._value;
  }
}
