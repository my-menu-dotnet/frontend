import Button from "@/components/Button";
import DeleteConfirmation from "@/components/DeleteConfirmation";
import Table from "@/components/Table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useDeleteClient from "@/hooks/mutate/useDeleteClient";
import useClients from "@/hooks/queries/client/useClients";
import { Client } from "@/types/api/Client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDelete } from "react-icons/md";
import ClientFormModal from "./ClientFormModal";

export default function ClientTable() {
  const { data: clients, isFetching } = useClients();
  const { mutateAsync: deleteClient, isPending: isDeleting } = useDeleteClient();
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deletingClient, setDeletingClient] = useState<Client | null>(null);

  const columns = useMemo<ColumnDef<Client, unknown>[]>(
    () => [
      {
        header: "Nome",
        cell: ({ row }) => (
          <div>
            <p className="font-semibold">{row.original.name}</p>
            {row.original.email && (
              <p className="text-xs text-muted-foreground">{row.original.email}</p>
            )}
          </div>
        ),
      },
      {
        header: "Telefone",
        cell: ({ row }) => <span>{row.original.phone || "-"}</span>,
      },
      {
        header: "CPF",
        cell: ({ row }) => <span>{row.original.cpf || "-"}</span>,
      },
      {
        header: "Cidade/UF",
        cell: ({ row }) => {
          const a = row.original.address;
          if (!a?.city && !a?.state) return <span className="text-muted-foreground">-</span>;
          return <span>{`${a?.city ?? ""}/${a?.state ?? ""}`}</span>;
        },
      },
      {
        header: "Cadastrado em",
        accessorFn: (row) =>
          format(new Date(row.created_at), "dd/MM/yyyy HH:mm"),
      },
      {
        id: "actions",
        maxSize: 50,
        cell: ({ row }) => (
          <div className="relative flex items-center justify-end gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <span
                  data-test={`client-edit-${row.original.id}`}
                  className="text-lg text-muted-foreground cursor-pointer active:opacity-50"
                  onClick={() => setEditingClient(row.original)}
                >
                  <CiEdit size={22} />
                </span>
              </TooltipTrigger>
              <TooltipContent>Editar cliente</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <span
                  data-test={`client-delete-${row.original.id}`}
                  className="text-lg text-destructive cursor-pointer active:opacity-50"
                  onClick={() => setDeletingClient(row.original)}
                >
                  <MdOutlineDelete size={22} />
                </span>
              </TooltipTrigger>
              <TooltipContent className="bg-destructive text-white">
                Excluir cliente
              </TooltipContent>
            </Tooltip>
          </div>
        ),
      },
    ],
    [clients?.content]
  );

  const handleConfirmDelete = async () => {
    if (!deletingClient) return;
    await deleteClient(deletingClient.id);
    setDeletingClient(null);
  };

  return (
    <>
      <Table
        aria-label="Clients"
        data={clients?.content || []}
        columns={columns}
        bodyProps={{
          emptyContent: "Nenhum cliente cadastrado",
          isLoading: isFetching,
        }}
      />

      {editingClient && (
        <ClientFormModal
          isOpen={Boolean(editingClient)}
          client={editingClient}
          onClose={() => setEditingClient(null)}
        />
      )}

      <DeleteConfirmation
        isOpen={Boolean(deletingClient)}
        onClose={() => setDeletingClient(null)}
        header="Remover cliente"
        body={
          <p>
            Tem certeza que deseja remover o cliente{" "}
            <span className="font-bold">{deletingClient?.name}</span>?
          </p>
        }
        onConfirm={handleConfirmDelete}
      />
      {isDeleting && (
        <div className="text-xs text-muted-foreground text-center mt-2">Removendo...</div>
      )}
      <div className="hidden">
        <Button text="" />
      </div>
    </>
  );
}
