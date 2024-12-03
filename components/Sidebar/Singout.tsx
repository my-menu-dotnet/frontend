"use client";

import { useAuth } from "@/hooks/useAuth";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useState } from "react";
import { FiLogOut } from "react-icons/fi";
import { MenuItem } from "react-pro-sidebar";
import Button from "../Button";

export default function Singout() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { logout } = useAuth();

  return (
    <>
      <MenuItem
        className="text-gray-500"
        icon={<FiLogOut />}
        component={<div onClick={onOpen} />}
      >
        Sair
      </MenuItem>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Sair</ModalHeader>
              <ModalBody>
                <p>Tem certeza que deseja sair?</p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="default"
                  variant="light"
                  onClick={onClose}
                  text="Cancelar"
                />
                <Button
                  color="danger"
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                  text="Sair"
                />
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
