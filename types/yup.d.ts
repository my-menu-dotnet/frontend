import { StringSchema, ObjectSchema } from "yup";

declare module "yup" {
  interface StringSchema {
    cpf(message?: string): StringSchema;
    password(message?: string): StringSchema;
    fullName(message?: string): StringSchema;
    cep(message?: string): StringSchema
  }
  interface ObjectSchema<T extends object> {
    address(): ObjectSchema<T>;
  }
}
