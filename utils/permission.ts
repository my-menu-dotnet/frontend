import { Permissions as PermissionType } from "@/types/api/Permission";

const Permissions = {
  address: [
    "address.street",
    "address.number",
    "address.complement",
    "address.neighborhood",
    "address.zip_code",
  ],
  contact: ["contact.email", "contact.phone"],
} as { [key: string]: (keyof PermissionType)[] };

const PermissionLabel = {
  "address.street": "Rua",
  "address.number": "Número",
  "address.complement": "Complemento",
  "address.neighborhood": "Bairro",
  "address.zip_code": "CEP",
  "contact.email": "E-mail",
  "contact.phone": "Telefone",
} as { [key: string]: string };

const PermissionTitleLabel = {
  address: "Endereço",
  contact: "Contato",
} as { [key: string]: string };

export { PermissionLabel, PermissionTitleLabel };
export default Permissions;
