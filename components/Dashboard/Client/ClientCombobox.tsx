import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import useSearchClients from "@/hooks/queries/client/useSearchClients";
import { Client } from "@/types/api/Client";
import { Loader2Icon } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";

type ClientComboboxProps = {
  value: string;
  onNameChange: (name: string) => void;
  onClientSelected: (client: Client | null) => void;
  isInvalid?: boolean;
  errorMessage?: string;
};

export default function ClientCombobox({
  value,
  onNameChange,
  onClientSelected,
  isInvalid,
  errorMessage,
}: ClientComboboxProps) {
  const [inputValue, setInputValue] = useState(value || "");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  useEffect(() => {
    setInputValue(value || "");
    if (!value) setSelectedClient(null);
  }, [value]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(inputValue), 250);
    return () => clearTimeout(t);
  }, [inputValue]);

  const { data: clients = [], isFetching } = useSearchClients(debouncedQuery);

  const queryLength = debouncedQuery.trim().length;

  // Mantém o cliente selecionado visível na lista mesmo quando não
  // corresponde ao termo da busca (ex: formulário de edição)
  const displayItems = useMemo(() => {
    if (selectedClient && !clients.some((c) => c.id === selectedClient.id)) {
      return [selectedClient, ...clients];
    }
    return clients;
  }, [clients, selectedClient]);

  const handleInputValueChange = (
    newVal: string,
    eventDetails?: { reason?: string }
  ) => {
    setInputValue(newVal);

    // Só propaga para o form quando é digitação do usuário ou seleção de item.
    // Bloqueia 'focus-out' (blur) para não limpar o formulário.
    if (
      eventDetails?.reason &&
      eventDetails.reason !== "input-change" &&
      eventDetails.reason !== "item-press"
    ) {
      return;
    }

    onNameChange(newVal);
    if (selectedClient && newVal !== selectedClient.name) {
      setSelectedClient(null);
      onClientSelected(null);
    }
  };

  const handleValueChange = (
    client: Client | null,
    _eventDetails?: { reason?: string }
  ) => {
    if (!client) {
      setSelectedClient(null);
      onClientSelected(null);
      return;
    }

    setSelectedClient(client);
    setInputValue(client.name);
    onNameChange(client.name);
    onClientSelected(client);
  };

  return (
    <FieldGroup>
      <Field data-invalid={isInvalid}>
        <FieldLabel htmlFor="client-combobox-input">
          Nome do cliente
        </FieldLabel>

        <Combobox
          items={displayItems}
          filter={null}
          value={selectedClient}
          onValueChange={handleValueChange}
          inputValue={inputValue}
          onInputValueChange={handleInputValueChange}
          itemToStringLabel={(client: Client) => client.name}
          itemToStringValue={(client: Client) => client.id}
          modal
        >
          <ComboboxInput
            id="client-combobox-input"
            placeholder="Digite o nome do cliente"
            showTrigger
            showClear
            aria-invalid={isInvalid}
            data-test="input-customer-name"
          />

          <ComboboxContent>
            {isFetching && displayItems.length === 0 && (
              <div className="flex items-center gap-2 p-3 text-sm text-muted-foreground">
                <Loader2Icon className="size-4 animate-spin" />
                Buscando clientes...
              </div>
            )}

            <ComboboxEmpty data-test="client-combobox-empty">
              {queryLength >= 2
                ? "Nenhum cliente encontrado"
                : "Digite ao menos 2 caracteres para buscar"}
            </ComboboxEmpty>

            <ComboboxList>
              {(client: Client) => (
                <ComboboxItem
                  key={client.id}
                  data-test={`client-suggestion-${client.id}`}
                >
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <span className="truncate font-semibold">{client.name}</span>
                    {(client.phone || client.email) && (
                      <span className="truncate text-xs text-muted-foreground">
                        {[client.phone, client.email].filter(Boolean).join(" • ")}
                      </span>
                    )}
                  </div>
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>

        {errorMessage && <FieldError>{errorMessage}</FieldError>}
      </Field>
    </FieldGroup>
  );
}
