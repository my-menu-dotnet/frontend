import useSearchClients from "@/hooks/queries/client/useSearchClients";
import { Client } from "@/types/api/Client";
import { Autocomplete, AutocompleteItem, Spinner } from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";

type ClientAutocompleteProps = {
  value: string;
  onNameChange: (name: string) => void;
  onClientSelected: (client: Client | null) => void;
  isInvalid?: boolean;
  errorMessage?: string;
};

export default function ClientAutocomplete({
  value,
  onNameChange,
  onClientSelected,
  isInvalid,
  errorMessage,
}: ClientAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(inputValue), 250);
    return () => clearTimeout(t);
  }, [inputValue]);

  const { data: suggestions = [], isFetching } = useSearchClients(debouncedQuery);

  const items = useMemo(
    () => suggestions.map((c) => ({ key: c.id, ...c })),
    [suggestions]
  );

  const handleInputChange = (next: string) => {
    setInputValue(next);
    onNameChange(next);
    onClientSelected(null);
  };

  const handleSelectionChange = (key: React.Key | null) => {
    if (key === null) {
      onClientSelected(null);
      return;
    }
    const found = suggestions.find((c) => c.id === key);
    if (found) {
      setInputValue(found.name);
      onNameChange(found.name);
      onClientSelected(found);
    }
  };

  return (
    <Autocomplete
      label="Nome do cliente"
      placeholder="Digite o nome do cliente"
      isRequired
      inputValue={inputValue}
      onInputChange={handleInputChange}
      onSelectionChange={(key) => handleSelectionChange(key)}
      items={items}
      isLoading={isFetching}
      isInvalid={isInvalid}
      errorMessage={errorMessage}
      allowsCustomValue
      variant="bordered"
      data-test="input-customer-name"
      classNames={{
        base: "w-full",
        listboxWrapper: "border-1 rounded-lg",
      }}
      listboxProps={{
        emptyContent: isFetching ? (
          <div className="flex items-center justify-center gap-2 py-2">
            <Spinner size="sm" /> <span>Buscando...</span>
          </div>
        ) : debouncedQuery.length >= 2 ? (
          "Nenhum cliente encontrado"
        ) : (
          "Digite ao menos 2 caracteres"
        ),
      }}
    >
      {(item) => (
        <AutocompleteItem
          key={item.key}
          textValue={item.name}
          data-test={`client-suggestion-${item.id}`}
        >
          <div className="flex flex-col">
            <span className="font-semibold">{item.name}</span>
            {(item.phone || item.email) && (
              <span className="text-xs text-gray-500">
                {item.phone}
                {item.phone && item.email ? " • " : ""}
                {item.email}
              </span>
            )}
          </div>
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
}
