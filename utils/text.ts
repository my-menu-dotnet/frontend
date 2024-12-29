export const serrialize = (data: string) => {
  return data.replace(/\n/g, " <br /> ");
};

export const currency = (value: number) => {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};
