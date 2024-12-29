import { DiscountsStatus } from "@/types/api/Discounts";
import { StatesProps } from "@/types/lists";

export const months = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export const states = [
  { key: "AC", label: "Acre" },
  { key: "AL", label: "Alagoas" },
  { key: "AP", label: "Amapá" },
  { key: "AM", label: "Amazonas" },
  { key: "BA", label: "Bahia" },
  { key: "CE", label: "Ceará" },
  { key: "DF", label: "Distrito Federal" },
  { key: "ES", label: "Espírito Santo" },
  { key: "GO", label: "Goiás" },
  { key: "MA", label: "Maranhão" },
  { key: "MT", label: "Mato Grosso" },
  { key: "MS", label: "Mato Grosso do Sul" },
  { key: "MG", label: "Minas Gerais" },
  { key: "PA", label: "Pará" },
  { key: "PB", label: "Paraíba" },
  { key: "PR", label: "Paraná" },
  { key: "PE", label: "Pernambuco" },
  { key: "PI", label: "Piauí" },
  { key: "RJ", label: "Rio de Janeiro" },
  { key: "RN", label: "Rio Grande do Norte" },
  { key: "RS", label: "Rio Grande do Sul" },
  { key: "RO", label: "Rondônia" },
  { key: "RR", label: "Roraima" },
  { key: "SC", label: "Santa Catarina" },
  { key: "SP", label: "São Paulo" },
  { key: "SE", label: "Sergipe" },
  { key: "TO", label: "Tocantins" },
] as StatesProps[];

export const status = [
  { key: "ACTIVE", label: "Ativo" },
  { key: "INACTIVE", label: "Inativo" },
];

export const discountsStatusColors = {
  ACTIVE: "success",
  INACTIVE: "default",
  EXPIRED: "danger",
  PENDING: "warning",
} as {
  [key in DiscountsStatus]:
    | "success"
    | "default"
    | "danger"
    | "warning"
    | "foreground"
    | "primary"
    | "secondary";
};

export const discountsStatusMasks = {
  ACTIVE: "Ativo",
  INACTIVE: "Inativo",
  EXPIRED: "Expirado",
  PENDING: "Pendente",
} as { [key in DiscountsStatus]: string };
