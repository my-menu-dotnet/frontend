const handleCpf = (value: string) => {
  return value
    .slice(0, 14)
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

const handleCep = (value: string) => {
  return value
    .slice(0, 9)
    .replace(/\D/g, "")
    .replace(/(\d{5})(\d{3})/, "$1-$2");
};

const handlePhone = (value: string) => {
  const cleanedValue = value.replace(/\D/g, "");
  if (cleanedValue.length <= 10) {
    return cleanedValue
      .slice(0, 10)
      .replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  } else {
    return cleanedValue
      .slice(0, 11)
      .replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, "($1) $2 $3-$4");
  }
};

export const masks = {
  cpf: handleCpf,
  cep: handleCep,
  phone: handlePhone,
} as { [key in "cpf" | "cep" | "phone"]: (value: string) => string };
