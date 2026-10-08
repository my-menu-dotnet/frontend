"use client";

import { useAuth } from "@/hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FiLogOut } from "react-icons/fi";
import { MenuItem } from "react-pro-sidebar";
import Button from "../Button";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export default function Singout() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();

  const onOpen = () => setIsOpen(true);
  const onOpenChange = (open: boolean) => setIsOpen(open);
  const onClose = () => setIsOpen(false);

  return (
    <>
      <MenuItem
        className="text-gray-400"
        icon={<FiLogOut />}
        component={<div onClick={onOpen} />}
      >
        Sair
      </MenuItem>

      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sair</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja sair?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              color="default"
              variant="light"
              onPress={onClose}
              text="Cancelar"
            />
            <Button
              color="danger"
              onPress={() => {
                logout.mutateAsync().then(() => {
                  navigate({ to: "/" });
                });
                onClose();
              }}
              text="Sair"
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
