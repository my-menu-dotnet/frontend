export function validateImageFileType(file: File | null | undefined) {
  if (!file) {
    throw new Error("O arquivo é obrigatório.");
  }

  const types = ["image/jpeg", "image/png"];
  return types.includes(file.type);
}
